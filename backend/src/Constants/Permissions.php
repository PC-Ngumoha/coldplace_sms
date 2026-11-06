<?php
namespace App\Constants;

class Permissions 
{
    public const LOCATIONS_LIST = 'locations:list';
    public const LOCATIONS_RETRIEVE = 'locations:retrieve';
    public const LOCATIONS_CREATE = 'locations:create';
    public const LOCATIONS_EDIT = 'locations:edit';
    public const LOCATIONS_ACTIVATE = 'locations:activate';
    public const LOCATIONS_DEACTIVATE = 'locations:deactivate';
    
    public const USERS_LIST = 'users:list';
    public const USERS_RETRIEVE = 'users:retrieve';
    public const USERS_CREATE = 'users:create';
    public const USERS_EDIT = 'users:edit';
    public const USERS_ACTIVATE = 'users:activate';
    public const USERS_DEACTIVATE = 'users:deactivate';
    public const USERS_CHANGE_PASSWORD_ANY = 'users:change_password:any';
    public const USERS_CHANGE_PASSWORD_OWN = 'users:change_password:own';
    public const USERS_PROFILE = 'users:profile';

    public const ALL = [
        self::LOCATIONS_LIST,
        self::LOCATIONS_RETRIEVE,
        self::LOCATIONS_CREATE,
        self::LOCATIONS_EDIT,
        self::LOCATIONS_ACTIVATE,
        self::LOCATIONS_DEACTIVATE,

        self::USERS_LIST,
        self::USERS_RETRIEVE,
        self::USERS_CREATE,
        self::USERS_EDIT,
        self::USERS_CHANGE_PASSWORD_ANY,
        self::USERS_CHANGE_PASSWORD_OWN,
        self::USERS_ACTIVATE,
        self::USERS_DEACTIVATE,
    ];
}