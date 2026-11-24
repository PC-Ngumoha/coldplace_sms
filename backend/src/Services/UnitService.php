<?php 

namespace App\Services;

use App\Repositories\UnitRepository;

class UnitService
{
    public function __construct(private UnitRepository $repo) {}

    /**
     * NOTE: This will return only 'active' units by default
     * 
     * This is okay for now but might need to be changed later on.
     */
    public function list(): array 
    {
        return $this->repo->showAllUnits();
    }
}