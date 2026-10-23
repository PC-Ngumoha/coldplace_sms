<?php

use Slim\App as SlimApp;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Routing\RouteCollectorProxy;

use App\Middleware\JwtAuthMiddleware;


return function (SlimApp $app) {

    $app->get('/testing', function (Request $request, Response $response) {
        $body = [
            "message" => "Hello World!",
        ];

        $response->getBody()->write(json_encode($body));
        return $response;
    });

    $app->group('/api', function (RouteCollectorProxy $group) {
        $group->get('/locations', App\Controllers\Locations::class . ':list');

        $group->post('/users', App\Controllers\Users::class . ':create');

        $group->get('/users', App\Controllers\Users::class . ':list');
    })->add(new JwtAuthMiddleware($_ENV['JWT_SECRET']));

    $app->post('/api/auth/login', App\Controllers\Auth::class . ':login');
};