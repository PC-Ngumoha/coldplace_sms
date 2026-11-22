<?php

namespace App\Services;

use App\Constants\Permissions;
use App\Constants\Roles;
use App\Constants\Supplier;
use App\Constants\AuditAction;
use App\Exceptions\AppException;
use App\Repositories\SupplierRepository;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\TransactionManager;
use App\Policies\PermissionPolicy;

class SupplierService
{
    public function __construct(
        private SupplierRepository $repo,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    /** Admin/Manager: everything, including inactive. Central: all active. Outlet: outlet_allowed only. */
    public function list(Actor $actor): array
    {
        // $this->authorize($actor, Permissions::SUPPLIERS_LIST);

        $isOutlet = $actor->role === Roles::OUTLET;
        $canManage = PermissionPolicy::can($actor->role, Permissions::SUPPLIERS_EDIT);

        $rows = $this->repo->list(!$isOutlet, !$canManage);

        return array_map(fn ($r) => $this->present($r, $isOutlet), $rows);
    }

    public function retrieve(Actor $actor, int $supplierId): array
    {
        // $this->authorize($actor, Permissions::SUPPLIERS_RETRIEVE);

        $supplier = $this->repo->retrieve($supplierId);
        if (!$supplier) {
            throw new AppException('Not found', 404);
        }

        return $this->present($supplier, false);
    }

    // ---------- Create ----------

    public function create(Actor $actor, array $data): int
    {
        // $this->authorize($actor, Permissions::SUPPLIERS_CREATE);

        $in = $this->validate($data);

        try {
            return $this->tx->run(function () use ($actor, $in) {
                $id = $this->repo->create([
                    'name'           => $in['name'],
                    'contact'        => $in['contact'],
                    'notes'          => $in['notes'],
                    'outlet_allowed' => $in['outlet_allowed'],
                    'created_by'     => $actor->userId,
                ]);

                $this->audit->log(
                    $actor, AuditAction::SUPPLIER_CREATED, 'suppliers', $id, null,
                    [
                        'name'           => $in['name'],
                        'contact'        => $in['contact'],
                        'notes'          => $in['notes'],
                        'outlet_allowed' => $in['outlet_allowed'],
                    ]
                );

                return $id;
            });
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new AppException('A supplier with this name already exists', 409);
            }
            throw $e;
        }
    }

    // ---------- Update ----------

    public function update(Actor $actor, int $supplierId, array $data): int
    {
        // $this->authorize($actor, Permissions::SUPPLIERS_EDIT);

        try {
            return $this->tx->run(function () use ($actor, $supplierId, $data) {
                $old = $this->repo->retrieveForUpdate($supplierId);
                if (!$old) {
                    throw new AppException('Not found', 404);
                }

                // A key that is absent keeps its current value, so a partial request can't wipe data
                $in = $this->validate([
                    'name'           => $data['name'] ?? '',
                    'contact'        => array_key_exists('contact', $data) ? $data['contact'] : $old['contact'],
                    'notes'          => array_key_exists('notes', $data) ? $data['notes'] : $old['notes'],
                    'outlet_allowed' => array_key_exists('outlet_allowed', $data)
                        ? $data['outlet_allowed'] : (bool) $old['outlet_allowed'],
                ]);

                $oldValues = [
                    'name'           => $old['name'],
                    'contact'        => $old['contact'],
                    'notes'          => $old['notes'],
                    'outlet_allowed' => (bool) $old['outlet_allowed'],
                ];

                if ($oldValues === $in) {
                    return 0;   // no change: no write, no audit
                }

                $this->repo->update($supplierId, $in);

                $this->audit->log(
                    $actor, AuditAction::SUPPLIER_UPDATED, 'suppliers', $supplierId,
                    $oldValues, $in
                );

                return 1;
            });
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new AppException('A supplier with this name already exists', 409);
            }
            throw $e;
        }
    }

    // ---------- Status ----------

    public function deactivate(Actor $actor, int $supplierId): int
    {
        // $this->authorize($actor, Permissions::SUPPLIERS_DEACTIVATE);
        return $this->changeStatus($actor, $supplierId, Supplier::ACTIVE, Supplier::INACTIVE,
            AuditAction::SUPPLIER_DEACTIVATED);
    }

    public function activate(Actor $actor, int $supplierId): int
    {
        // $this->authorize($actor, Permissions::SUPPLIERS_ACTIVATE);
        return $this->changeStatus($actor, $supplierId, Supplier::INACTIVE, Supplier::ACTIVE,
            AuditAction::SUPPLIER_ACTIVATED);
    }

    private function changeStatus(Actor $actor, int $id, string $from, string $to, string $action): int
    {
        return $this->tx->run(function () use ($actor, $id, $from, $to, $action) {
            $supplier = $this->repo->retrieveForUpdate($id);
            if (!$supplier) {
                throw new AppException('Not found', 404);
            }
            if ($supplier['status'] !== $from) {
                return 0;   // already in the target state
            }

            $rows = $this->repo->setStatus($id, $to, $from);
            if ($rows === 1) {
                $this->audit->log($actor, $action, 'suppliers', $id,
                    ['status' => $from], ['status' => $to]);
            }

            return $rows;
        });
    }

    // ---------- Used by ReceiptService ----------

    /**
     * Confirms a supplier may be used for a receipt at this kind of location.
     * Outlets may only use suppliers flagged outlet_allowed.
     */
    public function assertUsableAt(int $supplierId, string $locationType): array
    {
        $supplier = $this->repo->retrieve($supplierId);

        if (!$supplier || $supplier['status'] !== Supplier::ACTIVE) {
            throw new AppException('Supplier does not exist or is inactive', 400);
        }
        if ($locationType === 'outlet' && !(bool) $supplier['outlet_allowed']) {
            throw new AppException('This supplier is not available for outlets', 403);
        }

        return $supplier;
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, $permission)) {
    //         throw new AppException('Forbidden', 403);
    //     }
    // }

    /** Syntactic validation and normalisation. No database access. */
    private function validate(array $data): array
    {
        $name    = trim((string) ($data['name'] ?? ''));
        $contact = trim((string) ($data['contact'] ?? ''));
        $notes   = trim((string) ($data['notes'] ?? ''));

        if ($name === '' || strlen($name) > 150) {
            throw new AppException('Name is required (max 150 characters)', 400);
        }
        if (strlen($contact) > 255) {
            throw new AppException('Contact is too long (max 255 characters)', 400);
        }
        if (strlen($notes) > 500) {
            throw new AppException('Notes are too long (max 500 characters)', 400);
        }

        return [
            'name'           => $name,
            'contact'        => $contact === '' ? null : $contact,   // blank becomes NULL
            'notes'          => $notes === '' ? null : $notes,
            'outlet_allowed' => filter_var($data['outlet_allowed'] ?? false, FILTER_VALIDATE_BOOLEAN),
        ];
    }

    private function present(array $s, bool $minimal): array
    {
        if ($minimal) {   // outlet handlers see only what the dropdown needs
            return ['id' => (int) $s['id'], 'name' => $s['name']];
        }

        return [
            'id'             => (int) $s['id'],
            'name'           => $s['name'],
            'contact'        => $s['contact'],
            'notes'          => $s['notes'],
            'outlet_allowed' => (bool) $s['outlet_allowed'],
            'status'         => $s['status'],
        ];
    }
}