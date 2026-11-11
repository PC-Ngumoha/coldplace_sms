<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use App\Repositories\LogsRepository;

class Logs
{
    use \App\Helpers\ResponseHelper;

    public function __construct(private LogsRepository $repo)
    {}

    public function list(Request $req, Response $res): Response
    {
        $logs =  $this->repo->list();

        return $this->json($logs);
    }
}