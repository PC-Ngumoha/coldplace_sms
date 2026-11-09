<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Repositories\UserRepository;
use App\Constants\Roles;
use App\Constants\User;

class UserService
{
    private string $emailPattern;

    public function __construct(private UserRepository $repo) {
        $domainName = (string) ($_ENV['DOMAIN_NAME'] ?? 'coldplace');
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

    public function create(array $data): int
    {
        if (empty($data) || empty($data['name']) || empty($data['email'])
                || empty($data['password']) || empty($data['role'])) {
            throw new AppException('Missing parameter', 400);
        }

        // Verify user's assigned role.
        if (!in_array($data['role'], Roles::ALL, true)) {
            throw new AppException('Unsupported role', 400);
        }

        // Verify email address contains the domain name in it's name
        if (!preg_match($this->emailPattern, $data['email'])) {
            throw new AppException('Unsupported email pattern', 400);
        }

        return $this->repo->addUser($data);
    }

    public function update(int $userId, int $currentUserId, array $data): int
    {
        // Only root admin can edit root admin
        if ($userId === User::ROOT_ADMIN && $currentUserId !== User::ROOT_ADMIN) {
            throw new AppException('Forbidden', 403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            throw new AppException('Not found', 401);
        }

        // You can't edit other admin unless you're root admin
        if ($currentUserId !== User::ROOT_ADMIN && $user['role'] === Roles::ADMIN) {
            throw new AppException('Forbidden', 403);
        }


        if (empty($data) || empty($data['name']) || empty($data['email']) || empty($data['role'])) {
            throw new AppException('Missing parameter', 400);
        }

        // Verify email address contains @coldplace in it's name
        if (!preg_match($this->emailPattern, $data['email'])) {
            throw new AppException('Unsupported email pattern', 400);
        }

        return $this->repo->updateUser($userId, $data);
    }

    public function changeOtherPassword(int $userId, int $currentUserId, array $data): int
    {
        if (empty($data) || empty($data['password'])) {
            throw new AppException('Missing parameter', 400);
        }

        // Can't change root admin or your own password like this.
        if ($userId === User::ROOT_ADMIN || $userId === $currentUserId) {
            throw new AppException('Forbidden', 403);
        }

        $new = (string) ($data['password'] ?? '');

        if ($new === '') {
            throw new AppException('New password required', 400);
        }

        return $this->repo->updatePassword($userId, $new, true);

    }

    public function changeMyPassword(int $currentUserId, array $data): int 
    {
        if (empty($data) || empty($data['old_password']) || empty($data['new_password'])) {
            // return $this->json(['error' => 'Missing parameter'], 400);
            throw new AppException('Missing parameter', 400);
        }

        $old = (string) $data['old_password'] ?? '';
        $new = (string) $data['new_password'] ?? '';

        if ($new === '') {
            // return $this->json(['error' => 'New password required', 400]);
            throw new AppException('New password required', 400);
        }

        $user = $this->repo->retrieveUser($currentUserId);

        if (!password_verify($old, $user['password_hash'])) {
            // return $this->json(['error' => 'Incorrect password'], 401);
            throw new AppException('Incorrect password', 401);
        }

        return $this->repo->updatePassword($currentUserId, $new);
    }

    public function deactivate(int $userId, int $currentUserId): int
    {   
        $rows = 0;

        // You can't deactivate the Root Admin or your own account
        if ($userId === User::ROOT_ADMIN || $userId === $currentUserId) {
            throw new AppException('Forbidden', 403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            throw new AppException('Not found', 404);
        }

        // You can't deactivate another admin user unless you're the root admin
        if ($currentUserId !== User::ROOT_ADMIN && $user['role'] === Roles::ADMIN) {
            throw new AppException('Forbidden', 403);
        }

        if ($user['status'] === User::ACTIVE) {
            $rows = $this->repo->setStatus($userId, User::INACTIVE);
        }

        return $rows;
    }

    public function activate(int $userId, int $currentUserId): int
    {   
        $rows = 0;

        // You can't deactivate the Root Admin or your own account
        if ($userId === User::ROOT_ADMIN || $userId === $currentUserId) {
            throw new AppException('Forbidden', 403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            throw new AppException('Not found', 404);
        }

        // You can't deactivate another admin user unless you're the root admin
        if ($currentUserId !== User::ROOT_ADMIN && $user['role'] === Roles::ADMIN) {
            throw new AppException('Forbidden', 403);
        }

        if ($user['status'] === User::INACTIVE) {
            $rows = $this->repo->setStatus($userId, User::ACTIVE);
        }

        return $rows;
    }
}