<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Helpers\Actor;
use App\Services\PriceService;

class Prices
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private PriceService $service) {}

    public function current(Request $req, Response $res): Response
    {
        try {
            $currentPrices = $this->service->current(Actor::fromRequest($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($currentPrices);
    }

    public function history(Request $req, Response $res): Response
    {
        $query = $req->getQueryParams();

        try {
            $historicalPrices = $this->service->history(
                Actor::fromRequest($req),
                (int) $query['product_id'],
                $query['unit_id']
            );
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($historicalPrices);
    }

    public function set(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        try {
            $result = $this->service->set(Actor::fromRequest($req), $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'id' => (int) $result['id'],
            'status' => $result['status'],
        ], 201);
    }
}