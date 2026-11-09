<?php

namespace App;

use PDO;

class Database
{
    private ?PDO $pdo = null;

    public function __construct(private string $host, private string $dbName,
                                private string $user, private string $password) {}

    public function connect(): PDO
    {
        if ($this->pdo === null) {
            $dsn = "mysql:host={$this->host};dbname={$this->dbName};charset=utf8mb4";
            $this->pdo = new PDO($dsn, $this->user, $this->password, [
                PDO::ATTR_ERRMODE               => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE    => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES      => false,
                PDO::MYSQL_ATTR_INIT_COMMAND    => "SET time_zone = '+01:00', NAMES utf8mb4",
            ]);
        }
        return $this->pdo;
    }
}