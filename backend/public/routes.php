<?php

use Slim\App as SlimApp;
use Slim\Routing\RouteCollectorProxy;

use App\Constants\Permissions;
use App\Middleware\JwtAuthMiddleware;
use App\Middleware\CsrfGuardMiddleware;
use App\Middleware\RequirePermission;
use App\Middleware\MustChangePassword;



return function (SlimApp $app, JwtAuthMiddleware $jwtAuth, CsrfGuardMiddleware $csrf) {
    // ---- PROTECTED ROUTES ----
    $app->group('/api', function (RouteCollectorProxy $group) {

        // ------ LOCATIONS ------
        $group
            ->get('/locations', App\Controllers\Locations::class . ':list')
            ->add(new RequirePermission(Permissions::LOCATIONS_LIST));

        $group
            ->get('/locations/{id:[0-9]+}', App\Controllers\Locations::class . ':retrieve')
            ->add(new RequirePermission(Permissions::LOCATIONS_RETRIEVE))
            ->add(new MustChangePassword);

        $group
            ->post('/locations', App\Controllers\Locations::class . ':create')
            ->add(new RequirePermission(Permissions::LOCATIONS_CREATE))
            ->add(new MustChangePassword);

        $group
            ->post('/locations/{id:[0-9]+}/deactivate', App\Controllers\Locations::class . ':deactivate')
            ->add(new RequirePermission(Permissions::LOCATIONS_DEACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->post('/locations/{id:[0-9]+}/activate', App\Controllers\Locations::class . ':activate')
            ->add(new RequirePermission(Permissions::LOCATIONS_ACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->patch('/locations/{id:[0-9]+}', App\Controllers\Locations::class . ':update')
            ->add(new RequirePermission(Permissions::LOCATIONS_EDIT))
            ->add(new MustChangePassword);


        // ------ USERS ------
        $group
            ->get('/users', App\Controllers\Users::class . ':list')
            ->add(new RequirePermission(Permissions::USERS_LIST))
            ->add(new MustChangePassword);

        $group
            ->get('/users/{id:[0-9]+}', App\Controllers\Users::class . ':retrieve')
            ->add(new RequirePermission(Permissions::USERS_RETRIEVE))
            ->add(new MustChangePassword);

        $group
            ->post('/users', App\Controllers\Users::class . ':create')
            ->add(new RequirePermission(Permissions::USERS_CREATE))
            ->add(new MustChangePassword);

        $group
            ->post('/users/{id:[0-9]+}/deactivate', App\Controllers\Users::class . ':deactivate')
            ->add(new RequirePermission(Permissions::USERS_DEACTIVATE))
            ->add(new MustChangePassword);
        
        $group
            ->post('/users/{id:[0-9]+}/activate', App\Controllers\Users::class . ':activate')
            ->add(new RequirePermission(Permissions::USERS_ACTIVATE))
            ->add(new MustChangePassword);
        
        $group
            ->patch('/users/{id:[0-9]+}', App\Controllers\Users::class . ':update')
            ->add(new RequirePermission(Permissions::USERS_EDIT))
            ->add(new MustChangePassword);

        $group
            ->patch('/users/{id:[0-9]+}/changePassword', App\Controllers\Users::class . ':changePassword')
            ->add(new RequirePermission(Permissions::USERS_CHANGE_PASSWORD_ANY))
            ->add(new MustChangePassword);

        // ------ CURRENT USER ------
        $group
            ->get('/me', App\Controllers\Users::class . ':me')
            ->add(new RequirePermission(Permissions::USERS_PROFILE));

        $group
            ->patch('/me/changePassword', App\Controllers\Users::class . ':changeMyPassword')
            ->add(new RequirePermission(Permissions::USERS_CHANGE_PASSWORD_OWN));


        // ------ AUDIT LOGS ------
        $group
            ->get('/audit/logs', App\Controllers\Logs::class . ':list')
            ->add(new RequirePermission(Permissions::AUDIT_VIEW));

    })->add($jwtAuth);

    // ---- AUTHENTICATION ROUTES ----
    $app->group('/api/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/login', App\Controllers\Auth::class . ':login');
        $auth->post('/refresh', App\Controllers\Auth::class . ':refresh');
        $auth->post('/logout', App\Controllers\Auth::class . ':logout');
    })->add($csrf);
};