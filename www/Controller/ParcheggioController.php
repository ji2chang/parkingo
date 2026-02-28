<?php

namespace parkingo\Controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use parkingo\Repository\ParcheggioRepository;

class ParcheggioController {

    private $repository;

    public function __construct()
    {
        $this->repository = new ParcheggioRepository();
    }

    // GET /api/parkings
    public function findAll(Request $request, Response $response, array $args): Response
    {
        $params = $request->getQueryParams();
        $parcheggi = $this->repository->ottieniTuttiParcheggi($params);

        $payload = json_encode([
            'success' => true,
            'data'    => array_map(fn($p) => $p->toArray(), $parcheggi)
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /api/parkings/{id}
    public function findById(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $parcheggio = $this->repository->ottieniParcheggioById($id);

        if (empty($parcheggio)) {
            $payload = json_encode([
                'success' => false,
                'message' => 'Parcheggio non trovato'
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
        }

        $payload = json_encode([
            'success' => true,
            'data'    => $parcheggio->toArray()
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /api/parkings/{id}/availability
    public function getAvailability(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $params = $request->getQueryParams();

        $disponibilita = $this->repository->getAvailability($id, $params);

        if ($disponibilita === null) {
            $payload = json_encode([
                'success' => false,
                'message' => 'Parcheggio non trovato'
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
        }

        $payload = json_encode([
            'success' => true,
            'data'    => $disponibilita->toArray()
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }
}