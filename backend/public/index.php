<?php

declare(strict_types=1);

define('APP_ROOT', dirname(__DIR__));

require APP_ROOT . '/vendor/autoload.php';

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;

use App\Middleware\AddJsonToResponse;

$app = AppFactory::create();

$app->add(new AddJsonToResponse);

$app->get('/testing', function (Request $request, Response $response) {
    $body = [
        "message" => "Hello World!"
    ];

    $response->getBody()->write(json_encode($body));
    return $response;
});

$app->run();
