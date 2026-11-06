<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\AuthRepository;
use App\Services\TokenService;
use App\Services\RefreshCookie;

class Auth
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private AuthRepository $repo,
                                private TokenService $tokens,
                                private RefreshCookie $cookie) {}

    public function login(Request $req, Response $res): Response
    {
        $data = $req->getParsedBody() ?? [];
        $email = (string) $data['email'] ?? '';
        $password = (string) $data['password'] ?? '';

        $user = $this->repo->retrieveUserByEmail($email);

        if (!$user || !password_verify(trim($password), $user['password_hash'])) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        if ($user['status'] === \App\Controllers\Users::INACTIVE) {
            return $this->json([
                'error' => 'Your account has been deactivated.'
                ], 401);
        }


        $refresh = $this->tokens->createRefreshToken($user['id']);


        $res = $this->json([
            'access_token' => $this->tokens->createAccessToken($user),
            'token_type' => 'Bearer',
            'expires_in' => (int) $_ENV['JWT_TTL'],
        ]);

        return $this->cookie->set($res, $refresh);
    }

    public function refresh(Request $req, Response $res): Response
    {
        $raw = $this->cookie->read($req);

        $result = $raw !== null ? $this->tokens->rotate($raw) : null;

        if ($result === null) {
            return $this->cookie->clear(
                $this->json(['error' => 'Invalid refresh token'], 401)
            );
        }

        $user = $this->repo->retrieveUserById((int) $result['user_id']);
        if (!$user) {
            return $this->cookie->clear(
                $this->json(['error' => 'Invalid refresh token'], 401)
            );
        }

        if ($user['status'] === \App\Controllers\Users::INACTIVE) {
            // Revoke all tokens linked to this user.
            $this->tokens->revokeAllByToken($result['refresh_token']);
            return $this->cookie->clear(
                $this->json(['error' => 'Your account has been deactivated'], 401)
            );
        }

        
        $res = $this->json([
            'access_token' => $this->tokens->createAccessToken($user),
            'token_type' => 'Bearer',
            'expires_in' => (int) $_ENV['JWT_TTL'],
        ]);

        return $this->cookie->set($res, $result['refresh_token']);
    }

    public function logout(Request $req, Response $res): Response
    {
        $raw = $this->cookie->read($req);
        if ($raw) {
            $this->tokens->revokeAllByToken($raw);
        }
        return $this->cookie->clear($this->json(['message' => 'Logged out']));
    }
}