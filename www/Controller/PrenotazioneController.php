<?php

namespace parkingo\Controller;
use Exception;
use parkingo\Entity\Parcheggio;
use parkingo\Entity\Prenotazione;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use parkingo\Repository\PrenotazioneRepository;

class PrenotazioneController
{

    private PrenotazioneRepository $repository;

    public function __construct()
    {
        $this->repository = new PrenotazioneRepository();
    }


    public function findByCodice(Request $request, Response $response, array $args): Response
    {
        $codice = $args['code'];
        $prenotazione = $this->repository->getByCodice($codice);

        if (empty($prenotazione)) {
            $payload = json_encode([
                'success' => false,
                'message' => 'Prenotazione non trovata'
            ]);

            $response->getBody()->write($payload);
            return $response
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
        }

        $payload = json_encode([
            'success' => true,
            'data' => $prenotazione
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    public function createPrenotazione(Request $request, Response $response, array $args): Response
    {
        $data = $request->getParsedBody();
        $prenotazione = new Prenotazione($data);
        try {
            $result = $this->repository->create($prenotazione);
            $payload = json_encode([
                'success' => true,
                'data' => $result->toArray()
            ]);
            $response = $response->withStatus(200);
        } catch (Exception $e) {
            $response = $response->withStatus(500);
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        $response->getBody()->write($payload);
        $response->withHeader('Content-Type', 'application/json');
        return $response;
    }

}