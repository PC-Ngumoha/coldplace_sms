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

        $user = $this->repo->checkForUser($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $payload = [
            'access_token' => $this->tokens->createAccessToken($user),
            'token_type' => 'Bearer',
            'expires_in' => (int) $_ENV['JWT_TTL']
        ];

        return $this->json($payload);
    }
}