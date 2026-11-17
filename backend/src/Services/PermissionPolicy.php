<?php
namespace App\Services;

use App\Constants\Roles;
use App\Constants\Permissions;

/**
 * Provides a single source of truth of who can do what.
 */
final class PermissionPolicy
{
    private const ROLES = [
        Roles::ADMIN => Permissions::ALL,

        Roles::EXECUTIVE => Permissions::FOR_EXECUTIVE,

        Roles::MANAGER => Permissions::FOR_MANAGER,

        Roles::CENTRAL => Permissions::FOR_CENTRAL,

        Roles::OUTLET => Permissions::FOR_OUTLET,

        Roles::VIEWER => Permissions::FOR_VIEWER,
    ];

    /** All permissions for a given role */
    public static function permissionsFor(string $role): array
    {
        return self::ROLES[$role] ?? [];
    }

    /** Is this role allowed to do this ? */
    public static function can(string $role, string $permission): bool
    {
        return in_array($permission, self::permissionsFor($role), true);
    }
}