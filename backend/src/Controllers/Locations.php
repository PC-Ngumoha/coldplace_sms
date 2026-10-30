<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\LocationRepository;

class Locations {
    use \App\Helpers\ResponseHelper;

    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';

    public function __construct(private LocationRepository $repo) {}

    public function list(Request $req, Response $res): Response
    {
        $locations = $this->repo->showAllLocations();
        
        return $this->json($locations);
    }

    public function deactivate(Request $req, Response $res, array $args): Response {
        $locationId = (int) $args['id'];
        $rows = 0;

        $location = $this->repo->retrieveLocation($locationId);

        if (!$location) {
            return $this->json(['error' => 'Not found'], 404);
        }

        if ($location['status'] === self::ACTIVE) {
            $rows = $this->repo->setStatus($locationId, self::INACTIVE);
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response {
        $locationId = (int) $args['id'];
        $rows = 0;

        $location = $this->repo->retrieveLocation($locationId);

        if (!$location) {
            return $this->json(['error' => 'Not found'], 404);
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