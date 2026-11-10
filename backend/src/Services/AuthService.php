<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use App\Exceptions\AppException;
use App\Constants\User;
use App\Constants\AuditAction;
use App\Constants\RefreshOutcome;
use App\Helpers\AuditLogger;
use App\Helpers\Actor;

class AuthService
{
    public function __construct(private AuthRepository $repo,
                                private TokenService $tokens,
                                private AuditLogger $audit)
    {}

    public function login(Actor $actor, string $email, string $password): array 
    {
        $user = $this->repo->retrieveUserByEmail($email);

        $hash = $user['password_hash'] ?? password_hash('kR9#mZ4v!pQx7&Lw2jNf8@Yb3s', PASSWORD_DEFAULT);
        $passwordOk = password_verify($password, $hash);

        if (!$user || !$passwordOk) {
            $this->safeLog(
                $actor,
                AuditAction::LOGIN_FAILED,
                $user['id'] ?? null,
                ['email' => $email],
                $user ? 'wrong_password' : 'Unknown_email'
            );
            throw new AppException('Invalid credentials', 401);
        }

        if ($user['status'] === User::INACTIVE) {
            $this->safeLog(
                $actor->withUserId((int) $user['id']),
                AuditAction::LOGIN_DENIED_INACTIVE,
                (int) $user['id'],
                ['email' => $email],
            );
            throw new AppException('Your account has been deactivated', 401);
        }

        $tokens =  [
            'refresh_token' => $this->tokens->createRefreshToken($user['id']),
            'access_token' => $this->tokens->createAccessToken($user)
        ];

        $this->safeLog($actor->withUserId((int) $user['id']), AuditAction::LOGIN, (int) $user['id']);

        return $tokens;
    }

    public function refresh(Actor $actor, string $raw): array
    {
        if ($raw === null || $raw === '') {
            throw new AppException('Invalid refresh token', 401, true);
        }

        $result = $this->tokens->rotate($raw);

        if ($result['status'] !== RefreshOutcome::OK) {
            $this->logRefreshFailure($actor, $result);
            throw new AppException('Invalid refresh token', 401, true);
        }

        $user = $this->repo->retrieveUserById((int) $result['user_id']);
        

        if (!$user || $user['status'] === User::INACTIVE) {
            // Revoke all tokens linked to this user.
            $this->tokens->revokeAll((int) $result['user_id']);
            $this->safeLog(
                $actor->withUserId((int) $result['user_id']),
                AuditAction::REFRESH_FAILED,
                (int) $result['user_id'],
                null,
                'account_inactive'
            );
            throw new AppException('Invalid refresh token', 401, true);
        }

        return [
            'refresh_token' => $result['refresh_token'],
            'access_token' => $this->tokens->createAccessToken($user)
        ];
    }

    public function logout(Actor $actor, string $raw): void
    {
        if ($raw === null || $raw === '') return;

        $userId = $this->tokens->revokeByToken($raw);  // Always succeed.
        
        if ($userId) {  // Log a logout when one actually happens
            $this->safeLog($actor->withUserId((int) $userId), AuditAction::LOGOUT, $userId);
        }
    }

    private function safeLog(Actor $actor, string $action, ?int $entityId, ?array $new = null, ?string $reason = null): void
    {
        try {
            $this->audit->log($actor, $action, 'users', $entityId, null, $new, $reason);
        } catch (\Throwable $err) {
            error_log('Audit Failed: ' . $err->getMessage());
        }
    }

    private function logRefreshFailure(Actor $actor, array $result): void
    {
        $userId = $result['user_id'] ?? null;
        $actor = $userId ? $actor->withUserId((int) $userId) : $actor;

        $action = $result['status'] === RefreshOutcome::REVOKED
            ? AuditAction::REFRESH_TOKEN_REUSE
            : AuditAction::REFRESH_FAILED;

        $this->safeLog($actor, $action, $userId, null, $result['status']);
    }
}