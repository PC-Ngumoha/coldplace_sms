<?php 

namespace App\Services;

use App\Repositories\UnitRepository;

class UnitService
{
    public function __construct(private UnitRepository $repo) {}

    public function list(): array 
    {
        return $this->repo->showAllUnits();
    }
}