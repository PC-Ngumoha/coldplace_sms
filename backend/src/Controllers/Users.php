<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Exceptions\AppException;
use App\Services\PermissionPolicy;
use App\Services\UserService;
use App\Helpers\Actor;
use App\Services\RefreshCookie;

class Users
{
    use \App\Helpers\ResponseHelper;

    

    public function __construct(private UserService $service,
                                private RefreshCookie $cookie)
    {}

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
            $rows = $this->service->create(Actor::fromRequest($req), $body);
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
        $body = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->update(Actor::fromRequest($req), $userId, $body);
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
        $data = $req->getParsedBody() ?? [];

        try {
            $rows = $this->service->changeOtherPassword(Actor::fromRequest($req), $userId, $data);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }
        
        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows
        ]);
    }

    /**
     * all roles: change your password
     * 
     * Changing your own password should cause your session to be renewed
     * while locking out any other user that had your password
     */
    public function changeMyPassword(Request $req, Response $res): Response
    {
        $data = $req->getParsedBody() ?? [];

        try {
            $tokens = $this->service->changeMyPassword(Actor::fromRequest($req), $data);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        $res = $this->json([
            'access_token'      => $tokens['access_token'],
            'token_type'        => 'Bearer',
            'expires_in'        => (int) $_ENV['JWT_TTL'],
        ]);

        return $this->cookie->set($res, $tokens['refresh_token']);
    }

    public function deactivate(Request $req, Response $res, array $args): Response {
        $userId = (int) $args['id'];

        try {
            $rows = $this->service->deactivate(Actor::fromRequest($req), $userId);
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
        
        try {
            $rows = $this->service->activate(Actor::fromRequest($req), $userId);
        } catch (AppException $err) {
            return $this->json(['error' => $err->getMessage()], $err->getStatus());
        }

        return $this->json([
            'message' => 'Record updated',
            'row_count' => $rows,
        ]);
    }
}