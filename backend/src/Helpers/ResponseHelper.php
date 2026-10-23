<?php

namespace App\Helpers;

use Slim\Psr7\Response;

trait ResponseHelper
{
    private function json(array $body, int $status = 200): Response
    {
        $res = new Response();

        $res->getBody()->write(json_encode($body));
        return $res->withStatus($status);
    }
}