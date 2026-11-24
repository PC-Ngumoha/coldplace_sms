<?php

namespace App\Repositories;

use App\Database;
use PDO;

class PriceRepository
{
    private PDO $conn;

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    /** Every currently active price. */
    public function currentPrices(): array
    {
        return $this->conn->query(
            'SELECT pr.id, pr.product_id, pr.unit_id, pr.price, pr.effective_from,
                    u.name AS set_by_name
             FROM prices pr
             JOIN users u ON u.id = pr.created_by
             WHERE pr.effective_to IS NULL'
        )->fetchAll();
    }

    public function activeFor(int $productId, int $unitId): array|false
    {
        $stmt = $this->conn->prepare(
            'SELECT * FROM prices
             WHERE product_id = ? AND unit_id = ? AND effective_to IS NULL
             LIMIT 1'
        );
        $stmt->execute([$productId, $unitId]);
        return $stmt->fetch();
    }

    /** The price that applied on a given date (for sales, including back-dated ones). */
    public function priceOn(int $productId, int $unitId, string $date): array|false
    {
        $stmt = $this->conn->prepare(
            'SELECT id, price, effective_from, effective_to FROM prices
             WHERE product_id = ? AND unit_id = ?
               AND effective_from <= ?
               AND (effective_to IS NULL OR effective_to >= ?)
             ORDER BY effective_from DESC
             LIMIT 1'
        );
        $stmt->execute([$productId, $unitId, $date, $date]);
        return $stmt->fetch();
    }

    public function history(int $productId, ?int $unitId): array
    {
        $sql = 'SELECT pr.id, pr.product_id, pr.unit_id, un.code AS unit_code,
                       pr.price, pr.effective_from, pr.effective_to,
                       us.name AS set_by_name, pr.created_at
                FROM prices pr
                JOIN units un ON un.id = pr.unit_id
                JOIN users us ON us.id = pr.created_by
                WHERE pr.product_id = ?';
        $params = [$productId];

        if ($unitId !== null) {
            $sql .= ' AND pr.unit_id = ?';
            $params[] = $unitId;
        }

        $stmt = $this->conn->prepare($sql . ' ORDER BY pr.unit_id ASC, pr.effective_from DESC, pr.id DESC');
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function add(array $d): int
    {
        $this->conn->prepare(
            'INSERT INTO prices (product_id, unit_id, price, effective_from, created_by)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([$d['product_id'], $d['unit_id'], $d['price'], $d['effective_from'], $d['created_by']]);

        return (int) $this->conn->lastInsertId();
    }

    /** Ends the active price. The WHERE guard means only an open row can be closed. */
    public function close(int $id, string $effectiveTo): int
    {
        $stmt = $this->conn->prepare(
            'UPDATE prices SET effective_to = ? WHERE id = ? AND effective_to IS NULL'
        );
        $stmt->execute([$effectiveTo, $id]);
        return $stmt->rowCount();
    }

    /** Same-day correction: only valid while the row started today. */
    public function changeInPlace(int $id, string $price, int $userId): int
    {
        $stmt = $this->conn->prepare('UPDATE prices SET price = ?, created_by = ? WHERE id = ?');
        $stmt->execute([$price, $userId, $id]);
        return $stmt->rowCount();
    }
}