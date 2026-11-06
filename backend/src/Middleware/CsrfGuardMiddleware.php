<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Middleware aimed at protecting auth routes from CSRF attacks
 * due to their reliance on HttpOnly cookies.
 */
class CsrfGuardMiddleware implements MiddlewareInterface
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private array $allowedOrigins) {}

    public function process(ServerRequestInterface $req,
                            RequestHandlerInterface $handler): ResponseInterface
    {
        $origin = $req->getHeaderLine('Origin');

        if ($origin !== '' && !in_array($origin, $this->allowedOrigins, true)) {
            return $this->json(['error' => 'Origin not allowed'], 403);
        }

        if ($req->getHeaderLine('X-Requested-With') !== 'axios') {
            return $this->json(['error' => 'Missing required header'], 403);
        }

        return $handler->handle($req);
    }
}