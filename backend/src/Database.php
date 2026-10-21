<?php

namespace App;

use PDO;

class Database
{
    public function __construct(private string $host, private string $dbName,
                                private string $user, private string $password) {}

    public function connect(): PDO
    {
        $dsn = "mysql:host=$this->host;dbname=$this->dbName;charset=utf8mb4";

        try {
            $pdo = new PDO($dsn, $this->user, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            $this->createRootAdmin($pdo);

            return $pdo;
        } catch (\PDOException $e) {
            throw new \PDOException("Database connection failed: ".$e->getMessage());
        }
    }

    private function createRootAdmin(PDO $pdo): void
    {
        $adminPass = $_ENV['ADMIN_PASSWORD'];

        if (!isset($adminPass)) {
            throw new \Error("No admin password for root admin");
        }

        // Seed a primary admin user if there are no users in the database
        if ((int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() === 0) {
            $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role, must_change_password)
                    VALUES (:name, :email, :password_hash, :role, :must_change_password)');

            // Binding values
            $stmt->bindValue(':name', 'Root Admin');
            $stmt->bindValue(':email', 'rootadmin@coldplace.com');
            $stmt->bindValue(':password_hash', password_hash($adminPass, PASSWORD_DEFAULT));
            $stmt->bindValue(':role', 'admin');
            $stmt->bindValue(':must_change_password', false, PDO::PARAM_INT);

            // Executing
            $stmt->execute();
        }
    }
}