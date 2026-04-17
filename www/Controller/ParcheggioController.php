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
        try {
            $params = $request->getQueryParams();
            # print_r($params);
            
            $parcheggi = $this->repository->ottieniTuttiParcheggi($params);

            $payload = json_encode([
                'success' => true,
                'data'    => $parcheggi
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(200)
                ->withHeader('Content-Type', 'application/json');
        } catch (\InvalidArgumentException $e) {
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(400)
                ->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(500)
                ->withHeader('Content-Type', 'application/json');
        }
    }

    // GET /api/parkings/{id}
    public function findById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $parcheggio = $this->repository->ottieniParcheggioById($id);

            if ($parcheggio === null) {
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
                'data'    => $parcheggio
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(200)
                ->withHeader('Content-Type', 'application/json');
        } catch (\InvalidArgumentException $e) {
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(400)
                ->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $payload = json_encode([
                'success' => false,
                'message' => 'Errore interno del server'
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(500)
                ->withHeader('Content-Type', 'application/json');
        }
    }

    // GET /api/parkings/{id}/availability
    public function getAvailability(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $params = $request->getQueryParams();

        try {
            // Chiamata al repository
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
                'data'    => $disponibilita
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(200)
                ->withHeader('Content-Type', 'application/json');

        } catch (\InvalidArgumentException $e) {
            // Gestione parametri mancanti o non validi
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(400)
                ->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            // Gestione errori generici
            $payload = json_encode([
                'success' => false,
                'message' => 'Errore interno del server'
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(500)
                ->withHeader('Content-Type', 'application/json');
        }
    }
    // GET /api/parkings/cities
    public function getCitta(Request $request, Response $response, array $args): Response
    {
        try {
            $citta = $this->repository->ottieniTutteLeCitta();

            $payload = json_encode([
                'success' => true,
                'data'    => $citta
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(200)
                ->withHeader('Content-Type', 'application/json');
        } catch (\InvalidArgumentException $e) {
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(400)
                ->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $payload = json_encode([
                'success' => false,
                'message' => 'Errore interno del server'
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(500)
                ->withHeader('Content-Type', 'application/json');
        }
    }
}