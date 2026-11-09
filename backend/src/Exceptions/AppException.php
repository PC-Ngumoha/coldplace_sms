<?php

namespace App\Exceptions;

class AppException extends \RuntimeException
{
    public function __construct(
        string $message,
        private int $status = 400,
        private bool $cookie = false,
        private array $details = [],
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
    }

    public function getStatus(): string { return $this->status; }
    public function getDetails(): array { return $this->details; }
    public function clearCookie(): bool { return $this->cookie; }
}