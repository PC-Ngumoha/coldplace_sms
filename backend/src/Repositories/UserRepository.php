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

    public function addUser(array $data): array {
        $name = $data['name'];
        $email = $data['email'];
        $password = trim($data['password']);
        $assignedRole = $data['role'];
        $locationId = (int) $data['location_id'];

        $sql = 'INSERT INTO users(name, email, password_hash, role, location_id)
            VALUES (:name, :email, :password_hash, :role, :location_id)';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':password_hash', password_hash($password, PASSWORD_DEFAULT));
        $stmt->bindValue(':role', $assignedRole);
        if ($locationId) {
            $stmt->bindValue(':location_id', $locationId, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':location_id', null, PDO::PARAM_NULL);
        }

        $stmt->execute();

        return [
            'message' => 'User created',
            'Rows Affected' => $stmt->rowCount()
            ];
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

    public function updateUser(int $userId, array $data): int {
        $sql = 'UPDATE users SET name = ?, email = ?,
                location_id = ?, role = ?, is_primary_handler = ?
                WHERE id = ?';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['location_id'],
            $data['role'],
            $data['is_primary_handler'],
            $userId
        ]);

        return $stmt->rowCount();
    }

    public function updatePassword(int $userId, string $newPassword): int {
        $sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([ $newPassword, $userId ]);

        return $stmt->rowCount();
    }

    public function setStatus(int $userId, string $status): int {
        $sql = 'UPDATE users SET status = ? WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([ $status, $userId ]);

        return $stmt->rowCount();
    }
}