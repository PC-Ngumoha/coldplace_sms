<?php

namespace App\Helpers;

use Slim\Psr7\Response;

trait ResponseHelper
{
    private function json(array $body, int $status = 200): Response
    {
        $res = new Response();

        $res->getBody()->write(json_encode($body));
        return $res->withStatus($status);
    }

    private function filterOutput(array $source, array $excluded): array {
        $output = [];

        if (is_array($source[0])) {  // 2D array
            foreach($source as $row) {
                $filteredRow = [];

                foreach($row as $key => $value) {
                    if (!in_array($key, $excluded)) {
                        $filteredRow[$key] = $value;
                    }
                }

                $output[] = $filteredRow; // Append the filtered row
            }
        } else { // 1D array
            foreach($source as $key => $value) {
                if (!in_array($key, $excluded)) {
                    $output[$key] = $value;
                }
            }
        }

        return $output;
    }
}