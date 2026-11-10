<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Services\RefreshCookie;
use App\Services\AuthService;
use App\Exceptions\AppException;
use App\Helpers\Actor;

class Auth
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private RefreshCookie $cookie,
                                private AuthService $service) {}

    public function login(Request $req, Response $res): Response
    {
        $data = $req->getParsedBody() ?? [];
        $email = (string) ($data['email'] ?? '');
        $password = (string) ($data['password'] ?? '');
        $result = null;

        try {
            $result = $this->service->login(Actor::fromRequest($req), $email, $password);
        } catch (AppException $err) {
            if ($err->clearCookie()) {
                return $this->cookie->clear(
                    $this->json(['error' => $err->getMessage()], $err->getStatus())
                );
            } else {
                return $this->json(['error' => $err->getMessage()], $err->getStatus());
            }
        }

        $res = $this->json([
            'access_token' => $result['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => (int) $_ENV['JWT_TTL'],
        ]);

        return $this->cookie->set($res, $result['refresh_token']);
    }

    public function refresh(Request $req, Response $res): Response
    {
        $raw = $this->cookie->read($req);
        $result = null;

        try {
            $result = $this->service->refresh(Actor::fromRequest($req), $raw);
        } catch (AppException $err) {
            if ($err->clearCookie()) {
                return $this->cookie->clear(
                    $this->json(['error' => $err->getMessage()], $err->getStatus())
                );
            } else {
                return $this->json(['error' => $err->getMessage()], $err->getStatus());
            }   
        }

        
        $res = $this->json([
            'access_token' => $result['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => (int) $_ENV['JWT_TTL'],
        ]);

        return $this->cookie->set($res, $result['refresh_token']);
    }

    public function logout(Request $req, Response $res): Response
    {
        $raw = $this->cookie->read($req);
        $this->service->logout(Actor::fromRequest($req), $raw);

        return $this->cookie->clear($this->json(['message' => 'Logged out']));
    }
}