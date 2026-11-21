<?php

namespace App\Repositories;

use App\Database;
use PDO;

class ProductRepository
{
    private PDO $conn;

    private const SELECT =
        'SELECT p.id, p.sku, p.name, p.category_id, c.name AS category_name,
                p.description, p.min_stock_kg, p.status, p.created_by, p.created_at
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id';

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    /** Filters: search, category_id (int or 'none'), status */
    public function showAllProducts(): array
    {
        return $this->conn->query(self::SELECT . ' ORDER BY p.name ASC')->fetchAll();
    }

    public function retrieveProduct(int $id): array|false
    {
        $stmt = $this->conn->prepare(self::SELECT . ' WHERE p.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /** Call inside a transaction: locks the row until commit. */
    public function retrieveProductForUpdate(int $id): array|false
    {
        $stmt = $this->conn->prepare('SELECT * FROM products WHERE id = ? FOR UPDATE');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function addProduct(array $d): int
    {
        $this->conn->prepare(
            'INSERT INTO products (sku, name, category_id, description, min_stock_kg, created_by)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([
            $d['sku'], $d['name'], $d['category_id'], $d['description'],
            $d['min_stock_kg'], $d['created_by'],
        ]);

        return (int) $this->conn->lastInsertId();
    }

    public function updateProduct(int $id, array $d): int
    {
        $stmt = $this->conn->prepare(
            'UPDATE products
             SET name = ?, category_id = ?, description = ?, min_stock_kg = ?
             WHERE id = ?'
        );
        $stmt->execute([$d['name'], $d['category_id'], $d['description'], $d['min_stock_kg'], $id]);

        return $stmt->rowCount();
    }

    /** Conditional: only changes the row if it is still in the expected status. */
    public function setStatus(int $id, string $new, string $expected): int
    {
        $stmt = $this->conn->prepare('UPDATE products SET status = ? WHERE id = ? AND status = ?');
        $stmt->execute([$new, $id, $expected]);

        return $stmt->rowCount();
    }

    // ---- product_units ----

    public function addProductUnit(int $productId, int $unitId, string $kgPerUnit): void
    {
        $this->conn->prepare(
            'INSERT INTO product_units (product_id, unit_id, kg_per_unit) VALUES (?, ?, ?)'
        )->execute([$productId, $unitId, $kgPerUnit]);
    }

    public function updateProductUnit(int $productId, int $unitId, string $kgPerUnit): int
    {
        $stmt = $this->conn->prepare(
            'UPDATE product_units SET kg_per_unit = ? WHERE product_id = ? AND unit_id = ?'
        );
        $stmt->execute([$kgPerUnit, $productId, $unitId]);

        return $stmt->rowCount();
    }

    public function unitsForProduct(int $productId): array
    {
        return $this->unitsForProducts([$productId])[$productId] ?? [];
    }

    /** Returns [product_id => [unit rows]] in one query (avoids N+1 on lists). */
    public function unitsForProducts(array $productIds): array
    {
        if (!$productIds) {
            return [];
        }

        $in = implode(',', array_fill(0, count($productIds), '?'));
        $stmt = $this->conn->prepare(
            "SELECT pu.product_id, pu.unit_id, u.code, u.name, pu.kg_per_unit
             FROM product_units pu
             JOIN units u ON u.id = pu.unit_id
             WHERE pu.product_id IN ($in)
             ORDER BY u.is_base DESC, u.code ASC"
        );
        $stmt->execute(array_values($productIds));

        $grouped = [];
        foreach ($stmt->fetchAll() as $row) {
            $grouped[(int) $row['product_id']][] = $row;
        }
        return $grouped;
    }
}