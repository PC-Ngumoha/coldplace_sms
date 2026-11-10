<?php
namespace App\Constants;

final class AuditAction
{
    public const LOCATION_CREATED = 'location.created';
    public const LOCATION_UPDATED = 'location.updated';
    public const LOCATION_DEACTIVATED = 'location.deactivated';
    public const LOCATION_ACTIVATED = 'location.activated';
    
    public const USER_CREATED = 'user.created';
    public const USER_UPDATED = 'user.updated';
    public const USER_PASSWORD_CHANGED = 'user.password_changed';
    public const USER_DEACTIVATED = 'user.deactivated';
    public const USER_ACTIVATED = 'user.activated';

    public const LOGIN_FAILED = 'auth.login_failed';
    public const REFRESH_FAILED = 'auth.refresh_failed';
    public const REFRESH_TOKEN_REUSE = 'auth.refresh_token_reuse';
    public const LOGIN = 'auth.login';
    public const LOGIN_DENIED_INACTIVE = 'auth.login_denied_inactive_account';
    public const LOGOUT = 'auth.logout';

}