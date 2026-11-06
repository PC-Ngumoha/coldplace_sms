<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\LocationRepository;
use App\Constants\Roles;

class Locations {
    use \App\Helpers\ResponseHelper;

    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';

    public function __construct(private LocationRepository $repo) {}

    /**
     * Outlet: Only see their own location
     * All other roles: See all locations available on the system.
     */
    public function list(Request $req, Response $res): Response
    {
        $decoded = $req->getAttribute('jwt');

        if ($decoded['role'] !== Roles::OUTLET) {
            $locations = $this->repo->showAllLocations();
        } else {
            $userId = (int) $decoded['sub'];
            $locations = $this->repo->showAllLocations($userId);
        }

        return $this->json($locations);
    }

    public function retrieve(Request $req, Response $res, array $args): Response
    {
        $locationId = (int) $args['id'];
        $decoded = $req->getAttribute('jwt');

        // For outlet users: Ensure that the location is theirs.
        if ($decoded['role'] === Roles::OUTLET) {
            $userId = (int) $decoded['sub'];
            $ownLocation = $this->repo->showAllLocations($userId)[0];   // Always returns one location
            if ($ownLocation['id'] !== $locationId) {
                return $this->json(['error' => 'Forbidden'], 403);
            }
        }

        $location = $this->repo->retrieveLocation($locationId);

        if (!$location) {
            return $this->json(['error' => 'Not Found'], 404);
        }

        return $this->json($location);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        if (empty($body) || !$body['name']) {
            return $this->json(['error' => 'Missing parameters'], 400);
        }

        $rows = $this->repo->createLocation($body);

        return $this->json([
            'message' => 'Record created',
            'row_count' => $rows,
        ], 201);
    }

    public function update(Request $req, Response $res, array $args): Response 
    {
        $locationId = (int) $args['id'];
        $body = $req->getParsedBody() ?? [];

        if (empty($body) || !$body['name']) {
            return $this->json(['error' => 'Missing parameters'], 400);
        }

        $rows = $this->repo->updateLocation($locationId, $body);

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }

    public function deactivate(Request $req, Response $res, array $args): Response
    {
        $locationId = (int) $args['id'];
        $rows = 0;

        $location = $this->repo->retrieveLocation($locationId);

        if (!$location) {
            return $this->json(['error' => 'Not found'], 404);
        }

        if ($location['is_central']) {
            return $this->json(['error' => 'This operation is forbidden'], 403);
        }

        if ($location['status'] === self::ACTIVE) {
            $rows = $this->repo->setStatus($locationId, self::INACTIVE);
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response
    {
        $locationId = (int) $args['id'];
        $rows = 0;

        $location = $this->repo->retrieveLocation($locationId);

        if (!$location) {
            return $this->json(['error' => 'Not found'], 404);
        }

        if ($location['is_central']) {
            return $this->json(['error' => 'This operation is forbidden'], 403);
        }

        if ($location['status'] === self::INACTIVE) {
            $rows = $this->repo->setStatus($locationId, self::ACTIVE);
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }
}