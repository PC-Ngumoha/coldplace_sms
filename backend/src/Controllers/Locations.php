<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\LocationRepository;

class Locations {
    use \App\Helpers\ResponseHelper;

    public function __construct(private LocationRepository $repo) {}

    public function list(Request $req, Response $res): Response
    {
        $locations = $this->repo->showAllLocations();
        
        return $this->json($locations);
    }
}