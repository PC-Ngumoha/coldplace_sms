<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Services\CategoryService;
use App\Helpers\Actor;

class Categories {
    use \App\Helpers\ResponseHelper;

    public function __construct(private CategoryService $service) {}

    public function list(Request $req, Response $res): Response
    {

        $categories = $this->service->list();

        return $this->json($categories);
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
            'last_insert_id' => $id,
        ], 201);
    }

    public function update(Request $req, Response $res, array $args): Response 
    {
        $categoryId = (int) $args['id'];
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->update(Actor::fromRequest($req), $categoryId, $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }

    public function deactivate(Request $req, Response $res, array $args): Response
    {
        $categoryId = (int) $args['id'];

        try {
            $rows = $this->service->deactivate(Actor::fromRequest($req), $categoryId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response
    {
        $categoryId = (int) $args['id'];
        
        try {
            $rows = $this->service->activate(Actor::fromRequest($req), $categoryId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record Updated',
            'row_count' => $rows,
        ]);
    }
}