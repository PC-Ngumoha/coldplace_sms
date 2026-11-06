<?php

use Slim\App as SlimApp;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Routing\RouteCollectorProxy;

use App\Constants\Permissions;
use App\Middleware\JwtAuthMiddleware;
use App\Middleware\CsrfGuardMiddleware;
use App\Middleware\RequirePermission;



return function (SlimApp $app, CsrfGuardMiddleware $csrf) {

    // $app->get('/testing', function (Request $request, Response $response) {
    //     $body = [
    //         "message" => "Hello World!",
    //     ];

    //     $response->getBody()->write(json_encode($body));
    //     return $response;
    // });

    // ---- PROTECTED ROUTES ----
    $app->group('/api', function (RouteCollectorProxy $group) {

        // ------ LOCATIONS ------
        $group
            ->get('/locations', App\Controllers\Locations::class . ':list')
            ->add(new RequirePermission(Permissions::LOCATIONS_LIST));

        $group
            ->get('/locations/{id:[0-9]+}', App\Controllers\Locations::class . ':retrieve')
            ->add(new RequirePermission(Permissions::LOCATIONS_RETRIEVE));

        $group
            ->post('/locations', App\Controllers\Locations::class . ':create')
            ->add(new RequirePermission(Permissions::LOCATIONS_CREATE));

        $group
            ->post('/locations/{id:[0-9]+}/deactivate', App\Controllers\Locations::class . ':deactivate')
            ->add(new RequirePermission(Permissions::LOCATIONS_DEACTIVATE));

        $group
            ->post('/locations/{id:[0-9]+}/activate', App\Controllers\Locations::class . ':activate')
            ->add(new RequirePermission(Permissions::LOCATIONS_ACTIVATE));

        $group
            ->patch('/locations/{id:[0-9]+}', App\Controllers\Locations::class . ':update')
            ->add(new RequirePermission(Permissions::LOCATIONS_EDIT));

        // $group->delete('/locations/{id:[0-9]+}', App\Controllers\Locations::class . ':delete');


        // ------ USERS ------
        $group
            ->get('/users', App\Controllers\Users::class . ':list')
            ->add(new RequirePermission(Permissions::USERS_LIST));

        $group
            ->get('/users/{id:[0-9]+}', App\Controllers\Users::class . ':retrieve')
            ->add(new RequirePermission(Permissions::USERS_RETRIEVE));

        $group
            ->post('/users', App\Controllers\Users::class . ':create')
            ->add(new RequirePermission(Permissions::USERS_CREATE));

        $group
            ->post('/users/{id:[0-9]+}/deactivate', App\Controllers\Users::class . ':deactivate')
            ->add(new RequirePermission(Permissions::USERS_DEACTIVATE));
        
        $group
            ->post('/users/{id:[0-9]+}/activate', App\Controllers\Users::class . ':activate')
            ->add(new RequirePermission(Permissions::USERS_ACTIVATE));
        
        $group
            ->patch('/users/{id:[0-9]+}', App\Controllers\Users::class . ':update')
            ->add(new RequirePermission(Permissions::USERS_EDIT));

        $group
            ->patch('/users/{id:[0-9]+}/changePassword', App\Controllers\Users::class . ':changePassword')
            ->add(new RequirePermission(Permissions::USERS_CHANGE_PASSWORD_ANY));

        // $group->delete('/users/{id:[0-9]+}', App\Controllers\Users::class . ':delete');

        // ------ CURRENT USER ------
        $group
            ->get('/me', App\Controllers\Users::class . ':me')
            ->add(new RequirePermission(Permissions::USERS_PROFILE));

        $group
            ->patch('/me/changePassword', App\Controllers\Users::class . ':changeMyPassword')
            ->add(new RequirePermission(Permissions::USERS_CHANGE_PASSWORD_OWN));

    })->add(new JwtAuthMiddleware($_ENV['JWT_SECRET']));

    // ---- AUTHENTICATION ROUTES ----
    $app->group('/api/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/login', App\Controllers\Auth::class . ':login');
        $auth->post('/refresh', App\Controllers\Auth::class . ':refresh');
        $auth->post('/logout', App\Controllers\Auth::class . ':logout');
    })->add($csrf);
};