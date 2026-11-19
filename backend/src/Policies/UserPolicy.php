<?php
declare(strict_types=1);
namespace App\Policies;

use App\Constants\User;
use App\Constants\Roles;


final class UserPolicy
{
    public static function isRoot(array $user): bool
    {
        return (int) $user['id'] === User::ROOT_ADMIN;
    }

    public static function canModify(array $actor, array $target): bool
    {
        return !self::isSameUser($actor, $target) && self::outranks($actor, $target);
    }

    private static function isSameUser(array $a, array $b): bool
    {
        return (int) $a['id'] === (int) $b['id'];
    }

    private static function outranks(array $actor, array $target): bool
    {
        if (self::isRoot($target)) {
            return false;       // No one can touch a root user
        }

        if (self::isRoot($actor)) {
            return true;        // Root admin can touch everyone else.
        }

        return match ($target['role']) {
            Roles::ADMIN    => false,   // No one except root
            Roles::MANAGER  => $actor['role'] === Roles::ADMIN, // Only the admin
            Roles::EXECUTIVE => in_array($actor['role'], [Roles::MANAGER, Roles::ADMIN], true),
            Roles::CENTRAL => in_array($actor['role'], [Roles::MANAGER, Roles::ADMIN], true),
            Roles::OUTLET => in_array($actor['role'], [Roles::MANAGER, Roles::ADMIN], true),
            Roles::VIEWER => in_array($actor['role'], [Roles::MANAGER, Roles::ADMIN], true),
        };
    }
}