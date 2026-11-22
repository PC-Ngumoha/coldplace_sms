<?php

namespace App\Services;

use App\Constants\Location;
use App\Constants\MovementType;
use App\Constants\Permissions;
use App\Constants\Product;
use App\Constants\Roles;
use App\Constants\AuditAction;
use App\Constants\SourceTable;
use App\Exceptions\AppException;
use App\Repositories\LocationRepository;
use App\Repositories\ProductRepository;
use App\Repositories\ReceiptRepository;
use App\Repositories\StockMovementRepository;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\Decimal;
use App\Helpers\TransactionManager;
use App\Policies\PermissionPolicy;

class ReceiptService
{
    private const MAX_LINES = 100;

    public function __construct(
        private ReceiptRepository $repo,
        private StockMovementRepository $movements,
        private ProductRepository $products,
        private LocationRepository $locations,
        private SupplierService $suppliers,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    public function list(Actor $actor): array
    {
        // $this->authorize($actor, Permissions::RECEIPTS_LIST);

        $rows = $this->repo->showAll($this->scopeLocation($actor));

        return array_map(fn ($r) => $this->presentHeader($r), $rows);
    }

    public function retrieve(Actor $actor, int $receiptId): array
    {
        // $this->authorize($actor, Permissions::RECEIPTS_RETRIEVE);

        $receipt = $this->repo->retrieve($receiptId);
        $scope   = $this->scopeLocation($actor);

        // A handler asking for another location's receipt gets 404, so its existence isn't revealed
        if (!$receipt || ($scope !== null && (int) $receipt['location_id'] !== $scope)) {
            throw new AppException('Not found', 404);
        }

        $out = $this->presentHeader($receipt);
        $out['lines'] = array_map(fn ($l) => [
            'id'            => (int) $l['id'],
            'product_id'    => (int) $l['product_id'],
            'sku'           => $l['sku'],
            'product_name'  => $l['product_name'],
            'unit_id'       => (int) $l['unit_id'],
            'unit_code'     => $l['unit_code'],
            'delivered_qty' => (string) $l['delivered_qty'],
            'damaged_qty'   => (string) $l['damaged_qty'],
            'accepted_kg'   => (string) $l['accepted_kg'],
            'damaged_kg'    => (string) $l['damaged_kg'],
            'damage_reason' => $l['damage_reason'],
            'unit_cost'     => (string) $l['unit_cost'],
            'line_value'    => (string) $l['line_value'],
        ], $this->repo->linesFor($receiptId));

        return $out;
    }

    // ---------- Create ----------

    public function create(Actor $actor, array $data): array
    {
        // $this->authorize($actor, Permissions::RECEIPTS_CREATE);

        // Cheap checks first, no database
        $supplierId = (int) ($data['supplier_id'] ?? 0);
        if ($supplierId <= 0) {
            throw new AppException('Supplier is required', 400);
        }

        $deliveryRef = trim((string) ($data['delivery_ref'] ?? ''));
        $notes       = trim((string) ($data['notes'] ?? ''));
        if (strlen($deliveryRef) > 100) {
            throw new AppException('Delivery reference is too long (max 100 characters)', 400);
        }
        if (strlen($notes) > 500) {
            throw new AppException('Notes are too long (max 500 characters)', 400);
        }

        $rawLines = $data['lines'] ?? null;
        if (!is_array($rawLines) || count($rawLines) === 0) {
            throw new AppException('At least one line is required', 400);
        }
        if (count($rawLines) > self::MAX_LINES) {
            throw new AppException('Too many lines in one receipt', 400);
        }

        // Location comes from the actor for handlers, and from the request only for Admin/Manager
        $location = $this->resolveLocation($actor, $data);

        // Outlets may only use suppliers flagged outlet_allowed
        $this->suppliers->assertUsableAt($supplierId, $location);

        $lines = $this->buildLines($rawLines);

        $receiptDate = (new \DateTimeImmutable('now', new \DateTimeZone('Africa/Lagos')))->format('Y-m-d');
        $locationId  = (int) $location['id'];

        return $this->tx->run(function () use (
            $actor, $supplierId, $locationId, $receiptDate, $deliveryRef, $notes, $lines
        ) {
            $id = $this->repo->add([
                'supplier_id'  => $supplierId,
                'location_id'  => $locationId,
                'receipt_date' => $receiptDate,
                'delivery_ref' => $deliveryRef === '' ? null : $deliveryRef,
                'notes'        => $notes === '' ? null : $notes,
                'created_by'   => $actor->userId,
            ]);

            $reference = 'RCV-' . str_replace('-', '', $receiptDate) . '-' . str_pad((string) $id, 5, '0', STR_PAD_LEFT);
            $this->repo->setReference($id, $reference);

            $total = '0.00';
            $audited = [];

            foreach ($lines as $line) {
                $lineId = $this->repo->addLine($id, $line);

                // Only accepted stock enters the ledger. Damaged stock never does.
                if (bccomp($line['accepted_kg'], '0', 3) > 0) {
                    $this->movements->add([
                        'product_id'    => $line['product_id'],
                        'location_id'   => $locationId,
                        'movement_type' => MovementType::RECEIPT,
                        'quantity_kg'   => $line['accepted_kg'],
                        'movement_date' => $receiptDate,
                        'source_table'  => SourceTable::RECEIPT_LINES,
                        'source_id'     => $lineId,
                        'reason'        => null,
                        'created_by'    => $actor->userId,
                    ]);
                }

                $total = bcadd($total, $line['line_value'], 2);
                $audited[] = [
                    'product_id'    => $line['product_id'],
                    'unit_id'       => $line['unit_id'],
                    'delivered_qty' => $line['delivered_qty'],
                    'damaged_qty'   => $line['damaged_qty'],
                    'accepted_kg'   => $line['accepted_kg'],
                    'unit_cost'     => $line['unit_cost'],
                    'line_value'    => $line['line_value'],
                ];
            }

            $this->audit->log(
                $actor, AuditAction::RECEIPT_CREATED, 'receipts', $id, null,
                [
                    'reference'    => $reference,
                    'supplier_id'  => $supplierId,
                    'location_id'  => $locationId,
                    'receipt_date' => $receiptDate,
                    'total_value'  => $total,
                    'lines'        => $audited,
                ]
            );

            return ['id' => $id, 'reference' => $reference];
        });
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !PermissionPolicy::can($actor->role, $permission)) {
    //         throw new AppException('Forbidden', 403);
    //     }
    // }

    /** Handlers are limited to their own location. Everyone else sees all (null). */
    private function scopeLocation(Actor $actor): ?int
    {
        if ($actor->role === Roles::CENTRAL || $actor->role === Roles::OUTLET) {
            if ($actor->locationId === null) {
                throw new AppException('Forbidden', 403);
            }
            return $actor->locationId;
        }
        return null;
    }

    private function resolveLocation(Actor $actor, array $data): array
    {
        $scope = $this->scopeLocation($actor);
        $locationId = $scope ?? (int) ($data['location_id'] ?? 0);   // request is read only for Admin/Manager

        if ($locationId <= 0) {
            throw new AppException('Location is required', 400);
        }

        $location = $this->locations->retrieveLocation($locationId);
        if (!$location || $location['status'] !== Location::ACTIVE) {
            throw new AppException('Location does not exist or is inactive', 400);
        }

        return $location;
    }

    /** Validates every line and computes the kg and money figures on the server. */
    private function buildLines(array $rawLines): array
    {
        $productIds = [];
        foreach ($rawLines as $raw) {
            $productIds[] = (int) ($raw['product_id'] ?? 0);
        }
        $unitsByProduct = $this->products->unitsForProducts(array_values(array_unique(array_filter($productIds))));

        $seen = [];
        $lines = [];

        foreach ($rawLines as $i => $raw) {
            $n = $i + 1;
            $productId = (int) ($raw['product_id'] ?? 0);
            $unitId    = (int) ($raw['unit_id'] ?? 0);

            if ($productId <= 0 || $unitId <= 0) {
                throw new AppException("Line $n: product and unit are required", 400);
            }

            $key = $productId . ':' . $unitId;
            if (isset($seen[$key])) {
                throw new AppException("Line $n: the same product and unit appear twice", 400);
            }
            $seen[$key] = true;

            $product = $this->products->retrieveProduct($productId);
            if (!$product || $product['status'] !== Product::ACTIVE) {
                throw new AppException("Line $n: product does not exist or is inactive", 400);
            }

            $kgPerUnit = null;
            foreach ($unitsByProduct[$productId] ?? [] as $u) {
                if ((int) $u['unit_id'] === $unitId) {
                    $kgPerUnit = (string) $u['kg_per_unit'];
                    break;
                }
            }
            if ($kgPerUnit === null) {
                throw new AppException("Line $n: this unit is not available for the product", 400);
            }

            $delivered = Decimal::qty(trim((string) ($raw['delivered_qty'] ?? '')), "Line $n delivered quantity");
            if (bccomp($delivered, '0', 3) <= 0) {
                throw new AppException("Line $n: delivered quantity must be greater than zero", 400);
            }

            $damagedRaw = trim((string) ($raw['damaged_qty'] ?? ''));
            $damaged = $damagedRaw === '' ? '0.000' : Decimal::qty($damagedRaw, "Line $n damaged quantity");
            if (bccomp($damaged, $delivered, 3) > 0) {
                throw new AppException("Line $n: damaged quantity cannot exceed delivered quantity", 400);
            }

            $reason = trim((string) ($raw['damage_reason'] ?? ''));
            if (bccomp($damaged, '0', 3) > 0 && $reason === '') {
                throw new AppException("Line $n: a reason is required when goods are damaged", 400);
            }
            if (strlen($reason) > 255) {
                throw new AppException("Line $n: damage reason is too long (max 255 characters)", 400);
            }

            $unitCost = Decimal::money(trim((string) ($raw['unit_cost'] ?? '')), "Line $n unit cost");

            $accepted = bcsub($delivered, $damaged, 3);

            // Supplier does not charge for damaged goods: value covers the accepted part only
            $lineValue = Decimal::mulRound($accepted, $unitCost, 2);
            if (strlen(explode('.', $lineValue)[0]) > 12) {
                throw new AppException("Line $n: value is too large", 400);
            }

            $lines[] = [
                'product_id'    => $productId,
                'unit_id'       => $unitId,
                'delivered_qty' => $delivered,
                'damaged_qty'   => $damaged,
                'accepted_kg'   => Decimal::mulRound($accepted, $kgPerUnit, 3),
                'damaged_kg'    => Decimal::mulRound($damaged, $kgPerUnit, 3),
                'damage_reason' => bccomp($damaged, '0', 3) > 0 ? $reason : null,
                'unit_cost'     => $unitCost,
                'line_value'    => $lineValue,
            ];
        }

        return $lines;
    }

    private function presentHeader(array $r): array
    {
        return [
            'id'              => (int) $r['id'],
            'reference'       => $r['reference'],
            'supplier_id'     => (int) $r['supplier_id'],
            'supplier_name'   => $r['supplier_name'],
            'location_id'     => (int) $r['location_id'],
            'location_name'   => $r['location_name'],
            'receipt_date'    => $r['receipt_date'],
            'delivery_ref'    => $r['delivery_ref'],
            'notes'           => $r['notes'],
            'created_by_name' => $r['created_by_name'],
            'created_at'      => $r['created_at'],
            'total_value'     => bcadd((string) $r['total_value'], '0', 2),
        ];
    }
}