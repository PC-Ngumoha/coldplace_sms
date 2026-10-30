<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Constants\Roles;
use App\Helpers\ResponseHelper;
use App\Repositories\UserRepository;


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

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody();

        if (!$body['name'] || !$body['email'] || !$body['password'] || !$body['role']) {
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

        $result = $this->repo->addUser($body);
        return $this->json($result, 201);
    }

    public function me(Request $req, Response $res): Response
    {
        $userId = $req->getAttribute('jwt')['sub']; // get user id from JWT

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $payload = $this->filterOutput(source: $user, excluded: ['password_hash', 'location_id']);

        return $this->json($payload);
    }

    /**
     * TODO: New password should have some criteria for validation.
     */
    public function changePassword(Request $req, Response $res, array $args): Response
    {
        $userId = (int) $args['id'];
        $data = $req->getParsedBody();
        $old = (string) $data['old_password'] ?? '';
        $new = (string) $data['new_password'] ?? '';

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        if (!$old || !password_verify($old, $user['password_hash'])) {
            return $this->json(['error' => 'Password missing or incorrect'], 401);
        }

        if ($new === '') {
            return $this->json(['error' => 'New password required', 400]);
        }

        $rows = $this->repo->updatePassword($userId, $new);

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
            ]);
    }

    public function deactivate(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];
        $owner = (int) $req->getAttribute('jwt')['sub'];
        $rows = 0;


        // You can't deactivate the Root Admin or your own account
        if ($userId === self::ROOT_ADMIN || $userId === $owner) {
            return $this->json(['error' => 'This operation is forbidden.'],
            403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
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
        $owner = (int) $req->getAttribute('jwt')['sub'];
        $rows = 0;

        // You can't activate the Root Admin or your own account
        if ($userId === self::ROOT_ADMIN || $userId === $owner) {
            return $this->json(['error' => 'This operation is forbidden.'],
            403);
        }

        $user = $this->repo->retrieveUser($userId);

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
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