<?php

namespace App\Repositories;

use App\Database;
use PDO;

class CustomerRepository
{
    private PDO $conn;

    private const SELECT =
        'SELECT c.id, c.name, c.customer_type, c.phone, c.address, c.status, c.created_at,
                COALESCE(st.sales_count, 0) AS sales_count,
                COALESCE(st.total_spent, 0) AS total_spent,
                st.last_purchase_date
         FROM customers c
         LEFT JOIN (
             SELECT s.customer_id,
                    COUNT(DISTINCT s.id) AS sales_count,
                    SUM(sl.line_total)   AS total_spent,
                    MAX(s.sale_date)     AS last_purchase_date
             FROM sales s
             JOIN sale_lines sl ON sl.sale_id = s.id
             GROUP BY s.customer_id
         ) st ON st.customer_id = c.id';

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    /** Behaviour figures are derived from sales on every read, never stored. */
    public function showAll(): array
    {
        return $this->conn->query(self::SELECT . ' ORDER BY c.name ASC')->fetchAll();
    }

    public function retrieve(int $id): array|false
    {
        $stmt = $this->conn->prepare(self::SELECT . ' WHERE c.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function retrieveForUpdate(int $id): array|false
    {
        $stmt = $this->conn->prepare('SELECT * FROM customers WHERE id = ? FOR UPDATE');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function recentSales(int $customerId, int $limit = 10): array
    {
        $stmt = $this->conn->prepare(
            'SELECT s.id, s.reference, s.sale_date, l.name AS location_name,
                    (SELECT COALESCE(SUM(sl.line_total), 0) FROM sale_lines sl WHERE sl.sale_id = s.id) AS total
             FROM sales s
             JOIN locations l ON l.id = s.location_id
             WHERE s.customer_id = :customer
             ORDER BY s.sale_date DESC, s.id DESC
             LIMIT :limit'
        );
        $stmt->bindValue(':customer', $customerId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /** Active customers only, for the sale form's suggestions. */
    public function search(string $q, int $limit = 8): array
    {
        $escaped = addcslashes($q, '%_\\');

        $stmt = $this->conn->prepare(
            "SELECT id, name, phone FROM customers
             WHERE status = 'active'
               AND (name LIKE :contains_name OR phone LIKE :contains_phone)
             ORDER BY (name LIKE :prefix) DESC, name ASC
             LIMIT :limit"
        );
        $stmt->bindValue(':contains_name', "%$escaped%");
        $stmt->bindValue(':contains_phone', "%$escaped%");
        $stmt->bindValue(':prefix', "$escaped%");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findByPhone(string $phone): array|false
    {
        $stmt = $this->conn->prepare(
            'SELECT id, name, customer_type, phone, address, status FROM customers WHERE phone = ?'
        );
        $stmt->execute([$phone]);
        return $stmt->fetch();
    }

    /** Case-insensitive through the column collation. Includes inactive customers. */
    public function findByName(string $name): array
    {
        $stmt = $this->conn->prepare(
            'SELECT id, name, customer_type, phone, address, status FROM customers WHERE name = ?'
        );
        $stmt->execute([$name]);
        return $stmt->fetchAll();
    }

    public function add(array $d): int
    {
        $this->conn->prepare(
            'INSERT INTO customers (name, customer_type, phone, address, created_by)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([
            $d['name'],
            $d['customer_type'] ?? 'individual',
            $d['phone'] ?? null,
            $d['address'] ?? null,
            $d['created_by'],
        ]);

        return (int) $this->conn->lastInsertId();
    }

    public function update(int $id, array $d): int
    {
        $stmt = $this->conn->prepare(
            'UPDATE customers SET name = ?, customer_type = ?, phone = ?, address = ? WHERE id = ?'
        );
        $stmt->execute([$d['name'], $d['customer_type'], $d['phone'], $d['address'], $id]);
        return $stmt->rowCount();
    }

    public function setStatus(int $id, string $new, string $expected): int
    {
        $stmt = $this->conn->prepare('UPDATE customers SET status = ? WHERE id = ? AND status = ?');
        $stmt->execute([$new, $id, $expected]);
        return $stmt->rowCount();
    }
}