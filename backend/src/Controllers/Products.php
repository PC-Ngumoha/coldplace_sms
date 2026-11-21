<?php

namespace App\Controllers;

use App\Exceptions\AppException;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Services\ProductService;
use App\Helpers\Actor;

class Products
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private ProductService $service)
    {}

    // ----- Reads -----
    public function list(Request $req, Response $res): Response
    {
        $products = $this->service->list();

        return $this->json($products);
    }

    public function retrieve(Request $req, Response $res, array $args): Response
    {
        $productId = (int) $args['id'];

        try {
            $product = $this->service->retrieve($productId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($product);
    }

    // ------ Create ------
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

    // ------ Update ------
    public function update(Request $req, Response $res, array $args): Response
    {
        $productId = (int) $args['id'];
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->update(Actor::fromRequest($req), $productId, $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }

    // ------ Change status -------
    public function deactivate(Request $req, Response $res, array $args): Response
    {
        $productId = (int) $args['id'];

        try {
            $rows = $this->service->deactivate(Actor::fromRequest($req), $productId);
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
        $productId = (int) $args['id'];

        try {
            $rows = $this->service->activate(Actor::fromRequest($req), $productId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }
}