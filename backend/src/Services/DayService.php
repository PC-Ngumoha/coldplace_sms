<?php

namespace App\Services;

use App\Constants\Location;
use App\Constants\Roles;
use App\Constants\Permissions;
use App\Constants\AuditAction;
use App\Exceptions\AppException;
use App\Repositories\DailyCloseRepository;
use App\Repositories\LocationRepository;
use App\Repositories\SaleRepository;
use App\Policies\PermissionPolicy;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\BusinessDay;
use App\Helpers\TransactionManager;

class DayService
{
    private const MAX_LIST_DAYS = 93;

    public function __construct(
        private DailyCloseRepository $repo,
        private SaleRepository $sales,
        private LocationRepository $locations,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    /** State of one location and date, with what the current user may do about it. */
    public function status(Actor $actor, array $query): array
    {
        // $this->authorize($actor, Permissions::DAYS_STATUS);

        $location   = $this->resolveLocation($actor, $query['location_id'] ?? null, false);
        $locationId = (int) $location['id'];
        $date       = BusinessDay::parse($query['date'] ?? null, 'date') ?? BusinessDay::latest();

        $row   = $this->repo->find($locationId, $date) ?: null;
        $state = $this->stateOf($date, $row);

        return [
            'location_id'      => $locationId,
            'date'             => $date,
            'state'            => $state,   // open | closed | locked | future
            'was_reopened'     => $row !== null && $row['status'] === 'reopened',
            'closed_by_name'   => $row['closed_by_name'] ?? null,
            'closed_at'        => $this->iso($row['closed_at'] ?? null),
            'reopened_by_name' => $row['reopened_by_name'] ?? null,
            'reopened_at'      => $this->iso($row['reopened_at'] ?? null),
            'can_record'       => $state === 'open' && PermissionPolicy::can($actor->role, Permissions::SALES_CREATE),
            'can_close'        => $state === 'open' && PermissionPolicy::can($actor->role, Permissions::DAYS_CLOSE),
            'can_reopen'       => $state === 'closed' && PermissionPolicy::can($actor->role, Permissions::DAYS_REOPEN),
            'day_total'        => $this->sales->dayTotal($locationId, $date),
            'window'           => $this->window(),
        ];
    }

    /** Close and reopen records in a range (default: the recording window). */
    public function list(Actor $actor, array $query): array
    {
        // $this->authorize($actor, Permissions::DAYS_STATUS);

        $scope     = $this->scopeLocation($actor);
        $requested = (int) ($query['location_id'] ?? 0);
        $locationId = $scope ?? ($requested > 0 ? $requested : null);

        $window = $this->window();
        $from = BusinessDay::parse($query['from'] ?? null, 'from') ?? $window['earliest'];
        $to   = BusinessDay::parse($query['to'] ?? null, 'to') ?? $window['latest'];

        if ($from > $to) {
            throw new AppException('"from" must not be after "to"', 400);
        }
        $days = (int) (new \DateTimeImmutable($from))->diff(new \DateTimeImmutable($to))->days;
        if ($days > self::MAX_LIST_DAYS) {
            throw new AppException('Date range is too large (max ' . self::MAX_LIST_DAYS . ' days)', 400);
        }

        return [
            'window' => $window,
            'items'  => array_map(fn ($r) => [
                'id'               => (int) $r['id'],
                'location_id'      => (int) $r['location_id'],
                'location_name'    => $r['location_name'],
                'date'             => $r['close_date'],
                'status'           => $r['status'],
                'closed_by_name'   => $r['closed_by_name'],
                'closed_at'        => $this->iso($r['closed_at']),
                'reopened_by_name' => $r['reopened_by_name'],
                'reopened_at'      => $this->iso($r['reopened_at']),
            ], $this->repo->between($from, $to, $locationId)),
        ];
    }

    // ---------- Close ----------

    public function close(Actor $actor, array $data): array
    {
        // $this->authorize($actor, Permissions::DAYS_CLOSE);

        $location   = $this->resolveLocation($actor, $data['location_id'] ?? null, true);
        $locationId = (int) $location['id'];
        $date       = $this->requireDate($data['date'] ?? null);
        $this->assertWithinWindow($date);

        try {
            return $this->tx->run(function () use ($actor, $locationId, $date) {
                $row = $this->repo->findForUpdate($locationId, $date);

                if ($row && $row['status'] === 'closed') {
                    return ['status' => 'unchanged', 'date' => $date];
                }

                if ($row) {
                    $this->repo->markClosed((int) $row['id'], $actor->userId);
                    $id = (int) $row['id'];
                    $before = 'reopened';
                } else {
                    $id = $this->repo->insertClosed($locationId, $date, $actor->userId);
                    $before = 'open';
                }

                $this->audit->log(
                    $actor, AuditAction::DAY_CLOSED, 'daily_closes', $id,
                    ['status' => $before],
                    ['status' => 'closed', 'location_id' => $locationId, 'date' => $date]
                );

                return ['status' => 'closed', 'date' => $date];
            });
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {   // another request closed it first
                return ['status' => 'unchanged', 'date' => $date];
            }
            throw $e;
        }
    }

    // ---------- Reopen ----------

    public function reopen(Actor $actor, array $data): array
    {
        // $this->authorize($actor, Permissions::DAYS_REOPEN);

        $location   = $this->resolveLocation($actor, $data['location_id'] ?? null, true);
        $locationId = (int) $location['id'];
        $date       = $this->requireDate($data['date'] ?? null);
        $this->assertWithinWindow($date);

        $reason = trim((string) ($data['reason'] ?? ''));
        if (mb_strlen($reason) < 5) {
            throw new AppException('Give a reason for reopening (at least 5 characters)', 400);
        }
        if (mb_strlen($reason) > 255) {
            throw new AppException('Reason is too long (max 255 characters)', 400);
        }

        return $this->tx->run(function () use ($actor, $locationId, $date, $reason) {
            $row = $this->repo->findForUpdate($locationId, $date);

            if (!$row || $row['status'] !== 'closed') {
                return ['status' => 'unchanged', 'date' => $date];   // already open
            }

            $this->repo->markReopened((int) $row['id'], $actor->userId);

            $this->audit->log(
                $actor, AuditAction::DAY_REOPENED, 'daily_closes', (int) $row['id'],
                ['status' => 'closed'],
                ['status' => 'reopened', 'location_id' => $locationId, 'date' => $date],
                $reason
            );

            return ['status' => 'reopened', 'date' => $date];
        });
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, $permission)) {
    //         throw new AppException('Forbidden', 403);
    //     }
    // }

    /** Handlers are limited to their own location. Everyone else is free (null). */
    private function scopeLocation(Actor $actor): ?int
    {
        if ($actor->role === Roles::CENTRAL || $actor->role === Roles::OUTLET) {
            if ($actor->locationId === null) {
                throw new AppException('Forbidden', 403);
            }
            return $actor->locationId;
        }
        return null;
    }

    private function resolveLocation(Actor $actor, mixed $requested, bool $mustBeActive): array
    {
        $locationId = $this->scopeLocation($actor) ?? (int) ($requested ?? 0);   // request only for non-handlers
        if ($locationId <= 0) {
            throw new AppException('Location is required', 400);
        }

        $location = $this->locations->retrieveLocation($locationId);
        if (!$location) {
            throw new AppException('Location does not exist', 400);
        }
        if ($mustBeActive && $location['status'] !== Location::ACTIVE) {
            throw new AppException('Location is inactive', 400);
        }
        return $location;
    }

    private function requireDate(mixed $raw): string
    {
        $date = BusinessDay::parse($raw, 'date');
        if ($date === null) {
            throw new AppException('Date is required', 400);
        }
        return $date;
    }

    /** Closing and reopening only make sense inside the recording window. */
    private function assertWithinWindow(string $date): void
    {
        $position = BusinessDay::position($date);

        if ($position === 'future') {
            throw new AppException('A future date cannot be closed or reopened', 400);
        }
        if ($position === 'locked') {
            throw new AppException(
                'This date is older than ' . BusinessDay::BACKDATE_DAYS . ' days and is already locked', 409);
        }
    }

    private function stateOf(string $date, ?array $row): string
    {
        $position = BusinessDay::position($date);
        if ($position === 'future') {
            return 'future';
        }
        if ($position === 'locked') {
            return 'locked';
        }
        return ($row !== null && $row['status'] === 'closed') ? 'closed' : 'open';
    }

    private function window(): array
    {
        return ['earliest' => BusinessDay::earliestEditable(), 'latest' => BusinessDay::latest()];
    }

    /** Lagos timestamp to ISO 8601 with offset, so the browser parses it correctly. */
    private function iso(?string $ts): ?string
    {
        if ($ts === null) {
            return null;
        }
        return (new \DateTimeImmutable($ts, new \DateTimeZone('Africa/Lagos')))
            ->format(\DateTimeInterface::ATOM);
    }
}