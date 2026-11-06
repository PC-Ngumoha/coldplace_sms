<?php

namespace App\Services;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

final class RefreshCookie
{
    private const NAME = 'refresh_token';

    public function __construct(private int $ttl, private bool $secure,
                                private string $path = '/api/auth',
                                private string $sameSite = 'Strict')
    {}

    public function set(Response $res, string $token): Response
    {
        return $res->withAddedHeader('Set-Cookie', $this->build($token, $this->ttl));
    }

    public function clear(Response $res): Response
    {
        return $res->withAddedHeader('Set-Cookie', $this->build('', 0));
    }

    public function read(Request $req): ?string
    {
        $value = $req->getCookieParams()[self::NAME] ?? null;
        return is_string($value) && $value !== '' ? $value : null;
    }

    private function build(string $value, int $maxAge): string 
    {
        $parts = [
            self::NAME . '=' . $value,
            'Max-Age=' . $maxAge,
            'Path=' . $this->path,
            'HttpOnly',
            'SameSite=' . $this->sameSite,
        ];

        if ($maxAge === 0) {
            $parts[] = 'Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        if ($this->secure) {
            $parts[] = 'Secure';
        }

        return implode('; ', $parts);
    }
}