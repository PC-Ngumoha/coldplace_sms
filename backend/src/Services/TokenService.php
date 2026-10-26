<?php

namespace App\Services;

use App\Database;
use Firebase\JWT\JWT;
use PDO;

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
            'email' => $user['email']
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
                return null;
            }

            if ($row['revoked_at'] !== null) {          // Token Reuse detected
                $this->revokeAll($row['user_id']);      // Revoke all tokens associated with this user.
                $this->conn->commit();
                return null;
            }

            if ($row['expires_at'] < time()) {          // Expired
                $this->conn->rollBack();
                return null;
            }   

            // Claim this token: Guard against two simultaneous requests
            $claim = $this->conn->prepare(
                'UPDATE refresh_tokens SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL'
            );
            $claim->execute([time(), $row['id']]);
            if ($claim->rowCount() !== 1) {             // Should affect only one record
                $this->conn->rollBack();
                return null;
            }

            // Create and return new refresh token
            $new = $this->createRefreshToken((int) $row['user_id']);
            $this->conn->commit();

            return [
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
     * Utility function: Revokes all tokens belonging to a user from a single token
     * Used in: The logout route.
     */
    public function revokeAllByToken(string $raw): void
    {
        $stmt = $this->conn->prepare('SELECT user_id FROM refresh_tokens WHERE token_hash = ?');
        $stmt->execute([hash('sha256', $raw)]);
        $row = $stmt->fetch();
        if ($row) {
            $this->revokeAll($row['user_id']);
        }
    }

    private function revokeAll(int $userId): void
    {
        $this->conn->prepare(
            'UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL'
        )->execute([time(), $userId]);
    }
}