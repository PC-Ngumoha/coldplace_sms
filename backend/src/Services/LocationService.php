<?php

namespace App\Services;

use App\Constants\AuditAction;
use App\Repositories\LocationRepository;
use App\Constants\Roles;
use App\Constants\Location;
use App\Exceptions\AppException;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\TransactionManager;

class LocationService
{
    public function __construct(private LocationRepository $repo,
                                private AuditLogger $audit,
                                private TransactionManager $tx)
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

    public function create(Actor $actor, array $data): int
    {
        $name = trim((string) ($data['name'] ?? ''));
        $address = isset($data['address']) ? trim((string) $data['address']): null;

        if ($name === '') {
            throw new AppException('Missing parameters', 400);
        }

        try {
            return $this->tx->run(function () use ($actor, $name, $address) {
                $id = $this->repo->createLocation([
                    'name' => $name,
                    'address' => $address
                ]);

                $this->audit->log(
                    $actor,
                    AuditAction::LOCATION_CREATED,
                    'locations',
                    $id,
                    null,
                    ['name' => $name, 'address' => $address]
                );

                return $id;
            });
        } catch (\PDOException $err) {
            if ($err->getCode() === '23000') {  // Duplicate rows found
                throw new AppException('A location with this name already exists', 409);
            }
            throw $err;
        }

    }

    public function update(Actor $actor, int $locationId, array $data): int {

        $name = trim((string) ($data['name'] ?? ''));
        $address = isset($data['address']) ? trim((string) $data['address']) : null;
        $address = ($address === '') ? null : $address;

        if ($name === '') {
            throw new AppException('Missing parameters', 400);
        }

        try {
            return $this->tx->run(function () use ($actor, $locationId, $name, $address) {
                $old = $this->repo->retrieveLocationForUpdate($locationId);

                if (!$old) {
                    throw new AppException('Not found', 404);
                }


                if ($old['name'] === $name && $old['address'] === $address) return 0;

                $rows = $this->repo->updateLocation($locationId, [
                    'name' => $name,
                    'address' => $address
                ]);

                $this->audit->log(
                    $actor,
                    AuditAction::LOCATION_UPDATED,
                    'locations',
                    $locationId,
                    [ 'name' => $old['name'], 'address' => $old['address'] ],
                    [ 'name' => $name, 'address' => $address ]
                );

                return $rows;
            });
        } catch (\PDOException $err) {
            if ($err->getCode() === '23000') {
                throw new AppException('A location with this name already exists', 409);
            }
            throw $err;
        }
    }

    /**
     * TODO: Prevent dectivation if outlet has stock or transfers
     */
    public function deactivate(Actor $actor, int $locationId): int
    {
        return $this->tx->run(function () use ($actor, $locationId) {
            $location = $this->repo->retrieveLocationForUpdate($locationId);

            if (!$location) {
                throw new AppException('Not found', 404);
            }

            if ($location['is_central']) {
                throw new AppException('The central location cannot be deactivated', 409);
            }

            if ($location['status'] !== Location::ACTIVE) {
                return 0;
            }

            // TODO: Block deactivation if stock > 0 or transfers are Draft/Dispatched (as per PRD)

            $rows = $this->repo->setStatus($locationId, Location::INACTIVE);

            if ($rows === 1) {
                $this->audit->log(
                    $actor,
                    AuditAction::LOCATION_DEACTIVATED,
                    'locations',
                    $locationId,
                    ['status' => Location::ACTIVE],
                    ['status' => Location::INACTIVE],
                );
            }

            return $rows;
        });
    }

    public function activate(Actor $actor, int $locationId): int
    {
        return $this->tx->run(function () use ($actor, $locationId) {
            $location = $this->repo->retrieveLocationForUpdate($locationId);

            if (!$location) {
                throw new AppException('Not found', 404);
            }

            if ($location['is_central']) {
                throw new AppException('This operation is forbidden', 403);
            }

            if ($location['status'] !== Location::INACTIVE) {
                return 0;
            }

            $rows = $this->repo->setStatus($locationId, Location::ACTIVE);

            if ($rows === 1) {
                $this->audit->log(
                    $actor,
                    AuditAction::LOCATION_ACTIVATED,
                    'locations',
                    $locationId,
                    ['status' => Location::INACTIVE],
                    ['status' => Location::ACTIVE],
                );
            }

            return $rows;
        });
    }
}