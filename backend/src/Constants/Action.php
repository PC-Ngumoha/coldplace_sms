<?php
namespace App\Constants;

final class Action
{
    public const LOCATION_CREATED = 'locations.created';
    public const LOCATION_UPDATED = 'locations.updated';
    public const USER_CREATED = 'users.created';
    public const USER_UPDATED = 'users.updated';
    public const LOGIN_FAILED = 'auth.login_failed';
    public const LOGIN_SUCCESSFUL = 'auth.login_successful';
}