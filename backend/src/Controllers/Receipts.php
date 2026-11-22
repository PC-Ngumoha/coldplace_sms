<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Services\ReceiptService;
use App\Helpers\Actor;

class Receipts
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private ReceiptService $service)
    {}

    public function list(Request $req, Response $res): Response 
    {
        try {
            $receiptRecords = $this->service->list(Actor::fromRequest($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($receiptRecords);
    }

    public function retrieve(Request $req, Response $res, array $args): Response
    {
        $receiptId = (int) $args['id'];

        try {
            $receiptRecord = $this->service->retrieve(Actor::fromRequest($req), $receiptId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($receiptRecord);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        try {
            $results = $this->service->create(Actor::fromRequest($req), $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record created',
            'last_insert_id' => $results['id'],
            'reference' => $results['reference']
        ], 201);
    }
}