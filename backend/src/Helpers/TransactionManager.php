<?php
namespace App\Helpers;

use App\Database;
use PDO;

class TransactionManager
{
    private PDO $conn;

    public function __construct(private Database $db)
    {
        $this->conn = $db->connect();
    }

    public function run(callable $work): mixed
    {
        // check if a transaction is already ongoing
        if ($this->conn->inTransaction()) {
            return $work();
        }

        $this->conn->beginTransaction();
        try {
            $result = $work();
            $this->conn->commit();
            return $result;
        } catch (\Throwable $err) {
            $this->conn->rollBack();
            throw $err;
        }
    }
}