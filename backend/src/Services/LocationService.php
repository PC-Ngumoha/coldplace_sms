<?php

namespace App\Services;

use App\Repositories\LocationRepository;
use App\Constants\Roles;
use App\Constants\Location;
use App\Exceptions\AppException;

class LocationService
{
    public function __construct(private LocationRepository $repo)
    {}

    public function list(array $currentUser): array
    {
        if ($currentUser['role'] === Roles::OUTLET) {
            return $this->repo->showAllLocations($currentUser['location_id']);
        } else {
            return $this->repo->showAllLocations();
        }
    }

    public function retrieve(array $currentUser, int $locationId): array
    {
        // Outlet users can only retrieve their own locations.
        if ($currentUser['role'] === Roles::OUTLET) {
            if ($currentUser['location_id'] !== $locationId) {
                throw new AppException('Forbidden', 403);
            }
        }

        $location = $this->repo->retrieveLocation($locationId);

        if (!$location) {
            throw new AppException('Not found', 404);
        }

        return $location;
    }

    public function create(array $data): int
    {
        if (empty($data) | !$data['name']) {
            throw new AppException('Missing parameters', 400);
        }

        $rows = $this->repo->createLocation($data);

        return $rows;
    }

    public function update(int $locationId, array $data): int {
        if (empty($data) || !$data['name']) {
            throw new AppException('Missing parameters', 400);
        }

        $rows = $this->repo->updateLocation($locationId, $data);

        return $rows;
    }

    public function deactivate(int $locationId): int
    {
        $location = $this->repo->retrieveLocation($locationId);
        $rows = null;

        if (!$location) {
            throw new AppException('Not found', 404);
        }

        if ($location['is_central']) {
            throw new AppException('This operation is forbidden', 403);
        }

        if ($location['status'] === Location::ACTIVE) {
            $rows = $this->repo->setStatus($locationId, Location::INACTIVE);
        }

        return $rows;
    }

    public function activate(int $locationId): int
    {
        $location = $this->repo->retrieveLocation($locationId);
        $rows = null;

        if (!$location) {
            throw new AppException('Not found', 404);
        }

        if ($location['is_central']) {
            throw new AppException('This operation is forbidden', 403);
        }

        if ($location['status'] === Location::INACTIVE) {
            $rows = $this->repo->setStatus($locationId, Location::ACTIVE);
        }

        return $rows;
    }
}