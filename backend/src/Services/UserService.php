<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\UserRepository;
use App\Constants\Roles;
use App\Constants\User;
use App\Constants\Location;
use App\Constants\AuditAction;
use App\Helpers\Actor;
use App\Helpers\AuditLogger;
use App\Helpers\TransactionManager;
use App\Repositories\LocationRepository;

class UserService
{
    private string $emailPattern;

    public function __construct(private LocationRepository $locations,
                                private UserRepository $repo,
                                private AuditLogger $audit,
                                private TransactionManager $tx,
                                private TokenService $tokens) 
    {
        $domainName = (string) ($_ENV['ORG_NAME'] ?? 'coldplace');
        $this->emailPattern = "/^[a-zA-Z0-9._%+-]+@{$domainName}\.[a-zA-Z0-9.-]+$/";
    }

    public function list(): array
    {
        return $this->repo->showAllUsers();
    }

    public function retrieve(int $userId): array
    {
        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            throw new AppException('Not found', 404);
        }

        return $user;
    }

    public function create(Actor $actor, array $data): int
    {
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $role = trim((string) ($data['role'] ?? ''));
        $password = (string) ($data['password'] ?? '');
        $locationId = isset($data['location_id']) ? (int) $data['location_id'] : null;

        if ($name === '' || $email === '' || $role === '' || $password === '') {
            throw new AppException('Missing parameter', 400);
        }

        // Verify user's assigned role.
        if (!in_array($role, Roles::ALL, true)) {
            throw new AppException('Unsupported role', 400);
        }

        // Verify email address contains the domain name in it's name
        if (!preg_match($this->emailPattern, $email)) {
            throw new AppException('Unsupported email pattern', 400);
        }

        $locationId = $this->resolveLocationForRole($role, $locationId);

        try {
            return $this->tx->run(function () use ($actor, $name, $email, $password, $role, $locationId) {
                
                $id = $this->repo->addUser([
                    'name'          => $name,
                    'email'         => $email,
                    'password'      => $password,
                    'role'          => $role,
                    'location_id'   => $locationId
                ]);

                $this->audit->log(
                    $actor,
                    AuditAction::USER_CREATED,
                    'users',
                    $id,
                    null,
                    ['name' => $name, 'email' => $email, 'role' => $role, 'location_id' => $locationId ]
                );

                return $id;
            });
        } catch (\PDOException $err) {
            if ($err->getCode() === '23000') {
                throw new AppException('A user with this email already exists', 409);
            }

            throw $err;
        }
    }

    public function update(Actor $actor, int $userId, array $data): int
    {
        $isRoot = $actor->userId === User::ROOT_ADMIN;
        // Only root admin can edit root admin
        if ($userId === User::ROOT_ADMIN && !$isRoot) {
            throw new AppException('Forbidden', 403);
        }

        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $role = trim((string) ($data['role'] ?? ''));
        $locationId = isset($data['location_id']) ? (int) $data['location_id'] : null;

        if ($name === '' || $email === '' || $role === '') {
            throw new AppException('Missing parameter', 400);
        }

        // Verify user's assigned role.
        if (!in_array($role, Roles::ALL, true)) {
            throw new AppException('Unsupported role', 400);
        }

        // Verify email address contains @coldplace in it's name
        if (!preg_match($this->emailPattern, $email)) {
            throw new AppException('Unsupported email pattern', 400);
        }

        $locationId = $this->resolveLocationForRole($role, $locationId);

        try {
            return $this->tx->run(function () use ($actor, $userId,
                $name, $email, $role, $locationId, $isRoot) 
            {
                $old = $this->repo->retrieveUserForUpdate($userId);

                if (!$old) {
                    throw new AppException('Not found', 404);
                }

                // You can't edit other admin unless you're root admin
                if (!$isRoot && $old['role'] === Roles::ADMIN) {
                    throw new AppException('Forbidden', 403);
                }

                $oldLoc = $old['location_id'] !== null ? (int) $old['location_id'] : null;

                if ($old['name'] === $name && $old['email'] === $email
                    && $old['role'] === $role && $oldLoc === $locationId)
                {
                    return 0;
                }


                $rows = $this->repo->updateUser($userId, [
                    'name' => $name,
                    'email' => $email,
                    'role' => $role,
                    'location_id' => $locationId
                ]);

                if ($rows === 1) {
                    // Changing user role or email should force re-login.
                    if ($old['role'] !== $role || $old['email'] !== $email) {
                        $this->tokens->revokeAllForUser($userId);
                    }

                    $this->audit->log(
                        $actor, AuditAction::USER_UPDATED, 'users', $userId,
                        ['name' => $old['name'], 'email' => $old['email'], 'role' => $old['role'],
                        'location_id' => $oldLoc],
                        ['name' => $name, 'email' => $email, 'role' => $role,
                        'location_id' => $locationId]
                    );
                }

                return $rows;
            });
        } catch (\PDOException $err) {
            if ($err->getCode() === '23000') {
                throw new AppException('A user with this email already exists', 409);
            }
            throw $err;
        }
    }

    public function changeOtherPassword(Actor $actor, int $targetUserId, array $data): int
    {
        $new = (string) ($data['password'] ?? '');

        if ($new === '') {
            throw new AppException('Missing parameter', 400);
        }

        // Can't change root admin or your own password like this.
        if ($targetUserId === User::ROOT_ADMIN || $targetUserId === $actor->userId) {
            throw new AppException('Forbidden', 403);
        }

        $isRoot = $actor->userId === User::ROOT_ADMIN;

        return $this->tx->run(function () use ($actor, $new, $targetUserId, $isRoot) {
            $target = $this->repo->retrieveUserForUpdate($targetUserId);

            if (!$target) {
                throw new AppException('Not found', 404);
            }

            if (!$isRoot && $target['role'] === Roles::ADMIN) {
                throw new AppException('Forbidden', 403);
            }

            $rows = $this->repo->updatePassword($targetUserId, $new, true);

            if ($rows === 1) {
                // Force target user to log in again.
                $this->tokens->revokeAllForUser($targetUserId);

                $this->audit->log(
                    $actor,
                    AuditAction::USER_PASSWORD_RESET,
                    'users',
                    $targetUserId,
                );
            }

            return $rows;
        });

    }

    public function changeMyPassword(Actor $actor, array $data): array
    {
        if ($actor->userId === null) {
            throw new AppException('Unauthorized', 401);
        }

        $old = (string) ($data['old_password'] ?? '');
        $new = (string) ($data['new_password'] ?? '');

        if ($old === '' || $new === '') {
            throw new AppException('Missing parameter', 400);
        }

        if ($new === $old) {
            throw new AppException('New password must differ from current one', 400);
        }

        $me = $this->repo->retrieveUser($actor->userId);

        if (!$me || !password_verify($old, $me['password_hash'])) {
            $this->safeLog($actor, AuditAction::USER_PASSWORD_CHANGE_FAILED,
                            $actor->userId, null, 'wrong_old_password');
            throw new AppException('Incorrect password', 401);
        }

        return $this->tx->run(function () use ($actor, $new) {

            $rows = $this->repo->updatePassword($actor->userId, $new);

            if ($rows !== 1) {
                throw new AppException('Unable to change password', 409);
            }

            $this->tokens->revokeAllForUser($actor->userId);
            $user = $this->repo->retrieveUser($actor->userId); // reload user
            $tokens = $this->tokens->issueFor($user);

            $this->audit->log(
                $actor,
                AuditAction::USER_PASSWORD_CHANGED,
                'users',
                $actor->userId,
                null,
                ['must_change_password' => false]
            );

            return $tokens;
        });
    }

    public function deactivate(Actor $actor, int $targetUserId): int
    {   
        // You can't deactivate the Root Admin or your own account
        if ($targetUserId === User::ROOT_ADMIN || $targetUserId === $actor->userId) {
            throw new AppException('Forbidden', 403);
        }

        $isRoot = $actor->userId === User::ROOT_ADMIN;

        return $this->tx->run(function () use ($actor, $targetUserId, $isRoot) {
            $targetUser = $this->repo->retrieveUserForUpdate($targetUserId);

            if (!$targetUser) {
                throw new AppException('Not found', 404);
            }

            // You can't deactivate another admin user unless you're the root admin
            if (!$isRoot && $targetUser['role'] === Roles::ADMIN) {
                throw new AppException('Forbidden', 403);
            }

            if ($targetUser['status'] !== User::ACTIVE) {
                return 0;
            }

            $rows = $this->repo->setStatus($targetUserId, User::INACTIVE, User::ACTIVE);

            if ($rows === 1) {
                // Deactivating a user should force them to re-login
                $this->tokens->revokeAllForUser($targetUserId);

                $this->audit->log(
                    $actor,
                    AuditAction::USER_DEACTIVATED,
                    'users',
                    $targetUserId,
                    [ 'status' => User::ACTIVE ],
                    [ 'status' => User::INACTIVE ]
                );
            }

            return $rows;
        });
    }

    public function activate(Actor $actor, int $targetUserId): int
    {   
        // You can't deactivate the Root Admin or your own account
        if ($targetUserId === User::ROOT_ADMIN || $targetUserId === $actor->userId) {
            throw new AppException('Forbidden', 403);
        }

        $isRoot = $actor->userId === User::ROOT_ADMIN;

        return $this->tx->run(function () use ($actor, $targetUserId, $isRoot) {
            $targetUser = $this->repo->retrieveUserForUpdate($targetUserId);

            if (!$targetUser) {
                throw new AppException('Not found', 404);
            }

            // You can't deactivate another admin user unless you're the root admin
            if (!$isRoot && $targetUser['role'] === Roles::ADMIN) {
                throw new AppException('Forbidden', 403);
            }

            if ($targetUser['status'] !== User::INACTIVE) {
                return 0;
            }

            $rows = $this->repo->setStatus($targetUserId, User::ACTIVE, User::INACTIVE);

            if ($rows === 1) {
                $this->audit->log(
                    $actor,
                    AuditAction::USER_ACTIVATED,
                    'users',
                    $targetUserId,
                    [ 'status' => User::INACTIVE ],
                    [ 'status' => User::ACTIVE ]
                );
            }

            return $rows;
        });
    }

    /**
     * Utility Function: Useful for ensuring locations are assigned to the users that need them
     */
    private function resolveLocationForRole(string $role, ?int $locationId): ?int
    {
        $isHandler = in_array($role, [Roles::CENTRAL, Roles::OUTLET, Roles::MANAGER], true);

        // Non-handlers never carry a location: ignore anything sent
        if (!$isHandler) {
            return null;
        }

        // Handlers must have one (and 0 is not a valid id)
        if ($locationId === null || $locationId <= 0) {
            throw new AppException('Handlers and managers must be assigned to a location', 400);
        }

        $location = $this->locations->retrieveLocation($locationId);

        if (!$location) {
            throw new AppException('Assigned location does not exist', 400);
        }

        if ($location['status'] !== Location::ACTIVE) {
            throw new AppException('Assigned location is inactive', 400);
        }

        // Role must match location type
        if ($role === Roles::CENTRAL && !$location['is_central']) {
            throw new AppException('Central handlers must be assigned to the central location', 400);
        }

        return (int) $location['id'];
    }

    private function safeLog(Actor $actor, string $action, ?int $entityId,
                            ?array $new = null, ?string $reason = null) 
    {
        try {
            $this->audit->log($actor, $action, 'users', $entityId, null, $new, $reason);
        } catch (\Throwable $err) {
            error_log('Audit failed: ' . $err->getMessage());
        }
    }
}