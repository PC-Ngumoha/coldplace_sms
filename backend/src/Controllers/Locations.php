<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Services\LocationService;

class Locations {
    use \App\Helpers\ResponseHelper;

    public function __construct(private LocationService $service) {}

    /**
     * Outlet: Only see their own location
     * All other roles: See all locations available on the system.
     */
    public function list(Request $req, Response $res): Response
    {
        $currentUser = $req->getAttribute('user');

        $locations = $this->service->list($currentUser);

        return $this->json($locations);
    }

    public function retrieve(Request $req, Response $res, array $args): Response
    {
        $locationId = (int) $args['id'];
        $currentUser = $req->getAttribute('user');

        try {
            $location = $this->service->retrieve($currentUser, $locationId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($location);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->create($body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record created',
            'row_count' => $rows,
        ], 201);
    }

    public function update(Request $req, Response $res, array $args): Response 
    {
        $locationId = (int) $args['id'];
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->update($locationId, $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }

    public function deactivate(Request $req, Response $res, array $args): Response
    {
        $locationId = (int) $args['id'];

        try {
            $rows = $this->service->deactivate($locationId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response
    {
        $locationId = (int) $args['id'];
        
        try {
            $rows = $this->service->activate($locationId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }
}