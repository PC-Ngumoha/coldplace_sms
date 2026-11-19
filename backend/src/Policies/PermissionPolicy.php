<?php
declare(strict_types=1);

namespace App\Policies;

use App\Constants\Roles;
use App\Constants\Permissions;

/**
 * Provides a single source of truth of who can do what.
 */
final class PermissionPolicy
{
    private static array $excludedForManager = [Permissions::USERS_DEACTIVATE];

    public static function permissionsFor(string $role): array
    {
        return match ($role) {
            Roles::EXECUTIVE => Permissions::FOR_EXECUTIVE,

            Roles::ADMIN => Permissions::ALL,
            
            Roles::MANAGER => array_values(array_diff(Permissions::ALL, self::$excludedForManager)),

            Roles::CENTRAL => Permissions::FOR_CENTRAL,

            Roles::OUTLET => Permissions::FOR_OUTLET,

            Roles::VIEWER => Permissions::FOR_VIEWER,

            default => []
        };
    }

    /** Is this role allowed to do this ? */
    public static function can(string $role, string $permission): bool
    {
        return in_array($permission, self::permissionsFor($role), true);
    }
}