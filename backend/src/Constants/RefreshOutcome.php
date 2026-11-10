<?php
namespace App\Constants;

final class RefreshOutcome
{
    public const OK         = 'ok';
    public const UNKNOWN    = 'unknown_token';
    public const EXPIRED    = 'expired';
    public const REVOKED    = 'token_reuse';
    public const RACE_LOST     = 'concurrent_use';
}