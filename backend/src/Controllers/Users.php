<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Constants\Roles;
use App\Repositories\UserRepository;
use App\Services\PermissionPolicy;

class Users
{
    use \App\Helpers\ResponseHelper;

    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';
    public const ROOT_ADMIN = 1;

    public function __construct(private UserRepository $repo) {}

    public function list(Request $req, Response $res): Response
    {
        $users = $this->repo->showAllUsers();

        $payload = $this->filterOutput(source: $users, excluded: ['password_hash', 'location_id']);

        return $this->json($payload);
    }

    public function retrieve(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $payload = $this->filterOutput(source: $user, excluded: ['password_hash']);
        return $this->json($payload);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];

        if (empty($body) || !$body['name'] || !$body['email'] || !$body['password'] || !$body['role']) {
            return $this->json(['error' => 'Missing parameter'], 400);
        }

        // Verify user's assigned role.
        if (!in_array($body['role'], Roles::ALL, true)) {
            return $this->json(['error' => 'Unsupported role'], 400);
        }

        // Verify email address contains @coldplace in it's name
        $emailPattern = "/^[a-zA-Z0-9._%+-]+@coldplace\.[a-zA-Z0-9.-]+$/";
        if (!preg_match($emailPattern, $body['email'])) {
            return $this->json(['error' => 'Unsupported email pattern'], 400);
        }

        $rows = $this->repo->addUser($body);
        return $this->json([
            'message' => 'Record created',
            'row_count' => $rows,
        ], 201);
    }

    public function me(Request $req, Response $res): Response
    {
        $userId = (int) $req->getAttribute('jwt')['sub']; // get user id from JWT

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $payload = $this->filterOutput(source: $user, excluded: ['password_hash']);

        $payload['permissions'] = PermissionPolicy::permissionsFor($user['role']);

        return $this->json($payload);
    }

    public function update(Request $req, Response $res, array $args): Response
    {
        $userId = (int) $args['id'];
        $currentUserId = (int) $req->getAttribute('jwt')['sub'];
        $body = $req->getParsedBody() ?? [];

        // Only root admin can edit root admin
        if ($userId === self::ROOT_ADMIN && $currentUserId !== self::ROOT_ADMIN) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        // You can't edit other admin unless you're root admin
        if ($currentUserId !== self::ROOT_ADMIN && $user['role'] === Roles::ADMIN) {
            return $this->json(['error' => 'Forbidden'], 403);
        }


        if (empty($body) || !$body['name'] || !$body['email'] || !$body['role']) {
            return $this->json(['error' => 'Missing parameter'], 400);
        }

        // Verify email address contains @coldplace in it's name
        $emailPattern = "/^[a-zA-Z0-9._%+-]+@coldplace\.[a-zA-Z0-9.-]+$/";
        if (!preg_match($emailPattern, $body['email'])) {
            return $this->json(['error' => 'Unsupported email pattern'], 400);
        }

        $rows = $this->repo->updateUser($userId, $body);

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }

    /**
     * admin: change a given user's password
     */
    public function changePassword(Request $req, Response $res, array $args): Response
    {
        $userId = (int) $args['id'];
        $currentUserId = (int) $req->getAttribute('jwt')['sub'];
        $data = $req->getParsedBody() ?? [];

        if (empty($data)) {
            return $this->json(['error' => 'Missing parameter'], 400);
        }

        // Can't change root admin or your own password
        if ($userId === self::ROOT_ADMIN || $userId === $currentUserId) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $new = (string) $data['password'] ?? '';

        if ($new === '') {
            return $this->json(['error' => 'New password required', 400]);
        }

        $rows = $this->repo->updatePassword($userId, $new, true);

        return $rows > 0 
            ? $this->json([
                'message' => 'Record updated',
                'row_count' => $rows
                ])
            : $this->json(['error' => 'Not found'], 404);
    }

    /**
     * all roles: change your password
     */
    public function changeMyPassword(Request $req, Response $res): Response
    {
        $userId = (int) $req->getAttribute('jwt')['sub'];
        $data = $req->getParsedBody() ?? [];

        if (empty($data)) {
            return $this->json(['error' => 'Missing parameter'], 400);
        }

        $old = (string) $data['old_password'] ?? '';
        $new = (string) $data['new_password'] ?? '';

        if ($new === '') {
            return $this->json(['error' => 'New password required', 400]);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!password_verify($old, $user['password_hash'])) {
            return $this->json(['error' => 'Incorrect password'], 401);
        }

        $rows = $this->repo->updatePassword($userId, $new);

        return $rows > 0 
            ? $this->json([
                'message' => 'Record updated',
                'row_count' => $rows
                ])
            : $this->json(['error' => 'Not found'], 404);
    }

    public function deactivate(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];
        $currentUserId = (int) $req->getAttribute('jwt')['sub'];
        $rows = 0;


        // You can't deactivate the Root Admin or your own account
        if ($userId === self::ROOT_ADMIN || $userId === $currentUserId) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        // You can't deactivate another admin user unless you're the root admin
        if ($currentUserId !== self::ROOT_ADMIN && $user['role'] === Roles::ADMIN) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        if ($user['status'] === self::ACTIVE) {
            $rows = $this->repo->setStatus($userId, self::INACTIVE);
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];
        $currentUserId = (int) $req->getAttribute('jwt')['sub'];
        $rows = 0;

        // You can't activate the Root Admin or your own accountThis operation is forbidden.
        if ($userId === self::ROOT_ADMIN || $userId === $currentUserId) {
            return $this->json(['error' => 'Forbidden'],
            403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        // You can't activate another admin user unless you're the root admin
        if ($currentUserId !== self::ROOT_ADMIN && $user['role'] === Roles::ADMIN) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        if ($user['status'] === self::INACTIVE) {
            $rows = $this->repo->setStatus($userId, self::ACTIVE);
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }
}