<?php

namespace App\Exceptions;

class AmbiguousCustomer extends AppException
{
    public function __construct(public readonly array $candidates) 
    {
        parent::__construct('Several customers match this name', 409);
    }
}