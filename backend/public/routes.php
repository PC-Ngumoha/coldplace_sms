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

    // ---- PROTECTED ROUTES ----
    $app->group('/api', function (RouteCollectorProxy $group) {
        $group->get('/locations', App\Controllers\Locations::class . ':list');

        $group->post('/users', App\Controllers\Users::class . ':create');

        $group->get('/users', App\Controllers\Users::class . ':list');

        $group->get('/me', App\Controllers\Users::class . ':me');

        $group->patch('/users/{id:[0-9]+}/changePassword', App\Controllers\Users::class . ':changePassword');
    })->add(new JwtAuthMiddleware($_ENV['JWT_SECRET']));

    // ---- AUTHENTICATED ROUTES ----
    $app->group('/api/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/login', App\Controllers\Auth::class . ':login');
        $auth->post('/refresh', App\Controllers\Auth::class . ':refresh');
        $auth->post('/logout', App\Controllers\Auth::class . ':logout');
    });
};