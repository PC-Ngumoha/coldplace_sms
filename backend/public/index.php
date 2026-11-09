<?php

declare(strict_types=1);

define('APP_ROOT', dirname(__DIR__));

require APP_ROOT . '/vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\ContainerBuilder;

use App\Middleware\AddJsonToResponse;
use App\Middleware\CorsMiddleware;
use App\Middleware\CsrfGuardMiddleware;
use App\Middleware\JwtAuthMiddleware;

use App\Repositories\UserRepository;

$dotenv = Dotenv\Dotenv::createImmutable(APP_ROOT);
$dotenv->load();

$allowedOrigins = array_filter(array_map('trim', explode(',', $_ENV['ALLOWED_ORIGINS'] ?? '')));

$builder = new ContainerBuilder();
$container = $builder->addDefinitions(
    APP_ROOT . '/config/definitions.php'
)->build();

AppFactory::setContainer($container);

$app = AppFactory::create();

$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);

$app->add(new AddJsonToResponse);
$app->add(new CorsMiddleware($allowedOrigins));

$csrf = new CsrfGuardMiddleware($allowedOrigins);
$jwtAuth = new JwtAuthMiddleware($_ENV['JWT_SECRET'], $container->get(UserRepository::class));

(require APP_ROOT . '/public/routes.php')($app, $jwtAuth, $csrf);

$app->run();
