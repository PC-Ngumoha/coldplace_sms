<?php

use App\Database;
use App\Services\TokenService;

return [
    Database::class => function () {
        return new Database(
            host: $_ENV['DB_HOST'] ?? '',
            dbName: $_ENV['DB_NAME'] ?? '',
            user: $_ENV['DB_USER'] ?? '',
            password: $_ENV['DB_PASSWORD'] ?? ''
        );
    },

    TokenService::class => function () {
        return new TokenService(
            secret: $_ENV['JWT_SECRET'],
            accessTtl: $_ENV['JWT_TTL'],
        );
    }
];