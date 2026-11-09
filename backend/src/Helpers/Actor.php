<?php
namespace App\Helpers;

use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Class represents information on the action to be taken
 */
final class Actor
{
    public function __construct(public readonly ?int $userId,
                                public readonly ?string $role,
                                public readonly ?int $locationId,
                                public readonly ?string $ipAddress,
                                public readonly ?string $userAgent) {}

    public static function fromRequest(Request $req)
    {
        $user = $req->getAttribute('user');

        return new self (
            $user ? (int) $user['id']: null,
            $user['role'] ?? null,
            isset($user['location_id']) ? (int) $user['location_id'] : null,
            $req->getServerParams()['REMOTE_ADDR'] ?? null,
            substr($req->getHeaderLine('User-Agent'), 0, 255) ?: null
        );
    }

    public function withUserId(int $id): self
    {
        return new self($id, $this->role, $this->locationId, $this->ipAddress, $this->userAgent);
    }
}