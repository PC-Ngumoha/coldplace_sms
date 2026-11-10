<?php
declare(strict_types=1);
namespace App\Services;

use Firebase\JWT\JWT;
use PDO;
use App\Constants\RefreshOutcome;

class TokenService
{

    public function __construct(private string $secret, private int $accessTtl,
                                private PDO $conn, private int $refreshTtl) 
    {}

    public function createAccessToken(array $user): string
    {
        $now = time();
        return JWT::encode([
            'iat' => $now,
            'exp' => $now + $this->accessTtl,
            'sub' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
        ], $this->secret, 'HS256');
    }

    public function createRefreshToken(int $userId): string
    {
        $raw = bin2hex(random_bytes(32));
        $now = time();

        $this->conn->prepare(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES (?, ?, ?);'
        )->execute([
            $userId,
            hash('sha256', $raw),
            $now + $this->refreshTtl
        ]);

        return $raw;
    }

    /**
     * Validates refresh token and returns:
     * ['user_id'=> string, 'refresh_token' => string]
     */
    public function rotate(string $raw): ?array
    {
        $hash = hash('sha256', $raw);
        
        $this->conn->beginTransaction();
        try {
            $stmt = $this->conn->prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?');
            $stmt->execute([$hash]);
            $row = $stmt->fetch();

            if (!$row) {                                // No record found
                $this->conn->rollBack();
                return ['status' => RefreshOutcome::UNKNOWN];
            }

            if ($row['revoked_at'] !== null) {          // Token Reuse detected
                $this->revokeAll($row['user_id']);      // Revoke all tokens associated with this user.
                $this->conn->commit();
                return ['status' => RefreshOutcome::REVOKED, 'user_id' => $row['user_id']];
            }

            if ($row['expires_at'] < time()) {          // Expired
                $this->conn->rollBack();
                return ['status' => RefreshOutcome::EXPIRED, 'user_id' => $row['user_id']];
            }   

            // Claim this token: Guard against two simultaneous requests
            $claim = $this->conn->prepare(
                'UPDATE refresh_tokens SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL'
            );
            $claim->execute([time(), $row['id']]);
            if ($claim->rowCount() !== 1) {             // Should affect only one record
                $this->conn->rollBack();
                return ['status' => RefreshOutcome::RACE_LOST, 'user_id' => $row['user_id']];
            }

            // Create and return new refresh token
            $new = $this->createRefreshToken((int) $row['user_id']);
            $this->conn->commit();

            return [
                'status' => RefreshOutcome::OK,
                'user_id' => (int) $row['user_id'],
                'refresh_token' => $new
            ];

        } catch (\Throwable $e) { 
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Revokes a specific refresh token causing a logout of the user using it.
     */
    public function revokeByToken(string $raw): ?int
    {
        $hash = hash('sha256', $raw);

        $this->conn->beginTransaction();
        try {
            $stmt = $this->conn->prepare(
                'SELECT id, user_id FROM refresh_tokens
                WHERE token_hash = ? AND revoked_at IS NULL
                FOR UPDATE'
            );
            $stmt->execute([$hash]);
            $row = $stmt->fetch();

            if (!$row) {
                $this->conn->commit();
                return null;
            }

            $this->conn->prepare(
                'UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?'
            )->execute([
                time(),
                (int) $row['id']
            ]);
            $this->conn->commit();

            return (int) $row['user_id'];

        } catch (\Throwable $err) {
            $this->conn->rollBack();
            throw $err;
        }
    }

    /** Revoke every refresh token belonging to a user to protect
     * against malicious access attempts
     */
    public function revokeAll(int $userId): void
    {
        $this->conn->prepare(
            'UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL'
        )->execute([time(), $userId]);
    }
}