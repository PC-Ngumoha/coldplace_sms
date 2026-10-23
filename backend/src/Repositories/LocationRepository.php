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
}