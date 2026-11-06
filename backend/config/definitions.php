<?php

use function DI\factory;
use Psr\Container\ContainerInterface;

use App\Database;
use App\Services\TokenService;
use App\Services\RefreshCookie;

return [
    Database::class => function () {
        return new Database(
            host: $_ENV['DB_HOST'] ?? '',
            dbName: $_ENV['DB_NAME'] ?? '',
            user: $_ENV['DB_USER'] ?? '',
            password: $_ENV['DB_PASSWORD'] ?? ''
        );
    },

    TokenService::class => factory(function (ContainerInterface $c) {
        // Using the Database definition above
        $db = $c->get(Database::class);

        return new TokenService(
            secret: $_ENV['JWT_SECRET'],
            accessTtl: $_ENV['JWT_TTL'],
            conn: $db->connect(),
            refreshTtl: (int) $_ENV['REFRESH_TTL']
        );
    }),

    RefreshCookie::class => function () {
        return new RefreshCookie(
            ttl: (int) $_ENV['REFRESH_TTL'],
            secure: filter_var($_ENV['COOKIE_SECURE'] ?? 'true', FILTER_VALIDATE_BOOLEAN),
        );
    },
];