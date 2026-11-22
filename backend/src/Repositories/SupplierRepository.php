<?php
namespace App\Repositories;

use App\Database;
use PDO;

class SupplierRepository
{
    private PDO $conn;

    public function __construct(Database $db) {
        $this->conn = $db->connect();
    }

    public function list(bool $all, bool $activeOnly = true): array
    {
        $sql = "SELECT id, name, contact, notes, outlet_allowed, status
                FROM suppliers
                WHERE (:all = 1 OR outlet_allowed = 1)";

        if ($activeOnly) {
            $sql .= " AND status = 'active'";
        }

        $sql .= ' ORDER BY name ASC';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':all', $all ? 1 : 0, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function retrieve(int $id): array | bool
    {
        $sql = 'SELECT * FROM suppliers WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    public function retrieveForUpdate(int $id): array | bool
    {
        $sql = 'SELECT * FROM suppliers WHERE id = ? FOR UPDATE';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO suppliers (name, contact, notes, outlet_allowed, created_by)
                VALUES (?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['contact'] ?? null,
            $data['notes'] ?? null,
            !empty($data['outlet_allowed']) ? 1: 0,
            $data['created_by'],
        ]);

        return (int) $this->conn->lastInsertId();
    }

    public function update(int $id, array $data): int
    {
        $sql = 'UPDATE suppliers
                SET name = ?, contact = ?, notes = ?, outlet_allowed = ?
                WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['contact'] ?? null,
            $data['notes'] ?? null,
            !empty($data['outlet_allowed']) ? 1 : 0,
            $id
        ]);

        return $stmt->rowCount();
    }

    public function setStatus(int $id, string $new, string $expected): int
    {
        $sql = 'UPDATE suppliers SET status = ? WHERE id = ? AND status = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $new,
            $id,
            $expected
        ]);

        return $stmt->rowCount();
    }
}