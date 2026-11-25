<?php

namespace App\Helpers;

use App\Exceptions\AppException;

final class Decimal
{
    /** Quantity: up to 9 integer digits and 3 decimals (DECIMAL(12,3)). Returns a scale-3 string. */
    public static function qty(string $v, string $label): string
    {
        if (!preg_match('/^\d{1,9}(\.\d{1,3})?$/', $v)) {
            throw new AppException("$label must be a number with up to 3 decimal places", 400);
        }
        return bcadd($v, '0', 3);
    }

    /** Money: up to 10 integer digits and 2 decimals (DECIMAL(12,2)). Returns a scale-2 string. */
    public static function money(string $v, string $label): string
    {
        if (!preg_match('/^\d{1,10}(\.\d{1,2})?$/', $v)) {
            throw new AppException("$label must be an amount with up to 2 decimal places", 400);
        }
        return bcadd($v, '0', 2);
    }

    /** Multiply, then round half up to $scale. Inputs here are positive. */
    public static function mulRound(string $a, string $b, int $scale): string
    {
        $exact = bcmul($a, $b, 8);
        $half  = '0.' . str_repeat('0', $scale) . '5';
        return bcadd($exact, $half, $scale);   // bcadd truncates, so adding half rounds up
    }

    /** Round half away from zero. Pass a value with at least scale+1 decimals. */
    public static function round(string $v, int $scale): string
    {
        $half = '0.' . str_repeat('0', $scale) . '5';
        return str_starts_with($v, '-') ? bcsub($v, $half, $scale) : bcadd($v, $half, $scale);
    }
}