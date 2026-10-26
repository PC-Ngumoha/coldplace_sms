<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\AuthRepository;
use App\Services\TokenService;

class Auth
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private AuthRepository $repo,
                                private TokenService $tokens) {}

    public function login(Request $req, Response $res): Response
    {
        $data = $req->getParsedBody() ?? [];
        $email = (string) $data['email'] ?? '';
        $password = (string) $data['password'] ?? '';

        $user = $this->repo->retrieveUserByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $refresh = $this->tokens->createRefreshToken($user['id']);
        return $this->json($this->tokenResponse($user, $refresh));
    }

    public function refresh(Request $req, Response $res): Response
    {
        $raw = ($req->getParsedBody() ?? [])['refresh_token'] ?? null;

        $result = is_string($raw) ? $this->tokens->rotate($raw) : null;

        if ($result === null) {
            return $this->json(['error' => 'Invalid refresh token'], 401);
        }

        $user = $this->repo->retrieveUserById((int) $result['user_id']);
        if (!$user) {
            return $this->json(['error' => 'Invalid refresh token'], 401);
        }

        return $this->json($this->tokenResponse($user, $result['refresh_token']));
    }

    public function logout(Request $req, Response $res): Response
    {
        $raw = ($req->getParsedBody() ?? [])['refresh_token'] ?? null;
        if (is_string($raw)) {
            $this->tokens->revokeAllByToken($raw);
        }
        return $this->json(['message' => 'Logged out']);
    }

    private function tokenResponse(array $user, string $refreshToken): array
    {
        return [
            'access_token' => $this->tokens->createAccessToken($user),
            'token_type' => 'Bearer',
            'expires_in' => (int) $_ENV['JWT_TTL'],
            'refresh_token' => $refreshToken,
        ];
    }
}