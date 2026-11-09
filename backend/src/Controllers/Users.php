<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Constants\Roles;
use App\Constants\User;
use App\Exceptions\AppException;
use App\Repositories\UserRepository;
use App\Services\PermissionPolicy;
use App\Services\UserService;

class Users
{
    use \App\Helpers\ResponseHelper;

    

    public function __construct(private UserRepository $repo, private UserService $service) {}

    public function list(Request $req, Response $res): Response
    {
        $users = $this->service->list();

        $payload = $this->filterOutput(source: $users, excluded: ['password_hash']);

        return $this->json($payload);
    }

    public function retrieve(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];

        try {
            $user = $this->service->retrieve($userId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        unset($user['password_hash']);

        return $this->json($user);
    }

    public function create(Request $req, Response $res): Response
    {
        $body = $req->getParsedBody() ?? [];
        
        try {
            $rows = $this->service->create($body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record created',
            'row_count' => $rows,
        ], 201);
    }

    public function me(Request $req, Response $res): Response
    {
        $user = $req->getAttribute('user') ?? [];

        if (empty($user)) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $user['permissions'] = PermissionPolicy::permissionsFor($user['role']);

        return $this->json($user);
    }

    public function update(Request $req, Response $res, array $args): Response
    {
        $userId = (int) $args['id'];
        $currentUserId = (int) $req->getAttribute('jwt')['sub'];
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->update($userId, $currentUserId, $body);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

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

        try {
            $rows = $this->service->changeOtherPassword($userId, $currentUserId, $data);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }
        
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

        try {
            $rows = $this->service->changeMyPassword($userId, $data);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

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

        try {
            $rows = $this->service->deactivate($userId, $currentUserId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }

    public function activate(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];
        $currentUserId = (int) $req->getAttribute('jwt')['sub'];
        
        try {
            $rows = $this->service->activate($userId, $currentUserId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }
}