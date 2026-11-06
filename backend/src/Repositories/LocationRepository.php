<?php

namespace App\Repositories;

use App\Database;
use PDO;

class LocationRepository
{
    private PDO $conn;

    public function __construct(Database $db)
    {
        $this->conn = $db->connect();
    }


    public function showAllLocations(?int $userId = null): array
    {
        if (!$userId) {
            $sql = 'SELECT * FROM locations';

            return $this->conn->query($sql)->fetchAll();
        } else {
            // Special case for outlet role: Get the location based on the userId
            $sql = 'SELECT loc.* FROM users usr
                    JOIN locations loc ON loc.id = usr.location_id
                    WHERE usr.id = ?';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$userId]);
            return $stmt->fetchAll();
        }
    }

    public function retrieveLocation(int $locationId): array | bool
    {
        $sql = 'SELECT * FROM locations WHERE id = ?';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$locationId]);

        return $stmt->fetch();
    }

    public function createLocation(array $data): int
    {
        $sql = 'INSERT INTO locations (name, address) VALUES (? , ?)';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['address']
        ]);

        return $stmt->rowCount();
    }

    public function updateLocation(int $locationId, array $data): int
    {
        $sql = 'UPDATE locations SET name = ?, address = ?
                WHERE id = ?';
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['address'],
            $locationId
        ]);

        return $stmt->rowCount();
    }

    public function setStatus(int $locationId, string $status): int
    {
        $sql = 'UPDATE locations SET status = ? WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$status, $locationId]);

        return $stmt->rowCount();
    }

    public function deleteLocation(int $locationId): int
    {
        $sql = 'DELETE FROM locations WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([ $locationId ]);

        return $stmt->rowCount();
    }
}