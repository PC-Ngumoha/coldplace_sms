<?php

use Slim\App;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;


return function (App $app, PDO $pdo) {

    $app->get('/testing', function (Request $request, Response $response) use ($pdo) {
        $locations = $pdo->query('SELECT * FROM locations;')->fetchAll();
        $body = [
            "message" => "Hello World!",
            // "admin_password" => $_ENV['ADMIN_PASSWORD']
            "locations" => $locations,
        ];

        $response->getBody()->write(json_encode($body));
        return $response;
    });
};