<?php

namespace App\Repositories;

use App\Database;
use PDO;

class UserRepository
{
    private PDO $conn;

    public function __construct(Database $db) {
        $this->conn = $db->connect();
    }

    public function addUser(array $data): int {

        $sql = 'INSERT INTO users(name, email, password_hash, role, location_id)
            VALUES (?, ?, ?, ?, ?)';

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            $data['name'],
            $data['email'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['role'],
            $data['location_id']
        ]);

        return $this->conn->lastInsertId();
    }

    public function showAllUsers(): array {
        $sql = 'SELECT * FROM users';

        return $this->conn->query($sql)->fetchAll();
    }

    public function retrieveUser(int $userId): array | bool {
        $sql = 'SELECT * FROM users WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetch();
    }

    public function retrieveUserForUpdate(int $userId): array | bool {
        $sql = 'SELECT * FROM users WHERE id = ? FOR UPDATE';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetch();
    }

    public function updateUser(int $userId, array $data): int {
        $sql = 'UPDATE users SET name = ?, email = ?,
                location_id = ?, role = ?
                WHERE id = ?';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['location_id'],
            $data['role'],
            $userId
        ]);

        return $stmt->rowCount();
    }

    public function updatePassword(int $userId, string $newPassword, bool $mustChangePassword = false): int {
        $sql = 'UPDATE users SET password_hash = ?, must_change_password = ? WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([ 
            password_hash($newPassword, PASSWORD_DEFAULT),
            (int) $mustChangePassword,
            $userId 
        ]);

        return $stmt->rowCount();
    }

    public function setStatus(int $userId, string $newStatus, string $oldStatus): int {
        $sql = 'UPDATE users SET status = ? WHERE id = ? AND status = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([ $newStatus, $userId, $oldStatus ]);

        return $stmt->rowCount();
    }
}