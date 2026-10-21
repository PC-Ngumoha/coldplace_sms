<?php

use Slim\App;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;


return function (App $app) {

    $app->get('/testing', function (Request $request, Response $response) {
        $body = [
            "message" => "Hello World!",
            // "admin_password" => $_ENV['ADMIN_PASSWORD']
        ];

        $response->getBody()->write(json_encode($body));
        return $response;
    });
};