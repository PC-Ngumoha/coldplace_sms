<?php

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Override;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

class CorsMiddleware implements MiddlewareInterface
{
    public function __construct(private array $allowedOrigins) {}

    #[Override]
    public function process(ServerRequestInterface $request,
                            RequestHandlerInterface $handler): ResponseInterface
    {
        // throw new \Exception('Not implemented');
        $origin = $request->getHeaderLine('Origin');
        $allowedHeaders = [
            'Content-Type',
            'Authorization',
            'X-Requested-With'
        ];
        $allowedMethods = [
            'GET',
            'POST',
            'PATCH',
            'DELETE',
            'OPTIONS'
        ];

        $response = $request->getMethod() === 'OPTIONS'
                    ? (new Response())->withStatus(204)
                    : $handler->handle($request);

        if (in_array($origin, $this->allowedOrigins, true)) {
            $response = $response
                        ->withHeader('Access-Control-Allow-Origin', $origin)
                        ->withHeader('Access-Control-Allow-Credentials', 'true')
                        ->withHeader('Access-Control-Allow-Headers', implode(', ', $allowedHeaders))
                        ->withHeader('Access-Control-Allow-Methods', implode(', ', $allowedMethods));
        }

        return $response;
    }
}