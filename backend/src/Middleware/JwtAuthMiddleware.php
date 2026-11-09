<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use App\Repositories\UserRepository;
use App\Constants\User;

class JwtAuthMiddleware implements MiddlewareInterface
{   
    use \App\Helpers\ResponseHelper;

    public function __construct(private string $secret, private UserRepository $repo) {}

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
        $claims = (array) $decoded;
        $request = $request->withAttribute('jwt', $claims);

        // Fetching the current user from the database
        $user = $this->repo->retrieveUser((int)($claims['sub'] ?? 0));

        // The token is valid but the user no longer exists
        if (!$user) {
            return $this->json(['error' => 'Invalid token'], 401);
        }

        // Refuse access attempts from deactivated users
        if ($user['status'] === User::INACTIVE) {
            return $this->json(['error' => 'Your account has been deactivated'], 401);
        }

        unset($user['password_hash']);

        $request = $request->withAttribute('user', $user);

        return $handler->handle($request);
    }
}
