<?php

namespace App\Services;

use App\Constants\Permissions;
use App\Constants\Roles;
use App\Constants\Unit;
use App\Exceptions\AppException;
use App\Repositories\LocationRepository;
use App\Repositories\ProductRepository;
use App\Repositories\StockMovementRepository;
use App\Helpers\Actor;

class InventoryService
{
    public function __construct(
        private StockMovementRepository $movements,
        private ProductRepository $products,
        private LocationRepository $locations
    ) {}

    /** Balances per product and location, with a carton figure where a conversion exists. */
    public function balances(Actor $actor): array
    {
        // $this->authorize($actor);

        $rows = $this->movements->balances($this->scopeLocation($actor));

        $productIds = array_values(array_unique(array_map(fn ($r) => (int) $r['product_id'], $rows)));
        $unitsByProduct = $this->products->unitsForProducts($productIds);

        return array_map(function ($r) use ($unitsByProduct) {
            $balance = bcadd((string) $r['balance_kg'], '0', 3);

            return [
                'product_id'       => (int) $r['product_id'],
                'sku'              => $r['sku'],
                'product_name'     => $r['product_name'],
                'location_id'      => (int) $r['location_id'],
                'location_name'    => $r['location_name'],
                'balance_kg'       => $balance,
                'balance_cartons'  => $this->cartons($balance, $unitsByProduct[(int) $r['product_id']] ?? []),
                'last_movement_at' => $r['last_movement_at'],
            ];
        }, $rows);
    }

    /** Movement history for one product at one location, with a running balance. */
    public function ledger(Actor $actor, int $productId, int $locationId): array
    {
        // $this->authorize($actor);

        if ($productId <= 0 || $locationId <= 0) {
            throw new AppException('Product and location are required', 400);
        }

        // Handlers may only read their own location's ledger
        $scope = $this->scopeLocation($actor);
        if ($scope !== null && $scope !== $locationId) {
            throw new AppException('Forbidden', 403);
        }

        $product = $this->products->retrieveProduct($productId);
        if (!$product) {
            throw new AppException('Product not found', 404);
        }

        $location = $this->locations->retrieveLocation($locationId);
        if (!$location) {
            throw new AppException('Location not found', 404);
        }

        $balance = $this->movements->balance($productId, $locationId);
        $units   = $this->products->unitsForProduct($productId);

        // Rows come newest first, so the balance after the newest row is the current balance.
        // Each older row's "balance after" is the previous one minus the newer row's quantity.
        $running = $balance;
        $items = [];
        foreach ($this->movements->ledger($productId, $locationId) as $m) {
            $qty = bcadd((string) $m['quantity_kg'], '0', 3);

            $items[] = [
                'id'              => (int) $m['id'],
                'movement_type'   => $m['movement_type'],
                'quantity_kg'     => $qty,
                'balance_after'   => $running,
                'movement_date'   => $m['movement_date'],
                'source_table'    => $m['source_table'],
                'source_id'       => (int) $m['source_id'],
                'reason'          => $m['reason'],
                'created_by_name' => $m['created_by_name'],
                'created_at'      => $m['created_at'],
            ];

            $running = bcsub($running, $qty, 3);
        }

        return [
            'product' => [
                'id'   => (int) $product['id'],
                'sku'  => $product['sku'],
                'name' => $product['name'],
            ],
            'location' => [
                'id'   => (int) $location['id'],
                'name' => $location['name'],
            ],
            'balance_kg'      => $balance,
            'balance_cartons' => $this->cartons($balance, $units),
            'items'           => $items,
        ];
    }

    /**
     * Current balance for one product and location, for other services
     * (sales, transfers, adjustments) to check stock before they write.
     */
    public function balanceFor(int $productId, int $locationId): string
    {
        return $this->movements->balance($productId, $locationId);
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, Permissions::INVENTORY_VIEW)) {
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

    /** kg divided by the carton factor, or null when the product has no carton conversion. */
    private function cartons(string $balanceKg, array $units): ?string
    {
        foreach ($units as $u) {
            if ($u['code'] === Unit::CARTON && bccomp((string) $u['kg_per_unit'], '0', 3) > 0) {
                return bcdiv($balanceKg, (string) $u['kg_per_unit'], 3);
            }
        }
        return null;
    }
}