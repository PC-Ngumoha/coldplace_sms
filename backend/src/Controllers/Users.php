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

    public function __construct(private UserRepository $repo) {}

    public function list(Request $req, Response $res): Response
    {
        $users = $this->repo->showAllUsers();

        return $this->json($users);
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
            return $this->json(['error' => 'Password missing or incorrect'], 400);
        }

        // Create data
        $updatedData = [];
        foreach ($user as $key => $value) {
            // Copy every field except the hashed password.
            if ($key !== 'password_hash') {
                $updatedData[$key] = $value;
            }
        }
        $updatedData['password'] = $new;

        $rows = $this->repo->updateUser($userId, $updatedData);

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
            ]);
    }


}