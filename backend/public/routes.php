<?php

use Slim\App as SlimApp;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Constants\Roles;


return function (SlimApp $app) {

    $app->get('/testing', function (Request $request, Response $response) {
        $body = [
            "message" => "Hello World!",
        ];

        $response->getBody()->write(json_encode($body));
        return $response;
    });

    $app->get('/api/locations', App\Controllers\Locations::class . ':list');

    $app->post('/api/users', App\Controllers\Users::class . ':create');

    $app->get('/api/users', App\Controllers\Users::class . ':list');
};