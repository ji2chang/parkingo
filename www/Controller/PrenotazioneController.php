<?php

namespace parkingo\Controller;

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

           
            $r = $result->toResponse();

            $parRepo = new \parkingo\Repository\ParcheggioRepository();
            $par = $parRepo->ottieniParcheggioById((int)$r['parcheggio_id']);

            $payloadData = [

                'codice' => $r['codice_prenotazione'] ?? $r['codice_prenotazione'] ?? null,
                'codice_prenotazione' => $r['codice_prenotazione'] ?? null,

                'nome' => $r['nome'] ?? null,
                'cognome' => $r['cognome'] ?? null,
                'targa' => $r['targa'] ?? null,
                'email' => $r['email'] ?? null,
                'telefono' => $r['telefono'] ?? null,
                'customer' => [
                    'firstName' => $r['nome'] ?? null,
                    'lastName' => $r['cognome'] ?? null,
                    'plate' => $r['targa'] ?? null,
                    'email' => $r['email'] ?? null,
                    'phone' => $r['telefono'] ?? null,
                ],

                // period / totals (both variants)
                'data_inizio' => $r['data_inizio'] ?? null,
                'data_fine' => $r['data_fine'] ?? null,
                'period' => [
                    'start' => $r['data_inizio'] ?? null,
                    'end' => $r['data_fine'] ?? null,
                ],
                'importo' => $r['importo_totale'] ?? null,
                'total' => $r['importo_totale'] ?? null,

                // parcheggio / parking
                'parcheggio' => $par ?: null,
                'parking' => $par ?: null,
            ];

            $payload = json_encode([
                'success' => true,
                'data' => $payloadData
            ]);

            $response = $response->withStatus(201);

        } catch (\PDOException $e) {
            // SQLSTATE 45000 = trigger che blocca l'inserimento per mancanza di posti
            $statusCode = ($e->getCode() === '45000') ? 409 : 500;
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
            $response = $response->withStatus($statusCode);

        } catch (\Exception $e) {

            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response = $response->withStatus(500);
        }

        $response->getBody()->write($payload);

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function deletePrenotazione(Request $request, Response $response, array $args): Response
    {
        $codice = $args['code'];

        try {
            $deleted = $this->repository->delete($codice);

            if ($deleted) {
                $payload = json_encode([
                    'success' => true,
                    'data' => []
                ]);
                $response = $response->withStatus(200);
            } else {
                $payload = json_encode([
                    'success' => false,
                    'message' => 'Prenotazione non trovata'
                ]);
                $response = $response->withStatus(404);
            }

        } catch (\Exception $e) {

            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response = $response->withStatus(500);
        }

        $response->getBody()->write($payload);

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function updatePrenotazione(Request $request, Response $response, array $args): Response
    {
        $codice = $args['code'];
        $params = $request->getParsedBody() ?? [];
        $params['codice_prenotazione'] = $codice;
        $prenotazione = new Prenotazione($params);

        try {
            $updated = $this->repository->update($prenotazione);

            if ($updated) {
                $payload = json_encode([
                    'success' => true,
                    'data' => []
                ]);
                $response = $response->withStatus(200);
            } else {
                $payload = json_encode([
                    'success' => false,
                    'message' => 'Prenotazione non trovata'
                ]);
                $response = $response->withStatus(404);
            }

        } catch (\Exception $e) {

            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);

            $response = $response->withStatus(500);
        }

        $response->getBody()->write($payload);

        return $response->withHeader('Content-Type', 'application/json');
    }
}