<?php
namespace App\Repositories;

use App\Database;
use PDO;

class LogsRepository
{
    private PDO $conn;

    public function __construct(private Database $db)
    {
        $this->conn = $db->connect();
    }

    public function list(): array
    {
        $sql = 'SELECT * FROM audit_logs ORDER BY created_at DESC';
        
        return $this->conn->query($sql)->fetchAll();
    }
}