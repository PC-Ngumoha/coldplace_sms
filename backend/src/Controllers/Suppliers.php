<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Services\SupplierService;
use App\Helpers\Actor;

class Suppliers
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private SupplierService $service) {}

    public function list(Request $req, Response $res): Response
    {
        try {
            $suppliers = $this->service->list(Actor::fromRequest($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($suppliers);
    }

    public function retrieve(Request $req, Response $res, array $args): Response 
    {
        $supplierId = (int) $args['id'];

        try {
            $supplier = $this->service->retrieve(Actor::fromRequest($req), $supplierId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($supplier);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        try {
            $id = $this->service->create(Actor::fromRequest($req), $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record created',
            'last_insert_id' => $id
        ], 201);
    }

    public function update(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody() ?? [];
        $supplierId = (int) $args['id'];

        try {
            $rows = $this->service->update(Actor::fromRequest($req), $supplierId, $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }

    public function deactivate(Request $req, Response $res, array $args): Response
    {
        $supplierId = (int) $args['id'];

        try {
            $rows = $this->service->deactivate(Actor::fromRequest($req), $supplierId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response
    {
        $supplierId = (int) $args['id'];

        try {
            $rows = $this->service->activate(Actor::fromRequest($req), $supplierId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }
}