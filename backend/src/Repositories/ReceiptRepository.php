<?php

namespace App\Repositories;

use App\Database;
use PDO;

class ReceiptRepository
{
    private PDO $conn;

    private const SELECT =
        'SELECT r.id, r.reference, r.supplier_id, s.name AS supplier_name,
                r.location_id, l.name AS location_name, r.receipt_date,
                r.delivery_ref, r.notes, r.created_by, u.name AS created_by_name, r.created_at,
                (SELECT COALESCE(SUM(rl.line_value), 0)
                 FROM receipt_lines rl WHERE rl.receipt_id = r.id) AS total_value
         FROM receipts r
         JOIN suppliers s ON s.id = r.supplier_id
         JOIN locations l ON l.id = r.location_id
         JOIN users     u ON u.id = r.created_by';

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    /** Pass a location id to scope the list (handlers), or null for all locations. */
    public function showAll(?int $locationId): array
    {
        $sql = self::SELECT;
        $params = [];

        if ($locationId !== null) {
            $sql .= ' WHERE r.location_id = ?';
            $params[] = $locationId;
        }

        $stmt = $this->conn->prepare($sql . ' ORDER BY r.receipt_date DESC, r.id DESC');
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    public function retrieve(int $id): array|false
    {
        $stmt = $this->conn->prepare(self::SELECT . ' WHERE r.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function linesFor(int $receiptId): array
    {
        $stmt = $this->conn->prepare(
            'SELECT rl.id, rl.product_id, p.sku, p.name AS product_name,
                    rl.unit_id, un.code AS unit_code,
                    rl.delivered_qty, rl.damaged_qty, rl.accepted_kg, rl.damaged_kg,
                    rl.damage_reason, rl.unit_cost, rl.line_value
             FROM receipt_lines rl
             JOIN products p  ON p.id  = rl.product_id
             JOIN units    un ON un.id = rl.unit_id
             WHERE rl.receipt_id = ?
             ORDER BY rl.id ASC'
        );
        $stmt->execute([$receiptId]);

        return $stmt->fetchAll();
    }

    /** Reference is NULL until set, because it is built from the new row's id. */
    public function add(array $d): int
    {
        $this->conn->prepare(
            'INSERT INTO receipts (supplier_id, location_id, receipt_date, delivery_ref, notes, created_by)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([
            $d['supplier_id'],
            $d['location_id'],
            $d['receipt_date'],
            $d['delivery_ref'],
            $d['notes'],
            $d['created_by'],
        ]);

        return (int) $this->conn->lastInsertId();
    }

    public function setReference(int $id, string $reference): void
    {
        $this->conn->prepare('UPDATE receipts SET reference = ? WHERE id = ?')
            ->execute([$reference, $id]);
    }

    public function addLine(int $receiptId, array $l): int
    {
        $this->conn->prepare(
            'INSERT INTO receipt_lines
               (receipt_id, product_id, unit_id, delivered_qty, damaged_qty,
                accepted_kg, damaged_kg, damage_reason, unit_cost, line_value)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $receiptId,
            $l['product_id'],
            $l['unit_id'],
            $l['delivered_qty'],
            $l['damaged_qty'],
            $l['accepted_kg'],
            $l['damaged_kg'],
            $l['damage_reason'],
            $l['unit_cost'],
            $l['line_value'],
        ]);

        return (int) $this->conn->lastInsertId();
    }
}