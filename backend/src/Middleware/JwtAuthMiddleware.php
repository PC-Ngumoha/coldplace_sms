<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuthMiddleware implements MiddlewareInterface
{   
    use \App\Helpers\ResponseHelper;

    public function __construct(private string $secret) {}

    public function process(ServerRequestInterface $request,
                            RequestHandlerInterface $handler): ResponseInterface
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
            return $this->json(['error' => 'Missing or malformed Auth header'], 401);
        }

        try {
            $decoded = JWT::decode($matches[1], new Key($this->secret, 'HS256'));
        } catch (\Firebase\JWT\ExpiredException $e) {
            return $this->json(['error' => 'Token expired.'], 401);
        } catch (\Throwable $e) {
            return $this->json(['error' => 'Invalid token'], 401);
        }

        // Making the decoded claims available to the protected routes
        $request = $request->withAttribute('jwt', (array) $decoded);

        return $handler->handle($request);
    }
}
