<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\LocationRepository;

class Locations {
    use \App\Helpers\ResponseHelper;

    private const ACTIVE = 'active';
    private const INACTIVE = 'inactive';

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
            $data = $this->filterOutput(source: $location, excluded: ['is_central']);
            $data['status'] = self::INACTIVE;
            $rows = $this->repo->updateLocation($locationId, $data);
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
            $data = $this->filterOutput(source: $location, excluded: ['is_central']);
            $data['status'] = self::ACTIVE;
            $rows = $this->repo->updateLocation($locationId, $data);
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }
}