<?php

namespace App\Repositories;

use App\Database;
use PDO;

class DailyCloseRepository
{
    private PDO $conn;

    private const SELECT =
        'SELECT dc.id, dc.location_id, l.name AS location_name, dc.close_date, dc.status,
                cu.name AS closed_by_name, dc.closed_at,
                ru.name AS reopened_by_name, dc.reopened_at
         FROM daily_closes dc
         JOIN locations l  ON l.id  = dc.location_id
         JOIN users     cu ON cu.id = dc.closed_by
         LEFT JOIN users ru ON ru.id = dc.reopened_by';

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    public function find(int $locationId, string $date): array|false
    {
        $stmt = $this->conn->prepare(self::SELECT . ' WHERE dc.location_id = ? AND dc.close_date = ?');
        $stmt->execute([$locationId, $date]);
        return $stmt->fetch();
    }

    /** Plain row, locked until the transaction ends. */
    public function findForUpdate(int $locationId, string $date): array|false
    {
        $stmt = $this->conn->prepare(
            'SELECT * FROM daily_closes WHERE location_id = ? AND close_date = ? FOR UPDATE'
        );
        $stmt->execute([$locationId, $date]);
        return $stmt->fetch();
    }

    /** Close and reopen rows in a window, optionally for one location. */
    public function between(string $from, string $to, ?int $locationId): array
    {
        $sql = self::SELECT . ' WHERE dc.close_date BETWEEN ? AND ?';
        $params = [$from, $to];

        if ($locationId !== null) {
            $sql .= ' AND dc.location_id = ?';
            $params[] = $locationId;
        }

        $stmt = $this->conn->prepare($sql . ' ORDER BY dc.close_date DESC, l.name ASC');
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function insertClosed(int $locationId, string $date, int $userId): int
    {
        $this->conn->prepare(
            "INSERT INTO daily_closes (location_id, close_date, status, closed_by) VALUES (?, ?, 'closed', ?)"
        )->execute([$locationId, $date, $userId]);

        return (int) $this->conn->lastInsertId();
    }

    /** Closing a date that was reopened. The audit log keeps the earlier history. */
    public function markClosed(int $id, int $userId): int
    {
        $stmt = $this->conn->prepare(
            "UPDATE daily_closes
             SET status = 'closed', closed_by = ?, closed_at = NOW(), reopened_by = NULL, reopened_at = NULL
             WHERE id = ? AND status = 'reopened'"
        );
        $stmt->execute([$userId, $id]);
        return $stmt->rowCount();
    }

    public function markReopened(int $id, int $userId): int
    {
        $stmt = $this->conn->prepare(
            "UPDATE daily_closes SET status = 'reopened', reopened_by = ?, reopened_at = NOW()
             WHERE id = ? AND status = 'closed'"
        );
        $stmt->execute([$userId, $id]);
        return $stmt->rowCount();
    }
}