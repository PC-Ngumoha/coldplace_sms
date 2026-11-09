<?php

namespace App\Helpers;

use App\Database;

use PDO;

class AuditLogger
{
    private PDO $conn;
    private const SECRET_KEYS = ['password', 'password_hash', 'token', 'refresh_token'];

    public function __construct(private Database $db)
    {
        $this->conn = $db->connect();    
    }

    public function log(
        Actor $actor,
        string $action,
        string $entity,
        ?int $entityId = null,
        ?array $old = null,
        ?array $new = null,
        ?string $reason = null
    ): void {
        $sql = 'INSERT INTO audit_logs
                (user_id, action, entity, entity_id, old_value, new_value, reason, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $actor->userId,
            $action,
            $entity,
            $entityId,
            $old ? json_encode($this->redact($old)) : null,
            $new ? json_encode($this->redact($new)) : null,
            $reason,
            $actor->ipAddress,
            $actor->userAgent,
        ]);
    }

    private function redact(array $data): array
    {
        foreach ($this::SECRET_KEYS as $key) {
            if (array_key_exists($key, $data)) {
                $data[$key] = '[redacted]';
            }
        }

        return $data;
    }
}