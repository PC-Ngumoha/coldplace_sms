<?php

namespace App\Services;

use App\Constants\Customer;
// use App\Constants\Permissions;
use App\Constants\AuditAction;
use App\Exceptions\AmbiguousCustomer;
use App\Exceptions\AppException;
use App\Repositories\CustomerRepository;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\Decimal;
use App\Helpers\TransactionManager;

class CustomerService
{
    private const TYPES = ['individual', 'business'];

    public function __construct(
        private CustomerRepository $repo,
        private AuditLogger $audit,
        private TransactionManager $tx
    ) {}

    // ---------- Reads ----------

    public function list(Actor $actor): array
    {
        // $this->authorize($actor, Permissions::CUSTOMERS_LIST);
        return array_map(fn ($c) => $this->present($c), $this->repo->showAll());
    }

    public function retrieve(Actor $actor, int $customerId): array
    {
        // $this->authorize($actor, Permissions::CUSTOMERS_RETRIEVE);

        $customer = $this->repo->retrieve($customerId);
        if (!$customer) {
            throw new AppException('Not found', 404);
        }

        $out = $this->present($customer);
        $out['recent_sales'] = array_map(fn ($s) => [
            'id'            => (int) $s['id'],
            'reference'     => $s['reference'],
            'sale_date'     => $s['sale_date'],
            'location_name' => $s['location_name'],
            'total'         => bcadd((string) $s['total'], '0', 2),
        ], $this->repo->recentSales($customerId));

        return $out;
    }

    /** Suggestions for the sale form. Returns names and phones only. */
    public function search(Actor $actor, string $q): array
    {
        // $this->authorize($actor, Permissions::CUSTOMERS_SEARCH);

        $q = $this->normalizeName($q);
        if (mb_strlen($q) < 2) {
            return [];
        }

        return array_map(fn ($c) => [
            'id'    => (int) $c['id'],
            'name'  => $c['name'],
            'phone' => $c['phone'],
        ], $this->repo->search($q));
    }

    // ---------- Management ----------

    public function update(Actor $actor, int $customerId, array $data): int
    {
        // $this->authorize($actor, Permissions::CUSTOMERS_EDIT);

        $in = $this->validate($data);

        try {
            return $this->tx->run(function () use ($actor, $customerId, $in) {
                $old = $this->repo->retrieveForUpdate($customerId);
                if (!$old) {
                    throw new AppException('Not found', 404);
                }

                $oldValues = [
                    'name'          => $old['name'],
                    'customer_type' => $old['customer_type'],
                    'phone'         => $old['phone'],
                    'address'       => $old['address'],
                ];

                if ($oldValues === $in) {
                    return 0;   // nothing changed: no write, no audit
                }

                $this->repo->update($customerId, $in);

                $this->audit->log($actor, AuditAction::CUSTOMER_UPDATED, 'customers',
                    $customerId, $oldValues, $in);

                return 1;
            });
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new AppException('A customer with this phone number already exists', 409);
            }
            throw $e;
        }
    }

    public function deactivate(Actor $actor, int $customerId): int
    {
        // $this->authorize($actor, Permissions::CUSTOMERS_DEACTIVATE);
        return $this->changeStatus($actor, $customerId, Customer::ACTIVE, Customer::INACTIVE,
            AuditAction::CUSTOMER_DEACTIVATED);
    }

    public function activate(Actor $actor, int $customerId): int
    {
        // $this->authorize($actor, Permissions::CUSTOMERS_ACTIVATE);
        return $this->changeStatus($actor, $customerId, Customer::INACTIVE, Customer::ACTIVE,
            AuditAction::CUSTOMER_ACTIVATED);
    }

    private function changeStatus(Actor $actor, int $id, string $from, string $to, string $action): int
    {
        return $this->tx->run(function () use ($actor, $id, $from, $to, $action) {
            $customer = $this->repo->retrieveForUpdate($id);
            if (!$customer) {
                throw new AppException('Not found', 404);
            }
            if ($customer['status'] !== $from) {
                return 0;
            }

            $rows = $this->repo->setStatus($id, $to, $from);
            if ($rows === 1) {
                $this->audit->log($actor, $action, 'customers', $id, ['status' => $from], ['status' => $to]);
            }
            return $rows;
        });
    }

    // ---------- Used by SaleService only (no route) ----------

    /**
     * Finds or creates the customer for a sale. Call it inside the sale's transaction,
     * so a failed sale never leaves a new customer behind.
     * Returns ['id', 'name', 'outcome' => selected | matched | created].
     */
    public function resolveForSale(Actor $actor, array $input): array
    {
        // 1. Picked from the suggestions
        $id = (int) ($input['id'] ?? 0);
        if ($id > 0) {
            $c = $this->repo->retrieveForUpdate($id);
            if (!$c) {
                throw new AppException('Selected customer does not exist', 400);
            }
            $this->assertActive($c);
            return $this->outcome($c, 'selected');
        }

        // 2. Otherwise a name is always required. A phone number can never replace it.
        $name = $this->normalizeName((string) ($input['name'] ?? ''));
        if ($name === '') {
            throw new AppException('Customer name is required', 400);
        }
        if (mb_strlen($name) > 150) {
            throw new AppException('Customer name is too long (max 150 characters)', 400);
        }

        $phone   = self::normalizePhone($input['phone'] ?? null);
        $address = $this->optionalText($input['address'] ?? null, 255, 'Address');
        $forceNew = filter_var($input['force_new'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // 3. Same phone means the same person
        if ($phone !== null) {
            $byPhone = $this->repo->findByPhone($phone);
            if ($byPhone) {
                $this->assertActive($byPhone);
                return $this->outcome($byPhone, 'matched');
            }
        }

        // 4. Same name. The user may override with force_new.
        if (!$forceNew) {
            $same = $this->repo->findByName($name);

            // A different phone on file means a different person
            if ($phone !== null) {
                $same = array_values(array_filter($same, fn ($c) => $c['phone'] === null));
            }

            if (count($same) === 1) {
                $this->assertActive($same[0]);
                return $this->outcome($same[0], 'matched');
            }
            if (count($same) > 1) {
                throw new AmbiguousCustomer(array_map(fn ($c) => [
                    'id'      => (int) $c['id'],
                    'name'    => $c['name'],
                    'phone'   => $c['phone'],
                    'address' => $c['address'],
                    'status'  => $c['status'],
                ], $same));
            }
        }

        // 5. No match: create a new individual customer
        try {
            $newId = $this->repo->add([
                'name'          => $name,
                'customer_type' => 'individual',
                'phone'         => $phone,
                'address'       => $address,
                'created_by'    => $actor->userId,
            ]);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {   // someone registered this phone a moment ago
                throw new AppException('This phone number was just registered. Please try again.', 409);
            }
            throw $e;
        }

        $this->audit->log($actor, AuditAction::CUSTOMER_CREATED, 'customers', $newId, null, [
            'name' => $name, 'phone' => $phone, 'address' => $address, 'created_via' => 'sale',
        ]);

        return ['id' => $newId, 'name' => $name, 'outcome' => 'created'];
    }

    // ---------- Helpers ----------

    // private function authorize(Actor $actor, string $permission): void
    // {
    //     if ($actor->role === null || !Permissions::can($actor->role, $permission)) {
    //         throw new AppException('Forbidden', 403);
    //     }
    // }

    private function assertActive(array $c): void
    {
        if ($c['status'] !== Customer::ACTIVE) {
            throw new AppException(
                "Customer \"{$c['name']}\" is deactivated. Ask an Admin or Manager to reactivate them.", 409);
        }
    }

    private function outcome(array $c, string $how): array
    {
        return ['id' => (int) $c['id'], 'name' => $c['name'], 'outcome' => $how];
    }

    private function validate(array $data): array
    {
        $name = $this->normalizeName((string) ($data['name'] ?? ''));
        if ($name === '' || mb_strlen($name) > 150) {
            throw new AppException('Name is required (max 150 characters)', 400);
        }

        $type = (string) ($data['customer_type'] ?? '');
        if (!in_array($type, self::TYPES, true)) {
            throw new AppException('Customer type must be individual or business', 400);
        }

        return [
            'name'          => $name,
            'customer_type' => $type,
            'phone'         => self::normalizePhone($data['phone'] ?? null),
            'address'       => $this->optionalText($data['address'] ?? null, 255, 'Address'),
        ];
    }

    /** Trim and collapse runs of spaces, so "Ada  Okafor " equals "Ada Okafor". */
    private function normalizeName(string $raw): string
    {
        return trim(preg_replace('/\s+/u', ' ', $raw) ?? '');
    }

    private function optionalText(mixed $v, int $max, string $label): ?string
    {
        $t = trim((string) ($v ?? ''));
        if ($t === '') {
            return null;
        }
        if (mb_strlen($t) > $max) {
            throw new AppException("$label is too long (max $max characters)", 400);
        }
        return $t;
    }

    /** Blank becomes null. Local 0803... becomes +234803..., so one number has one form. */
    public static function normalizePhone(mixed $raw): ?string
    {
        $p = preg_replace('/[\s\-().]/', '', (string) ($raw ?? '')) ?? '';
        if ($p === '') {
            return null;
        }

        if (str_starts_with($p, '+')) {
            // already international
        } elseif (str_starts_with($p, '234')) {
            $p = '+' . $p;
        } elseif (str_starts_with($p, '0')) {
            $p = '+234' . substr($p, 1);
        }

        if (!preg_match('/^\+\d{8,15}$/', $p)) {
            throw new AppException('Phone number is not valid', 400);
        }
        return $p;
    }

    private function present(array $c): array
    {
        $count = (int) $c['sales_count'];
        $total = bcadd((string) $c['total_spent'], '0', 2);

        return [
            'id'                 => (int) $c['id'],
            'name'               => $c['name'],
            'customer_type'      => $c['customer_type'],
            'phone'              => $c['phone'],
            'address'            => $c['address'],
            'status'             => $c['status'],
            'created_at'         => $c['created_at'],
            'sales_count'        => $count,
            'total_spent'        => $total,
            'average_sale'       => $count > 0 ? Decimal::round(bcdiv($total, (string) $count, 6), 2) : null,
            'last_purchase_date' => $c['last_purchase_date'],
        ];
    }
}