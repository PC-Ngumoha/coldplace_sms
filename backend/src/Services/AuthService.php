<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use App\Exceptions\AppException;
use App\Constants\User;

class AuthService
{
    public function __construct(private AuthRepository $repo,
                                private TokenService $tokens)
    {}

    public function login(string $email, string $password): array 
    {
        $user = $this->repo->retrieveUserByEmail($email);

        if (!$user) {
            throw new AppException('User not found', 401);
        }

        if (!password_verify($password, $user['password_hash'])) {
            throw new AppException('Invalid password', 401);
        }

        if ($user['status'] === User::INACTIVE) {
            throw new AppException('Your account has been deactivated', 401);
        }

        return [
            'refresh_token' => $this->tokens->createRefreshToken($user['id']),
            'access_token' => $this->tokens->createAccessToken($user)
        ];
    }

    public function refresh(string $raw): array
    {
        $result = $raw !== null ? $this->tokens->rotate($raw) : null;

        if ($result === null) {
            throw new AppException('Invalid refresh token', 401, true);
        }

        $user = $this->repo->retrieveUserById((int) $result['user_id']);
        if (!$user) {
            throw new AppException('Invalid refresh token', 401, true);
        }

        if ($user['status'] === User::INACTIVE) {
            // Revoke all tokens linked to this user.
            $this->tokens->revokeAllByToken($result['refresh_token']);
            throw new AppException('Your account has been deactivated', 401, true);
        }

        return [
            'refresh_token' => $result['refresh_token'],
            'access_token' => $this->tokens->createAccessToken($user)
        ];
    }

    public function logout(string $raw): void
    {
        $this->tokens->revokeAllByToken($raw);  // Always succeed.
    }
}