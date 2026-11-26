<?php

namespace App\Controllers;

use App\Exceptions\AppException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use App\Services\DayService;
use App\Helpers\Actor;

class Days
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private DayService $service) {}

    /** GET /days/status?location_id=&date= */
    public function status(Request $req, Response $res): Response
    {
        $q = $req->getQueryParams() ?? [];

        try {
            $result = $this->service->status(Actor::fromRequest($req), $q);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($result);
    }

    /** GET /days?from=&to=&location_id= */
    public function list(Request $req, Response $res): Response
    {
        $q = $req->getQueryParams() ?? [];

        try {
            $result = $this->service->list(Actor::fromRequest($req), $q);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($result);
    }

    /** POST /days/close  body: { location_id?, date } */
    public function close(Request $req, Response $res): Response
    {
        try {
            $result = $this->service->close(Actor::fromRequest($req), $this->body($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($result);
    }

    /** POST /days/reopen  body: { location_id, date, reason } */
    public function reopen(Request $req, Response $res): Response
    {
        try {
            $result = $this->service->reopen(Actor::fromRequest($req), $this->body($req));
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json($result);
    }

    /** A missing or malformed JSON body becomes an empty array, so the service reports what's missing. */
    private function body(Request $req): array
    {
        $body = $req->getParsedBody();
        return is_array($body) ? $body : [];
    }
}