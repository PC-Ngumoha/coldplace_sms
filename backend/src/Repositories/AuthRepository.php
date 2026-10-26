<?php

namespace App\Repositories;

use App\Database;
use PDO;

class AuthRepository
{
    private PDO $conn;

    public function __construct(Database $db) {
        $this->conn = $db->connect();
    }


    public function retrieveUserByEmail(string $email): array | bool {
        $sql = 'SELECT * FROM users WHERE email = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$email]);

        return $stmt->fetch();
    }

    public function retrieveUserById(int $userId): array | bool
    {
        $sql = 'SELECT * FROM users WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetch();
    }
}