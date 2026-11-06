<?php

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Override;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

use App\Services\PermissionPolicy;

class RequirePermission implements MiddlewareInterface
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private string $permission)
    {}

    #[Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $decoded = $request->getAttribute('jwt');

        if (!$decoded) {
            return $this->json(['error' => 'Not authenticated'], 401);
        }

        if (!PermissionPolicy::can($decoded['role'], $this->permission)) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        return $handler->handle($request);
    }
}