<?php

namespace App\Repositories;

use App\Database;
use PDO;

class SaleRepository
{
    private PDO $conn;

    private const HEADER =
        'SELECT s.id, s.reference, s.location_id, l.name AS location_name,
                s.customer_id, c.name AS customer_name, s.sale_date,
                u.name AS created_by_name, s.created_at,
                (SELECT COALESCE(SUM(sl.line_total), 0) FROM sale_lines sl WHERE sl.sale_id = s.id) AS total,
                (SELECT COUNT(*) FROM sale_lines sl WHERE sl.sale_id = s.id) AS line_count,
                (SELECT SUM(sl.variance_amount) FROM sale_lines sl WHERE sl.sale_id = s.id) AS variance_total
         FROM sales s
         JOIN locations l ON l.id = s.location_id
         JOIN customers c ON c.id = s.customer_id
         JOIN users     u ON u.id = s.created_by';

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    /** Sales in a date window. Pass a location id to scope it (handlers). */
    public function showAll(string $from, string $to, ?int $locationId): array
    {
        $sql = self::HEADER . ' WHERE s.sale_date BETWEEN ? AND ?';
        $params = [$from, $to];

        if ($locationId !== null) {
            $sql .= ' AND s.location_id = ?';
            $params[] = $locationId;
        }

        $stmt = $this->conn->prepare($sql . ' ORDER BY s.sale_date DESC, s.id DESC');
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function retrieve(int $id): array|false
    {
        $stmt = $this->conn->prepare(self::HEADER . ' WHERE s.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function linesFor(int $saleId): array
    {
        $stmt = $this->conn->prepare(
            'SELECT sl.id, sl.product_id, p.sku, p.name AS product_name,
                    sl.unit_id, un.code AS unit_code, sl.quantity, sl.quantity_kg,
                    sl.applied_price, sl.line_total, sl.set_price, sl.set_price_total,
                    sl.variance_amount, sl.variance_percent, sl.variance_label
             FROM sale_lines sl
             JOIN products p  ON p.id  = sl.product_id
             JOIN units    un ON un.id = sl.unit_id
             WHERE sl.sale_id = ?
             ORDER BY sl.id ASC'
        );
        $stmt->execute([$saleId]);
        return $stmt->fetchAll();
    }

    public function add(array $d): int
    {
        $this->conn->prepare(
            'INSERT INTO sales (location_id, customer_id, sale_date, created_by) VALUES (?, ?, ?, ?)'
        )->execute([$d['location_id'], $d['customer_id'], $d['sale_date'], $d['created_by']]);

        return (int) $this->conn->lastInsertId();
    }

    public function setReference(int $id, string $reference): void
    {
        $this->conn->prepare('UPDATE sales SET reference = ? WHERE id = ?')->execute([$reference, $id]);
    }

    public function addLine(int $saleId, array $l): int
    {
        $this->conn->prepare(
            'INSERT INTO sale_lines
               (sale_id, product_id, unit_id, quantity, quantity_kg, applied_price, line_total,
                set_price, set_price_total, variance_amount, variance_percent, variance_label)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $saleId, $l['product_id'], $l['unit_id'], $l['quantity'], $l['quantity_kg'],
            $l['applied_price'], $l['line_total'], $l['set_price'], $l['set_price_total'],
            $l['variance_amount'], $l['variance_percent'], $l['variance_label'],
        ]);

        return (int) $this->conn->lastInsertId();
    }

    /** Running total for one location and business date. */
    public function dayTotal(int $locationId, string $date): string
    {
        $stmt = $this->conn->prepare(
            'SELECT COALESCE(SUM(sl.line_total), 0)
             FROM sales s JOIN sale_lines sl ON sl.sale_id = s.id
             WHERE s.location_id = ? AND s.sale_date = ?'
        );
        $stmt->execute([$locationId, $date]);
        return bcadd((string) $stmt->fetchColumn(), '0', 2);
    }

    /** A reopened date is open again, so only status 'closed' blocks a sale. */
    public function isDateClosed(int $locationId, string $date): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT 1 FROM daily_closes WHERE location_id = ? AND close_date = ? AND status = 'closed' LIMIT 1"
        );
        $stmt->execute([$locationId, $date]);
        return (bool) $stmt->fetchColumn();
    }
}