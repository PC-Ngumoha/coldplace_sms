<?php

use Slim\App as SlimApp;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Constants\Permissions;
use App\Middleware\JwtAuthMiddleware;
use App\Middleware\CsrfGuardMiddleware;
use App\Middleware\RequirePermission;
use App\Middleware\MustChangePassword;



return function (SlimApp $app, JwtAuthMiddleware $jwtAuth, CsrfGuardMiddleware $csrf) {
    $app->get('/testing', function (Request $req, Response $res) {
        $res->getBody()->write(json_encode(['message' => 'Health check: Pass']));
        return $res;
    });

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
            ->patch('/users/{id:[0-9]+}/changePassword', App\Controllers\Users::class . ':resetPassword')
            ->add(new RequirePermission(Permissions::USERS_CHANGE_PASSWORD_ANY))
            ->add(new MustChangePassword);

        // ------ CURRENT USER ------
        $group
            ->get('/me', App\Controllers\Users::class . ':me')
            ->add(new RequirePermission(Permissions::USERS_PROFILE));

        $group
            ->patch('/me/changePassword', App\Controllers\Users::class . ':changePassword')
            ->add(new RequirePermission(Permissions::USERS_CHANGE_PASSWORD_OWN));


        // ------ AUDIT LOGS ------
        $group
            ->get('/audit/logs', App\Controllers\Logs::class . ':list')
            ->add(new RequirePermission(Permissions::AUDIT_VIEW));


        // ------ PRODUCT CATEGORIES ------
        $group
            ->get('/categories', App\Controllers\Categories::class . ':list')
            ->add(new RequirePermission(Permissions::CATEGORIES_LIST));

        $group
            ->post('/categories', App\Controllers\Categories::class . ':create')
            ->add(new RequirePermission(Permissions::CATEGORIES_CREATE))
            ->add(new MustChangePassword);

        $group
            ->post('/categories/{id:[0-9]+}/deactivate', App\Controllers\Categories::class . ':deactivate')
            ->add(new RequirePermission(Permissions::CATEGORIES_DEACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->post('/categories/{id:[0-9]+}/activate', App\Controllers\Categories::class . ':activate')
            ->add(new RequirePermission(Permissions::CATEGORIES_ACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->patch('/categories/{id:[0-9]+}', App\Controllers\Categories::class . ':update')
            ->add(new RequirePermission(Permissions::CATEGORIES_EDIT))
            ->add(new MustChangePassword);

        // ------ UNITS ------
        $group
            ->get('/units', App\Controllers\Units::class . ':list')
            ->add(new RequirePermission(Permissions::UNITS_LIST));


        // ------ PRODUCTS ------
        $group
            ->get('/products', App\Controllers\Products::class . ':list')
            ->add(new RequirePermission(Permissions::PRODUCTS_LIST));

        $group
            ->get('/products/{id:[0-9]+}', App\Controllers\Products::class . ':retrieve')
            ->add(new RequirePermission(Permissions::PRODUCTS_RETRIEVE))
            ->add(new MustChangePassword);

        $group
            ->post('/products', App\Controllers\Products::class . ':create')
            ->add(new RequirePermission(Permissions::PRODUCTS_CREATE))
            ->add(new MustChangePassword);

        $group
            ->post('/products/{id:[0-9]+}/deactivate', App\Controllers\Products::class . ':deactivate')
            ->add(new RequirePermission(Permissions::PRODUCTS_DEACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->post('/products/{id:[0-9]+}/activate', App\Controllers\Products::class . ':activate')
            ->add(new RequirePermission(Permissions::PRODUCTS_ACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->patch('/products/{id:[0-9]+}', App\Controllers\Products::class . ':update')
            ->add(new RequirePermission(Permissions::PRODUCTS_EDIT))
            ->add(new MustChangePassword);

        // ------ SUPPLIERS ------
        $group
            ->get('/suppliers', App\Controllers\Suppliers::class . ':list')
            ->add(new RequirePermission(Permissions::SUPPLIERS_LIST));

        $group
            ->get('/suppliers/{id:[0-9]+}', App\Controllers\Suppliers::class . ':retrieve')
            ->add(new RequirePermission(Permissions::SUPPLIERS_RETRIEVE))
            ->add(new MustChangePassword);

        $group
            ->post('/suppliers', App\Controllers\Suppliers::class . ':create')
            ->add(new RequirePermission(Permissions::SUPPLIERS_CREATE))
            ->add(new MustChangePassword);

        $group
            ->post('/suppliers/{id:[0-9]+}/deactivate', App\Controllers\Suppliers::class . ':deactivate')
            ->add(new RequirePermission(Permissions::SUPPLIERS_DEACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->post('/suppliers/{id:[0-9]+}/activate', App\Controllers\Suppliers::class . ':activate')
            ->add(new RequirePermission(Permissions::SUPPLIERS_ACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->patch('/suppliers/{id:[0-9]+}', App\Controllers\Suppliers::class . ':update')
            ->add(new RequirePermission(Permissions::SUPPLIERS_EDIT))
            ->add(new MustChangePassword);


        // ------ RECEIPTS (RECEIVING) ------
        $group
            ->get('/received', App\Controllers\Receipts::class . ':list')
            ->add(new RequirePermission(Permissions::RECEIPTS_LIST));

        $group
            ->get('/received/{id:[0-9]+}', App\Controllers\Receipts::class . ':retrieve')
            ->add(new RequirePermission(Permissions::RECEIPTS_RETRIEVE))
            ->add(new MustChangePassword);

        $group
            ->post('/received', App\Controllers\Receipts::class . ':create')
            ->add(new RequirePermission(Permissions::RECEIPTS_CREATE))
            ->add(new MustChangePassword);

        // ------ INVENTORY ------
        $group
            ->get('/inventory', App\Controllers\Inventory::class . ':balances')
            ->add(new RequirePermission(Permissions::INVENTORY_VIEW))
            ->add(new MustChangePassword);

        $group
            ->get('/inventory/ledger', App\Controllers\Inventory::class . ':ledger')
            ->add(new RequirePermission(Permissions::INVENTORY_VIEW))
            ->add(new MustChangePassword);

        
        // ------ PRICES ------
        $group
            ->get('/prices', App\Controllers\Prices::class . ':current')
            ->add(new RequirePermission(Permissions::PRICES_LIST))
            ->add(new MustChangePassword);

        $group
            ->get('/prices/history', App\Controllers\Prices::class . ':history')
            ->add(new RequirePermission(Permissions::PRICES_HISTORY))
            ->add(new MustChangePassword);

        $group
            ->post('/prices', App\Controllers\Prices::class . ':set')
            ->add(new RequirePermission(Permissions::PRICES_SET))
            ->add(new MustChangePassword);


        // ------ CUSTOMERS ------
        $group
            ->get('/customers', App\Controllers\Customers::class . ':list')
            ->add(new RequirePermission(Permissions::CUSTOMERS_LIST))
            ->add(new MustChangePassword);

        $group
            ->get('/customers/{id:[0-9]+}', App\Controllers\Customers::class . ':retrieve')
            ->add(new RequirePermission(Permissions::CUSTOMERS_RETRIEVE))
            ->add(new MustChangePassword);

        $group
            ->get('/customers/search', App\Controllers\Customers::class . ':search')
            ->add(new RequirePermission(Permissions::CUSTOMERS_SEARCH))
            ->add(new MustChangePassword);

        $group
            ->patch('/customers/{id:[0-9]+}', App\Controllers\Customers::class . ':update')
            ->add(new RequirePermission(Permissions::CUSTOMERS_EDIT))
            ->add(new MustChangePassword);

        $group
            ->post('/customers/{id:[0-9]+}/activate', App\Controllers\Customers::class . ':activate')
            ->add(new RequirePermission(Permissions::CUSTOMERS_ACTIVATE))
            ->add(new MustChangePassword);

        $group
            ->post('/customers/{id:[0-9]+}/deactivate', App\Controllers\Customers::class . ':deactivate')
            ->add(new RequirePermission(Permissions::CUSTOMERS_DEACTIVATE))
            ->add(new MustChangePassword);

        // ------ SALES ------
        $group
            ->get('/sales', App\Controllers\Sales::class . ':list')
            ->add(new RequirePermission(Permissions::SALES_LIST))
            ->add(new MustChangePassword);

        $group
            ->get('/sales/{id:[0-9]+}', App\Controllers\Sales::class . ':retrieve')
            ->add(new RequirePermission(Permissions::SALES_RETRIEVE))
            ->add(new MustChangePassword);
        
        $group
            ->post('/sales', App\Controllers\Sales::class . ':create')
            ->add(new RequirePermission(Permissions::SALES_CREATE))
            ->add(new MustChangePassword);

        // ------ CLOSING & REOPENING BUSINESS DAYS ------
        $group
            ->get('/days/status', App\Controllers\Days::class . ':status')
            ->add(new RequirePermission(Permissions::DAYS_STATUS))
            ->add(new MustChangePassword);

        $group
            ->get('/days', App\Controllers\Days::class . ':list')
            ->add(new RequirePermission(Permissions::DAYS_STATUS))
            ->add(new MustChangePassword);

        $group
            ->post('/days/close', App\Controllers\Days::class . ':close')
            ->add(new RequirePermission(Permissions::DAYS_CLOSE))
            ->add(new MustChangePassword);

        $group
            ->post('/days/reopen', App\Controllers\Days::class . ':reopen')
            ->add(new RequirePermission(Permissions::DAYS_REOPEN))
            ->add(new MustChangePassword);

    })->add($jwtAuth);

    // ---- AUTHENTICATION ROUTES ----
    $app->group('/api/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/login', App\Controllers\Auth::class . ':login');
        $auth->post('/refresh', App\Controllers\Auth::class . ':refresh');
        $auth->post('/logout', App\Controllers\Auth::class . ':logout');
    })->add($csrf);
};