<?php

namespace App\Services;

use App\Constants\Location;
use App\Constants\MovementType;
// use App\Constants\Permissions;
use App\Constants\Product;
use App\Constants\Roles;
use App\Constants\SaleLabel;
use App\Constants\SourceTable;
use App\Constants\AuditAction;
use App\Exceptions\AppException;
use App\Repositories\LocationRepository;
use App\Repositories\ProductRepository;
use App\Repositories\SaleRepository;
use App\Repositories\StockMovementRepository;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\BusinessDay;
use App\Helpers\Decimal;
use App\Helpers\TransactionManager;

class SaleService
{
    private const MAX_LINES = 100;
    private const MAX_LIST_DAYS = 93;

    public function __construct(
        private SaleRepository $repo,
        private StockMovementRepository $movements,
        private ProductRepository $products,
        private LocationRepository $locations,
        private CustomerService $customers,
        private PriceService $prices,
        private InventoryService $inventory,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    /** Sales in a date window (default: the last 7 days). The window keeps the payload bounded. */
    public function list(Actor $actor, array $query): array
    {
        // $this->authorize($actor, Permissions::SALES_LIST);

        $to = BusinessDay::parse($query['to'] ?? null, 'to') ?? BusinessDay::latest();
        $from = BusinessDay::parse($query['from'] ?? null, 'from')
                ?? BusinessDay::today()->modify('-6 days')->format('Y-m-d');

        if ($from > $to) {
            throw new AppException('"from" must not be after "to"', 400);
        }
        $days = (int) (new \DateTimeImmutable($from))->diff(new \DateTimeImmutable($to))->days;
        if ($days > self::MAX_LIST_DAYS) {
            throw new AppException('Date range is too large (max ' . self::MAX_LIST_DAYS . ' days)', 400);
        }

        $rows = $this->repo->showAll($from, $to, $this->scopeLocation($actor));
        return array_map(fn ($r) => $this->presentHeader($r), $rows);
    }

    public function retrieve(Actor $actor, int $saleId): array
    {
        // $this->authorize($actor, Permissions::SALES_RETRIEVE);

        $sale  = $this->repo->retrieve($saleId);
        $scope = $this->scopeLocation($actor);

        if (!$sale || ($scope !== null && (int) $sale['location_id'] !== $scope)) {
            throw new AppException('Not found', 404);
        }

        $out = $this->presentHeader($sale);
        $out['lines'] = array_map(fn ($l) => [
            'id'               => (int) $l['id'],
            'product_id'       => (int) $l['product_id'],
            'sku'              => $l['sku'],
            'product_name'     => $l['product_name'],
            'unit_id'          => (int) $l['unit_id'],
            'unit_code'        => $l['unit_code'],
            'quantity'         => (string) $l['quantity'],
            'quantity_kg'      => (string) $l['quantity_kg'],
            'applied_price'    => (string) $l['applied_price'],
            'line_total'       => (string) $l['line_total'],
            'set_price'        => $l['set_price'] !== null ? (string) $l['set_price'] : null,
            'set_price_total'  => $l['set_price_total'] !== null ? (string) $l['set_price_total'] : null,
            'variance_amount'  => $l['variance_amount'] !== null ? (string) $l['variance_amount'] : null,
            'variance_percent' => $l['variance_percent'] !== null ? (string) $l['variance_percent'] : null,
            'variance_label'   => $l['variance_label'],
        ], $this->repo->linesFor($saleId));

        return $out;
    }

    // ---------- Create ----------

    public function create(Actor $actor, array $data): array
    {
        // $this->authorize($actor, Permissions::SALES_CREATE);

        $location   = $this->resolveLocation($actor, $data);
        $locationId = (int) $location['id'];

        $todayStr = BusinessDay::latest();
        $saleDate = $this->resolveSaleDate($data['sale_date'] ?? null);
        $backDated = $saleDate !== $todayStr;

        $customerInput = $data['customer'] ?? null;
        if (!is_array($customerInput)
            || ((int) ($customerInput['id'] ?? 0) <= 0 && trim((string) ($customerInput['name'] ?? '')) === '')) {
            throw new AppException('Customer name is required', 400);
        }

        $rawLines = $data['lines'] ?? null;
        if (!is_array($rawLines) || count($rawLines) === 0) {
            throw new AppException('At least one line is required', 400);
        }
        if (count($rawLines) > self::MAX_LINES) {
            throw new AppException('Too many lines in one sale', 400);
        }

        // Validates every line and works out prices, kg and variance on the server
        $lines = $this->buildLines($rawLines, $saleDate);

        return $this->tx->run(function () use ($actor, $locationId, $saleDate, $backDated, $customerInput, $lines) {
            if ($this->repo->isDateClosed($locationId, $saleDate)) {
                throw new AppException('This business date is closed. A Manager or Admin must reopen it.', 409);
            }

            // Total kg per product, because two lines of one product (kg and carton) share one stock pool
            $kgByProduct = [];
            $names = [];
            foreach ($lines as $l) {
                $kgByProduct[$l['product_id']] = bcadd($kgByProduct[$l['product_id']] ?? '0.000', $l['quantity_kg'], 3);
                $names[$l['product_id']] = $l['product_name'];
            }
            ksort($kgByProduct);   // fixed lock order avoids deadlocks

            $allowNegative = $this->allowNegativeStock();
            foreach ($kgByProduct as $productId => $kg) {
                // Locking the product row serialises concurrent sales of the same product
                $this->products->retrieveProductForUpdate($productId);

                if (!$allowNegative) {
                    $available = $this->inventory->balanceFor($productId, $locationId);
                    if (bccomp($available, $kg, 3) < 0) {
                        throw new AppException(
                            "Not enough stock for {$names[$productId]}: {$available} kg available, {$kg} kg requested", 409);
                    }
                }
            }

            $customer = $this->customers->resolveForSale($actor, $customerInput);

            $saleId = $this->repo->add([
                'location_id' => $locationId,
                'customer_id' => $customer['id'],
                'sale_date'   => $saleDate,
                'created_by'  => $actor->userId,
            ]);

            $reference = 'SAL-' . str_replace('-', '', $saleDate) . '-' . str_pad((string) $saleId, 5, '0', STR_PAD_LEFT);
            $this->repo->setReference($saleId, $reference);

            $total = '0.00';
            $audited = [];

            foreach ($lines as $l) {
                $lineId = $this->repo->addLine($saleId, $l);

                $this->movements->add([
                    'product_id'    => $l['product_id'],
                    'location_id'   => $locationId,
                    'movement_type' => MovementType::SALE,
                    'quantity_kg'   => bcsub('0', $l['quantity_kg'], 3),   // negative: stock leaves
                    'movement_date' => $saleDate,
                    'source_table'  => SourceTable::SALE_LINES,
                    'source_id'     => $lineId,
                    'reason'        => null,
                    'created_by'    => $actor->userId,
                ]);

                $total = bcadd($total, $l['line_total'], 2);
                $audited[] = [
                    'product_id'     => $l['product_id'],
                    'unit_id'        => $l['unit_id'],
                    'quantity'       => $l['quantity'],
                    'applied_price'  => $l['applied_price'],
                    'set_price'      => $l['set_price'],
                    'line_total'     => $l['line_total'],
                    'variance_label' => $l['variance_label'],
                ];
            }

            $this->audit->log(
                $actor, AuditAction::SALE_CREATED, 'sales', $saleId, null,
                [
                    'reference'        => $reference,
                    'location_id'      => $locationId,
                    'customer_id'      => $customer['id'],
                    'customer_outcome' => $customer['outcome'],
                    'sale_date'        => $saleDate,
                    'back_dated'       => $backDated,
                    'total'            => $total,
                    'lines'            => $audited,
                ],
                $backDated ? 'back_dated' : null
            );

            return [
                'id'        => $saleId,
                'reference' => $reference,
                'sale_date' => $saleDate,
                'customer'  => ['id' => $customer['id'], 'name' => $customer['name'], 'outcome' => $customer['outcome']],
                'total'     => $total,
                'day_total' => $this->repo->dayTotal($locationId, $saleDate),
            ];
        });
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, $permission)) {
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

    /** Today or up to 3 days earlier, in Lagos time. Never a future date. */
    private function resolveSaleDate(mixed $raw): string
    {
        $date = BusinessDay::parse($raw, 'sale') ?? BusinessDay::latest();
        if (BusinessDay::position($date) !== 'within') {
            throw new AppException(
                'Sale date must be today or within the previous ' . BusinessDay::BACKDATE_DAYS . ' days', 400);
        }
        return $date;
    }

    /** TODO: read the global negative-stock switch from the settings table. */
    private function allowNegativeStock(): bool
    {
        return false;
    }

    private function buildLines(array $rawLines, string $saleDate): array
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

            $qty = Decimal::qty(trim((string) ($raw['quantity'] ?? '')), "Line $n quantity");
            if (bccomp($qty, '0', 3) <= 0) {
                throw new AppException("Line $n: quantity must be greater than zero", 400);
            }

            // Official price on the sale date: exact unit price, else derived from kg, else null
            $set = $this->prices->resolve($productId, $unitId, $saleDate);

            $appliedRaw = trim((string) ($raw['applied_price'] ?? ''));
            if ($appliedRaw === '') {
                if ($set === null) {
                    throw new AppException("Line $n: no set price exists, enter the selling price", 400);
                }
                $applied = $set['price'];
            } else {
                $applied = Decimal::money($appliedRaw, "Line $n price");
                if (bccomp($applied, '0', 2) <= 0) {
                    throw new AppException("Line $n: price must be greater than zero", 400);
                }
            }

            $lineTotal = Decimal::mulRound($qty, $applied, 2);
            if (strlen(explode('.', $lineTotal)[0]) > 12) {
                throw new AppException("Line $n: value is too large", 400);
            }

            $setPrice = $set['price'] ?? null;
            $setTotal = $setPrice !== null ? Decimal::mulRound($qty, $setPrice, 2) : null;
            [$vAmount, $vPercent, $label] = $this->variance($lineTotal, $setTotal);

            $lines[] = [
                'product_id'       => $productId,
                'product_name'     => $product['name'],
                'unit_id'          => $unitId,
                'quantity'         => $qty,
                'quantity_kg'      => Decimal::mulRound($qty, $kgPerUnit, 3),
                'applied_price'    => $applied,
                'line_total'       => $lineTotal,
                'set_price'        => $setPrice,
                'set_price_total'  => $setTotal,
                'variance_amount'  => $vAmount,
                'variance_percent' => $vPercent,
                'variance_label'   => $label,
            ];
        }

        return $lines;
    }

    /** Returns [amount, percent, label]. Without a set price, nothing is invented. */
    private function variance(string $lineTotal, ?string $setTotal): array
    {
        if ($setTotal === null) {
            return [null, null, SaleLabel::NONE];
        }

        $amount = bcsub($lineTotal, $setTotal, 2);
        $cmp = bccomp($amount, '0', 2);
        $label = $cmp > 0 ? SaleLabel::PROFIT : ($cmp < 0 ? SaleLabel::LOSS : SaleLabel::AT_SET);

        $percent = bccomp($setTotal, '0', 2) > 0
            ? Decimal::round(bcdiv(bcmul($amount, '100', 8), $setTotal, 8), 2)
            : null;

        return [$amount, $percent, $label];
    }

    private function presentHeader(array $r): array
    {
        return [
            'id'              => (int) $r['id'],
            'reference'       => $r['reference'],
            'location_id'     => (int) $r['location_id'],
            'location_name'   => $r['location_name'],
            'customer_id'     => (int) $r['customer_id'],
            'customer_name'   => $r['customer_name'],
            'sale_date'       => $r['sale_date'],
            'created_by_name' => $r['created_by_name'],
            'created_at'      => $r['created_at'],
            'total'           => bcadd((string) $r['total'], '0', 2),
            'line_count'      => (int) $r['line_count'],
            'variance_total'  => $r['variance_total'] !== null ? bcadd((string) $r['variance_total'], '0', 2) : null,
        ];
    }
}