<?php

declare(strict_types=1);

define('APP_ROOT', dirname(__DIR__));

require APP_ROOT . '/vendor/autoload.php';

use Slim\Factory\AppFactory;

use App\Middleware\AddJsonToResponse;
use App\Middleware\CorsMiddleware;

$dotenv = Dotenv\Dotenv::createImmutable(APP_ROOT);
$dotenv->load();

$allowedOrigins = array_filter(array_map('trim', explode(',', $_ENV['ALLOWED_ORIGINS'] ?? '')));

$pdo = (new App\Database(
    host: $_ENV['DB_HOST'] ?? '',
    dbName: $_ENV['DB_NAME'] ?? '',
    user: $_ENV['DB_USER'] ?? '',
    password: $_ENV['DB_PASSWORD'] ?? '',
))->connect();

$app = AppFactory::create();

$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);

$app->add(new AddJsonToResponse);
$app->add(new CorsMiddleware($allowedOrigins));

(require APP_ROOT . '/public/routes.php')($app, $pdo);

$app->run();
