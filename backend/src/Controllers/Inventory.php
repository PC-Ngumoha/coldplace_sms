<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Helpers\Actor;
use App\Services\InventoryService;

class Inventory
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private InventoryService $service) {}

    public function balances(Request $req, Response $res): Response
    {
        try {
            $balances = $this->service->balances(Actor::fromRequest($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($balances);
    }

    public function ledger(Request $req, Response $res): Response
    {
        $query = $req->getQueryParams();

        try {
            $ledger = $this->service->ledger(
                Actor::fromRequest($req),
                (int) ($query['product_id'] ?? 0),
                (int) ($query['location_id'] ?? 0)
            );
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($ledger);
    }
}