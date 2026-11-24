<?php

namespace App\Services;

use App\Constants\Product;
use App\Constants\AuditAction;
use App\Exceptions\AppException;
use App\Repositories\PriceRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UnitRepository;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\Decimal;
use App\Helpers\TransactionManager;

class PriceService
{
    public function __construct(
        private PriceRepository $repo,
        private ProductRepository $products,
        private UnitRepository $units,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    /** Every active product with a price (or null) for each of its units. */
    public function current(Actor $actor): array
    {
        // $this->authorize($actor, Permissions::PRICES_LIST);

        $products = array_values(array_filter(
            $this->products->showAllProducts(),
            fn ($p) => $p['status'] === Product::ACTIVE
        ));
        $unitsBy = $this->products->unitsForProducts(array_map(fn ($p) => (int) $p['id'], $products));

        $active = [];
        foreach ($this->repo->currentPrices() as $row) {
            $active[$row['product_id'] . ':' . $row['unit_id']] = $row;
        }

        $baseId = (int) $this->requireBase()['id'];

        return array_map(function ($p) use ($unitsBy, $active, $baseId) {
            $pid = (int) $p['id'];
            $kgRow = $active[$pid . ':' . $baseId] ?? null;

            $units = array_map(function ($u) use ($pid, $active, $kgRow, $baseId) {
                $row = $active[$pid . ':' . $u['unit_id']] ?? null;
                $derived = null;

                if ($row === null && (int) $u['unit_id'] !== $baseId && $kgRow !== null) {
                    $derived = Decimal::mulRound((string) $kgRow['price'], (string) $u['kg_per_unit'], 2);
                }

                return [
                    'unit_id'        => (int) $u['unit_id'],
                    'unit_code'      => $u['code'],
                    'kg_per_unit'    => (string) $u['kg_per_unit'],
                    'price'          => $row ? (string) $row['price'] : null,   // null = not set
                    'derived_price'  => $derived,                              // shown when no exact price
                    'effective_from' => $row['effective_from'] ?? null,
                    'set_by_name'    => $row['set_by_name'] ?? null,
                ];
            }, $unitsBy[$pid] ?? []);

            return [
                'product_id'   => $pid,
                'sku'          => $p['sku'],
                'product_name' => $p['name'],
                'units'        => $units,
            ];
        }, $products);
    }

    public function history(Actor $actor, int $productId, ?int $unitId): array
    {
        // $this->authorize($actor, Permissions::PRICES_HISTORY);

        if (!$this->products->retrieveProduct($productId)) {
            throw new AppException('Product not found', 404);
        }

        return array_map(fn ($r) => [
            'id'             => (int) $r['id'],
            'unit_id'        => (int) $r['unit_id'],
            'unit_code'      => $r['unit_code'],
            'price'          => (string) $r['price'],
            'effective_from' => $r['effective_from'],
            'effective_to'   => $r['effective_to'],
            'set_by_name'    => $r['set_by_name'],
        ], $this->repo->history($productId, $unitId));
    }

    // ---------- Set ----------

    /** Returns the new row id and what happened: created, changed or unchanged. */
    public function set(Actor $actor, array $data): array
    {
        // $this->authorize($actor, Permissions::PRICES_SET);

        $productId = (int) ($data['product_id'] ?? 0);
        $unitId    = (int) ($data['unit_id'] ?? 0);
        if ($productId <= 0 || $unitId <= 0) {
            throw new AppException('Product and unit are required', 400);
        }

        $price = Decimal::money(trim((string) ($data['price'] ?? '')), 'Price');
        if (bccomp($price, '0', 2) <= 0) {
            throw new AppException('Price must be greater than zero', 400);
        }

        $product = $this->products->retrieveProduct($productId);
        if (!$product || $product['status'] !== Product::ACTIVE) {
            throw new AppException('Product does not exist or is inactive', 400);
        }

        $offered = false;
        foreach ($this->products->unitsForProduct($productId) as $u) {
            if ((int) $u['unit_id'] === $unitId) {
                $offered = true;
                break;
            }
        }
        if (!$offered) {
            throw new AppException('This unit is not available for the product', 400);
        }

        $now       = new \DateTimeImmutable('now', new \DateTimeZone('Africa/Lagos'));
        $today     = $now->format('Y-m-d');
        $yesterday = $now->modify('-1 day')->format('Y-m-d');

        return $this->tx->run(function () use ($actor, $productId, $unitId, $price, $today, $yesterday) {
            // Locking the product row serialises price changes for it. Locking the price row would not
            // work for a first price, since there is no row to lock yet.
            $this->products->retrieveProductForUpdate($productId);

            $current = $this->repo->activeFor($productId, $unitId);

            if ($current && bccomp((string) $current['price'], $price, 2) === 0) {
                return ['id' => (int) $current['id'], 'status' => 'unchanged'];
            }

            if ($current && $current['effective_from'] === $today) {
                // Changed again on the same day: correct the row instead of ending it before it began
                $this->repo->changeInPlace((int) $current['id'], $price, $actor->userId);

                $this->audit->log(
                    $actor, AuditAction::PRICE_CHANGED, 'prices', (int) $current['id'],
                    ['price' => (string) $current['price']],
                    ['price' => $price, 'product_id' => $productId, 'unit_id' => $unitId]
                );
                return ['id' => (int) $current['id'], 'status' => 'changed'];
            }

            if ($current) {
                $this->repo->close((int) $current['id'], $yesterday);
            }

            $id = $this->repo->add([
                'product_id'     => $productId,
                'unit_id'        => $unitId,
                'price'          => $price,
                'effective_from' => $today,
                'created_by'     => $actor->userId,
            ]);

            $this->audit->log(
                $actor,
                $current ? AuditAction::PRICE_CHANGED : AuditAction::PRICE_CREATED,
                'prices', $id,
                $current ? ['price' => (string) $current['price']] : null,
                ['price' => $price, 'product_id' => $productId, 'unit_id' => $unitId, 'effective_from' => $today]
            );

            return ['id' => $id, 'status' => $current ? 'changed' : 'created'];
        });
    }

    // ---------- Used by the sales service ----------

    /**
     * The official price for a product and unit on a date, or null if none exists.
     * Order: exact price for that unit, then kg price x kg_per_unit, otherwise null ("no set price").
     */
    public function resolve(int $productId, int $unitId, string $date): ?array
    {
        $exact = $this->repo->priceOn($productId, $unitId, $date);
        if ($exact) {
            return ['price' => (string) $exact['price'], 'source' => 'set'];
        }

        $baseId = (int) $this->requireBase()['id'];
        if ($unitId === $baseId) {
            return null;
        }

        $kg = $this->repo->priceOn($productId, $baseId, $date);
        if (!$kg) {
            return null;
        }

        foreach ($this->products->unitsForProduct($productId) as $u) {
            if ((int) $u['unit_id'] === $unitId) {
                return [
                    'price'  => Decimal::mulRound((string) $kg['price'], (string) $u['kg_per_unit'], 2),
                    'source' => 'derived',
                ];
            }
        }

        return null;
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, $permission)) {
    //         throw new AppException('Forbidden', 403);
    //     }
    // }

    private function requireBase(): array
    {
        $base = $this->units->findBase();
        if (!$base) {
            throw new \RuntimeException('Base unit is missing. Check the units seed.');
        }
        return $base;
    }
}