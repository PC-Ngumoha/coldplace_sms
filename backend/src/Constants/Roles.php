<?php

namespace App\Constants;


class Roles
{
    public const EXECUTIVE = 'executive';
    public const ADMIN = 'admin';
    public const MANAGER = 'manager';
    public const CENTRAL = 'central';
    public const OUTLET = 'outlet';
    public const VIEWER = 'viewer';

    public const ALL = [
        self::EXECUTIVE,
        self::ADMIN,
        self::MANAGER,
        self::CENTRAL,
        self::OUTLET,
        self::VIEWER
    ];
}