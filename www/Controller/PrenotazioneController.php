<?php

namespace parkingo\Controller;

use parkingo\Repository\PrenotazioneRepository;

class PrenotazioneController {

    private $repository;

    public function __construct()
    {
        this->repository = new PrenotazioneRepository();
    }


    public function findByCodice(Request $request, Response $response, array $args): Response
    {
        $codice = $args['codice'];
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

}