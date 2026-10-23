<?php

namespace App\Services;

use Firebase\JWT\JWT;

class TokenService
{
    public function __construct(private string $secret, private int $accessTtl) {}

    public function createAccessToken(array $user): string
    {
        $now = time();
        return JWT::encode([
            'iat' => $now,
            'exp' => $now + $this->accessTtl,
            'sub' => $user['id'],
            'email' => $user['email']
        ], $this->secret, 'HS256');
    }
}