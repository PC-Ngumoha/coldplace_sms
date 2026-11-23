<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Services\UnitService;

class Units
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private UnitService $service) {}

    public function list(Request $req, Response $res): Response
    {
        try {
            $units = $this->service->list();
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($units);
    }
}