<?php

namespace App\Repositories;

use App\Database;
use PDO;

class StockMovementRepository
{
    private PDO $conn;

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    /** Insert-only. Corrections are new reversal rows, never edits. */
    public function add(array $d): int
    {
        $this->conn->prepare(
            'INSERT INTO stock_movements
               (product_id, location_id, movement_type, quantity_kg, movement_date,
                source_table, source_id, reason, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $d['product_id'],
            $d['location_id'],
            $d['movement_type'],
            $d['quantity_kg'],
            $d['movement_date'],
            $d['source_table'],
            $d['source_id'],
            $d['reason'] ?? null,
            $d['created_by'],
        ]);

        return (int) $this->conn->lastInsertId();
    }

    /** Balance in kg for one product at one location, as a scale-3 string. */
    public function balance(int $productId, int $locationId): string
    {
        $stmt = $this->conn->prepare(
            'SELECT COALESCE(SUM(quantity_kg), 0)
             FROM stock_movements WHERE product_id = ? AND location_id = ?'
        );
        $stmt->execute([$productId, $locationId]);

        return bcadd((string) $stmt->fetchColumn(), '0', 3);
    }

    /** Balances for every product and location that has had a movement. Pass a location to scope it. */
    public function balances(?int $locationId = null): array
    {
        $sql = 'SELECT sm.product_id, p.sku, p.name AS product_name,
                       sm.location_id, l.name AS location_name,
                       SUM(sm.quantity_kg) AS balance_kg,
                       MAX(sm.created_at) AS last_movement_at
                FROM stock_movements sm
                JOIN products  p ON p.id = sm.product_id
                JOIN locations l ON l.id = sm.location_id';
        $params = [];

        if ($locationId !== null) {
            $sql .= ' WHERE sm.location_id = ?';
            $params[] = $locationId;
        }

        $sql .= ' GROUP BY sm.product_id, p.sku, p.name, sm.location_id, l.name
                  ORDER BY l.name ASC, p.name ASC';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    /** Full ledger for one product at one location, newest first. Capped for safety. */
    public function ledger(int $productId, int $locationId, int $limit = 500): array
    {
        $stmt = $this->conn->prepare(
            'SELECT sm.id, sm.movement_type, sm.quantity_kg, sm.movement_date,
                    sm.source_table, sm.source_id, sm.reason,
                    sm.created_by, u.name AS created_by_name, sm.created_at
             FROM stock_movements sm
             JOIN users u ON u.id = sm.created_by
             WHERE sm.product_id = :product AND sm.location_id = :location
             ORDER BY sm.id DESC
             LIMIT :limit'
        );
        $stmt->bindValue(':product', $productId, PDO::PARAM_INT);
        $stmt->bindValue(':location', $locationId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}