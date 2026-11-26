<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Exceptions\AmbiguousCustomer;
use App\Helpers\Actor;
use App\Services\SaleService;


class Sales
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private SaleService $service) {}

    public function list(Request $req, Response $res): Response
    {
        $q = $req->getQueryParams() ?? [];

        try {
            $sales = $this->service->list(Actor::fromRequest($req), $q);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($sales);
    }

    public function retrieve(Request $req, Response $res, array $args): Response
    {
        $saleId = (int) $args['id'];

        try {
            $sale = $this->service->retrieve(Actor::fromRequest($req), $saleId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($sale);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        try {
            $result = $this->service->create(Actor::fromRequest($req), $body);
        } catch (AmbiguousCustomer $err) {
            return $this->json(['error' => $err->getMessage(), 'candidates' => $err->candidates], $err->getStatus());
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($result, 201);
    }
}
