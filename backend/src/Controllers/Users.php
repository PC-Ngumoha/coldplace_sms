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
}