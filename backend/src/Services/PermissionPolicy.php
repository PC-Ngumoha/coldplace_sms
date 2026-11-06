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

        Roles::EXECUTIVE => [
            Permissions::LOCATIONS_LIST,
            Permissions::LOCATIONS_RETRIEVE,
            Permissions::USERS_CHANGE_PASSWORD_OWN,
            Permissions::USERS_PROFILE
        ],

        Roles::MANAGER => [
            Permissions::LOCATIONS_LIST,
            Permissions::LOCATIONS_RETRIEVE,
            Permissions::USERS_CHANGE_PASSWORD_OWN,
            Permissions::USERS_PROFILE
        ],

        Roles::CENTRAL => [
            Permissions::LOCATIONS_LIST,
            Permissions::LOCATIONS_RETRIEVE,
            Permissions::USERS_CHANGE_PASSWORD_OWN,
            Permissions::USERS_PROFILE
        ],

        Roles::OUTLET => [
            Permissions::LOCATIONS_LIST,
            Permissions::LOCATIONS_RETRIEVE,
            Permissions::USERS_CHANGE_PASSWORD_OWN,
            Permissions::USERS_PROFILE
        ],

        Roles::VIEWER => [
            Permissions::LOCATIONS_LIST,
            Permissions::LOCATIONS_RETRIEVE,
            Permissions::USERS_CHANGE_PASSWORD_OWN,
            Permissions::USERS_PROFILE
        ],
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