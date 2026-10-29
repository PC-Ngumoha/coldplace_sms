<?php

namespace App\Repositories;

use App\Database;
use PDO;

class LocationRepository
{
    private PDO $conn;

    public function __construct(Database $db) {
        $this->conn = $db->connect();
    }


    public function showAllLocations(): array {
        $sql = 'SELECT * FROM locations';

        return $this->conn->query($sql)->fetchAll();
    }

    public function retrieveLocation(int $locationId): array | bool {
        $sql = 'SELECT * FROM locations WHERE id = ?';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$locationId]);

        return $stmt->fetch();
    }

    public function updateLocation(int $locationId, array $data): int {
        $sql = 'UPDATE locations SET name = ?, address = ?, status = ?
                WHERE id = ?';
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['address'],
            $data['status'],
            $locationId
        ]);

        return $stmt->rowCount();
    }
}