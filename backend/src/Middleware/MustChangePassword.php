<?php 

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Override;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class MustChangePassword implements MiddlewareInterface
{
    use \App\Helpers\ResponseHelper;

    #[Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $currentUser = $request->getAttribute('user') ?? [];

        if (!$currentUser) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        if ($currentUser['must_change_password']) {
            return $this->json(['error' => 'Must set new password'], 403);
        }

        return $handler->handle($request);
    }
}