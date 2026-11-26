<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Helpers\Actor;
use App\Services\CustomerService;

class Customers
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private CustomerService $service) {}

    public function list(Request $req, Response $res): Response
    {
        try {
            $customers = $this->service->list(Actor::fromRequest($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($customers);
    }

    public function retrieve(Request $req, Response $res, array $args): Response
    {
        $customerId = (int) $args['id'];

        try {
            $customer = $this->service->retrieve(Actor::fromRequest($req), $customerId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($customer);
    }

    public function search(Request $req, Response $res): Response
    {
        $q = $req->getQueryParams()['q'];

        if (!$q) {
            return $this->json(['error' => 'No search term provided'], 400);
        }

        try {
            $results = $this->service->search(Actor::fromRequest($req), $q);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($results);
    }

    public function update(Request $req, Response $res, array $args): Response
    {
        $customerId = (int) $args['id'];
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->update(Actor::fromRequest($req), $customerId, $body);
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
        $customerId = (int) $args['id'];

        try {
            $rows = $this->service->activate(Actor::fromRequest($req), $customerId);
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
        $customerId = (int) $args['id'];

        try {
            $rows = $this->service->deactivate(Actor::fromRequest($req), $customerId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }
}