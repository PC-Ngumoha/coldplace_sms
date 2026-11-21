<?php

namespace App\Repositories;

use App\Database;
use PDO;

class UnitRepository
{
    private PDO $conn;

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    public function showAllUnits(bool $activeOnly = true): array
    {
        $sql = 'SELECT id, code, name, is_base, status FROM units';
        if ($activeOnly) {
            $sql .= " WHERE status = 'active'";
        }
        $sql .= ' ORDER BY is_base DESC, code ASC';

        return $this->conn->query($sql)->fetchAll();
    }

    public function findById(int $id): array|false
    {
        $stmt = $this->conn->prepare(
            'SELECT id, code, name, is_base, status FROM units WHERE id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function findByCode(string $code): array|false
    {
        $stmt = $this->conn->prepare(
            'SELECT id, code, name, is_base, status FROM units WHERE code = ?'
        );
        $stmt->execute([$code]);
        return $stmt->fetch();
    }

    /** The system's base unit (kg). Resolved by flag, never by a hard-coded id. */
    public function findBase(): array|false
    {
        $stmt = $this->conn->query(
            'SELECT id, code, name, is_base, status FROM units WHERE is_base = 1 LIMIT 1'
        );
        return $stmt->fetch();
    }
}