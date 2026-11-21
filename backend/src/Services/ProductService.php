<?php

namespace App\Services;

use App\Constants\Product;
use App\Constants\Unit;
use App\Constants\AuditAction;
use App\Exceptions\AppException;
use App\Repositories\CategoryRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UnitRepository;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\TransactionManager;

class ProductService
{
    public function __construct(
        private ProductRepository $repo,
        private UnitRepository $units,
        private CategoryRepository $categories,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    public function list(): array
    {
        // $this->authorize($actor, Permissions::PRODUCTS_LIST);

        $rows  = $this->repo->showAllProducts();
        $units = $this->repo->unitsForProducts(array_map(fn ($r) => (int) $r['id'], $rows));

        return array_map(fn ($r) => $this->present($r, $units[(int) $r['id']] ?? []), $rows);
    }

    public function retrieve(int $productId): array
    {
        // $this->authorize($actor, Permissions::PRODUCTS_RETRIEVE);

        $product = $this->repo->retrieveProduct($productId);
        if (!$product) {
            throw new AppException('Not found', 404);
        }

        return $this->present($product, $this->repo->unitsForProduct($productId));
    }

    // ---------- Create ----------

    public function create(Actor $actor, array $data): int
    {
        // $this->authorize($actor, Permissions::PRODUCTS_CREATE);

        $in  = $this->validate($data);
        $sku = strtoupper(trim((string) ($data['sku'] ?? '')));
        if ($sku === '' || strlen($sku) > 50) {
            throw new AppException('SKU is required (max 50 characters)', 400);
        }

        $this->assertCategoryUsable($in['category_id']);

        $base   = $this->requireUnit($this->units->findBase());
        $carton = $in['kg_per_carton'] !== null
            ? $this->requireUnit($this->units->findByCode(Unit::CARTON))
            : null;

        try {
            return $this->tx->run(function () use ($actor, $in, $sku, $base, $carton) {
                $id = $this->repo->addProduct([
                    'sku'          => $sku,
                    'name'         => $in['name'],
                    'category_id'  => $in['category_id'],
                    'description'  => $in['description'],
                    'min_stock_kg' => $in['min_stock_kg'],
                    'created_by'   => $actor->userId,
                ]);

                // Every product is sold in kg. The client never sends this row.
                $this->repo->addProductUnit($id, (int) $base['id'], '1.000');

                // Carton row exists only when a conversion was entered.
                if ($carton !== null) {
                    $this->repo->addProductUnit($id, (int) $carton['id'], $in['kg_per_carton']);
                }

                $this->audit->log(
                    $actor, AuditAction::PRODUCT_CREATED, 'products', $id, null,
                    [
                        'sku'           => $sku,
                        'name'          => $in['name'],
                        'category_id'   => $in['category_id'],
                        'description'   => $in['description'],
                        'min_stock_kg'  => $in['min_stock_kg'],
                        'kg_per_carton' => $in['kg_per_carton'],
                    ]
                );

                return $id;
            });
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {   // category was validated, so this is the SKU
                throw new AppException('A product with this SKU already exists', 409);
            }
            throw $e;
        }
    }

    // ---------- Update ----------

    public function update(Actor $actor, int $productId, array $data): int
    {
        // $this->authorize($actor, Permissions::PRODUCTS_EDIT);

        $in = $this->validate($data);

        return $this->tx->run(function () use ($actor, $productId, $data, $in) {
            $old = $this->repo->retrieveProductForUpdate($productId);
            if (!$old) {
                throw new AppException('Not found', 404);
            }

            $oldCategory = $old['category_id'] !== null ? (int) $old['category_id'] : null;
            if ($in['category_id'] !== $oldCategory) {
                $this->assertCategoryUsable($in['category_id']);
            }

            // Carton conversion: absent = unchanged, value = set or change, blank = rejected
            $oldCarton = $this->cartonFactor($productId);
            $newCarton = $oldCarton;
            if (array_key_exists('kg_per_carton', $data)) {
                if ($in['kg_per_carton'] === null) {
                    if ($oldCarton !== null) {
                        throw new AppException('A carton conversion cannot be removed once set', 409);
                    }
                } else {
                    $newCarton = $in['kg_per_carton'];
                }
            }

            $oldMin = bcadd((string) $old['min_stock_kg'], '0', 3);

            // No-op: no write, no audit noise
            if ($old['name'] === $in['name']
                && $oldCategory === $in['category_id']
                && $old['description'] === $in['description']
                && $oldMin === $in['min_stock_kg']
                && $oldCarton === $newCarton) {
                return 0;
            }

            $this->repo->updateProduct($productId, [
                'name'         => $in['name'],
                'category_id'  => $in['category_id'],
                'description'  => $in['description'],
                'min_stock_kg' => $in['min_stock_kg'],
            ]);

            if ($newCarton !== $oldCarton) {
                $carton = $this->requireUnit($this->units->findByCode(Unit::CARTON));
                if ($oldCarton === null) {
                    $this->repo->addProductUnit($productId, (int) $carton['id'], $newCarton);
                } else {
                    $this->repo->updateProductUnit($productId, (int) $carton['id'], $newCarton);
                }
            }

            $this->audit->log(
                $actor, AuditAction::PRODUCT_UPDATED, 'products', $productId,
                [
                    'name'          => $old['name'],
                    'category_id'   => $oldCategory,
                    'description'   => $old['description'],
                    'min_stock_kg'  => $oldMin,
                    'kg_per_carton' => $oldCarton,
                ],
                [
                    'name'          => $in['name'],
                    'category_id'   => $in['category_id'],
                    'description'   => $in['description'],
                    'min_stock_kg'  => $in['min_stock_kg'],
                    'kg_per_carton' => $newCarton,
                ]
            );

            return 1;
        });
    }

    // ---------- Status ----------

    public function deactivate(Actor $actor, int $productId): int
    {
        // $this->authorize($actor, Permissions::PRODUCTS_DEACTIVATE);
        // TODO: block when the product has stock above zero at any location
        return $this->changeStatus($actor, $productId, Product::ACTIVE, Product::INACTIVE,
            AuditAction::PRODUCT_DEACTIVATED);
    }

    public function activate(Actor $actor, int $productId): int
    {
        // $this->authorize($actor, Permissions::PRODUCTS_ACTIVATE);
        return $this->changeStatus($actor, $productId, Product::INACTIVE, Product::ACTIVE,
            AuditAction::PRODUCT_ACTIVATED);
    }

    private function changeStatus(Actor $actor, int $id, string $from, string $to, string $action): int
    {
        return $this->tx->run(function () use ($actor, $id, $from, $to, $action) {
            $product = $this->repo->retrieveProductForUpdate($id);
            if (!$product) {
                throw new AppException('Not found', 404);
            }
            if ($product['status'] !== $from) {
                return 0;   // already in the target state
            }

            $rows = $this->repo->setStatus($id, $to, $from);
            if ($rows === 1) {
                $this->audit->log($actor, $action, 'products', $id,
                    ['status' => $from], ['status' => $to]);
            }

            return $rows;
        });
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, $permission)) {
    //         throw new AppException('Forbidden', 403);
    //     }
    // }

    /** Syntactic validation and normalisation. No database access. */
    private function validate(array $data): array
    {
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '' || strlen($name) > 200) {
            throw new AppException('Name is required (max 200 characters)', 400);
        }

        $description = trim((string) ($data['description'] ?? ''));
        if (strlen($description) > 1000) {
            throw new AppException('Description is too long (max 1000 characters)', 400);
        }

        $categoryId = null;
        if (isset($data['category_id']) && $data['category_id'] !== '' && $data['category_id'] !== null) {
            $categoryId = (int) $data['category_id'];
            if ($categoryId <= 0) {
                throw new AppException('Invalid category', 400);
            }
        }

        // Blank means "no alert", stored as 0.000
        $minRaw = trim((string) ($data['min_stock_kg'] ?? ''));
        $min = $minRaw === '' ? '0.000' : $this->decimal($minRaw, 'Minimum stock level');

        $cartonRaw = trim((string) ($data['kg_per_carton'] ?? ''));
        $carton = null;
        if ($cartonRaw !== '') {
            $carton = $this->decimal($cartonRaw, 'Kg per carton');
            if (bccomp($carton, '0', 3) <= 0) {
                throw new AppException('Kg per carton must be greater than zero', 400);
            }
        }

        return [
            'name'          => $name,
            'description'   => $description === '' ? null : $description,
            'category_id'   => $categoryId,
            'min_stock_kg'  => $min,
            'kg_per_carton' => $carton,
        ];
    }

    /** Accepts up to 9 integer digits and 3 decimals (fits DECIMAL(12,3)). Returns scale-3 string. */
    private function decimal(string $value, string $label): string
    {
        if (!preg_match('/^\d{1,9}(\.\d{1,3})?$/', $value)) {
            throw new AppException("$label must be a number with up to 3 decimal places", 400);
        }
        return bcadd($value, '0', 3);
    }

    private function assertCategoryUsable(?int $categoryId): void
    {
        if ($categoryId === null) {
            return;   // shown as "Uncategorized" in the frontend
        }
        $category = $this->categories->retrieveCategory($categoryId);
        if (!$category || $category['status'] !== 'active') {
            throw new AppException('Category does not exist or is inactive', 400);
        }
    }

    /** Fail loudly if the seed data is missing, instead of creating broken products. */
    private function requireUnit(array|false $unit): array
    {
        if (!$unit) {
            throw new \RuntimeException('Required units are missing. Check the units seed.');
        }
        return $unit;
    }

    private function cartonFactor(int $productId): ?string
    {
        foreach ($this->repo->unitsForProduct($productId) as $u) {
            if ($u['code'] === Unit::CARTON) {
                return bcadd((string) $u['kg_per_unit'], '0', 3);
            }
        }
        return null;
    }

    private function present(array $p, array $units): array
    {
        return [
            'id'            => (int) $p['id'],
            'sku'           => $p['sku'],
            'name'          => $p['name'],
            'category_id'   => $p['category_id'] !== null ? (int) $p['category_id'] : null,
            'category_name' => $p['category_name'] ?? null,   // null renders as "Uncategorized"
            'description'   => $p['description'],
            'min_stock_kg'  => (string) $p['min_stock_kg'],   // decimals stay strings
            'status'        => $p['status'],
            'units'         => array_map(fn ($u) => [
                'unit_id'     => (int) $u['unit_id'],
                'code'        => $u['code'],
                'name'        => $u['name'],
                'kg_per_unit' => (string) $u['kg_per_unit'],
            ], $units),
        ];
    }
}