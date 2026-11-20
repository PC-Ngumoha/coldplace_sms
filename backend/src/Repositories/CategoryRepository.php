<?php

namespace App\Repositories;

use App\Database;
use PDO;

class CategoryRepository
{
    private PDO $conn;

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }

    public function listAllCategories(): array
    {
        $sql = 'SELECT * FROM categories';
        return $this->conn->query($sql)->fetchAll();
    }

    public function retrieveCategory(int $id): array
    {
        $sql = 'SELECT * FROM categories WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    public function retrieveCategoryForUpdate(int $id): array
    {
        $sql = 'SELECT * FROM categories WHERE id = ? FOR UPDATE';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    public function createCategory(array $data): int 
    {
        $sql = 'INSERT INTO categories(name, created_by) VALUES (?, ?)';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['created_by']
        ]);

        return $this->conn->lastInsertId();
    }

    public function updateCategory(int $id, array $data): int
    {
        $sql = 'UPDATE categories SET name = ? WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $id
        ]);

        return $stmt->rowCount();
    }

    public function setStatus(int $id, string $status): int
    {
        $sql = 'UPDATE categories SET status = ? WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $status,
            $id           
        ]);

        return $stmt->rowCount();
    }
}