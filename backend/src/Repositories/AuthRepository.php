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


    public function checkForUser(string $email): array {
        $sql = 'SELECT * FROM users WHERE email = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$email]);

        return $stmt->fetch();
    }
}