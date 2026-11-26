<?php

namespace App\Helpers;

use App\Exceptions\AppException;

final class BusinessDay
{
    public const BACKDATE_DAYS = 3;
    private const TZ = 'Africa/Lagos';

    public static function today(): \DateTimeImmutable
    {
        return new \DateTimeImmutable('today', new \DateTimeZone(self::TZ));
    }

    public static function latest(): string
    {
        return self::today()->format('Y-m-d');
    }

    public static function earliestEditable(): string
    {
        return self::today()->modify('-' . self::BACKDATE_DAYS . ' days')->format('Y-m-d');
    }

    /** 'future', 'locked' (older than the window) or 'within'. Y-m-d strings compare correctly. */
    public static function position(string $date): string
    {
        if ($date > self::latest()) {
            return 'future';
        }
        if ($date < self::earliestEditable()) {
            return 'locked';
        }
        return 'within';
    }

    /** Returns a valid Y-m-d string, or null when blank. */
    public static function parse(mixed $raw, string $label = 'date'): ?string
    {
        $raw = trim((string) ($raw ?? ''));
        if ($raw === '') {
            return null;
        }
        $d = \DateTimeImmutable::createFromFormat('!Y-m-d', $raw, new \DateTimeZone(self::TZ));
        if (!$d || $d->format('Y-m-d') !== $raw) {
            throw new AppException("Invalid $label date", 400);
        }
        return $raw;
    }
}