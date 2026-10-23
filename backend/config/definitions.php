<?php

use App\Database;

return [
    Database::class => function () {
        return new Database(
            host: $_ENV['DB_HOST'] ?? '',
            dbName: $_ENV['DB_NAME'] ?? '',
            user: $_ENV['DB_USER'] ?? '',
            password: $_ENV['DB_PASSWORD'] ?? ''
        );
    }
];