<?php

namespace parkingo\Controller;

use parkingo\Entity\Prenotazione;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use parkingo\Repository\PrenotazioneRepository;
use parkingo\Repository\ParcheggioRepository;

class PrenotazioneController
{
    private PrenotazioneRepository $repository;
    private ParcheggioRepository $parRepo;

    public function __construct()
    {
        $this->repository = new PrenotazioneRepository();
        $this->parRepo = new ParcheggioRepository();
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

        // 格式化数据使其與 createPrenotazione 一致
        $parcheggio_id = $prenotazione->parcheggio_id ?? $prenotazione['parcheggio_id'] ?? null;
        if (!$parcheggio_id) {
            throw new \Exception("Parcheggio ID not found in prenotazione");
        }

        $par = $this->parRepo->ottieniParcheggioById((int)$parcheggio_id);

        $payloadData = [
            'codice' => $prenotazione->codice_prenotazione ?? $prenotazione['codice_prenotazione'] ?? null,
            'codice_prenotazione' => $prenotazione->codice_prenotazione ?? $prenotazione['codice_prenotazione'] ?? null,
            'nome' => $prenotazione->nome ?? $prenotazione['nome'] ?? null,
            'cognome' => $prenotazione->cognome ?? $prenotazione['cognome'] ?? null,
            'targa' => $prenotazione->targa ?? $prenotazione['targa'] ?? null,
            'email' => $prenotazione->email ?? $prenotazione['email'] ?? null,
            'telefono' => $prenotazione->telefono ?? $prenotazione['telefono'] ?? null,
            'customer' => [
                'firstName' => $prenotazione->nome ?? $prenotazione['nome'] ?? null,
                'lastName' => $prenotazione->cognome ?? $prenotazione['cognome'] ?? null,
                'plate' => $prenotazione->targa ?? $prenotazione['targa'] ?? null,
                'email' => $prenotazione->email ?? $prenotazione['email'] ?? null,
                'phone' => $prenotazione->telefono ?? $prenotazione['telefono'] ?? null,
            ],
            'data_inizio' => $prenotazione->data_inizio ?? $prenotazione['data_inizio'] ?? null,
            'data_fine' => $prenotazione->data_fine ?? $prenotazione['data_fine'] ?? null,
            'period' => [
                'start' => $prenotazione->data_inizio ?? $prenotazione['data_inizio'] ?? null,
                'end' => $prenotazione->data_fine ?? $prenotazione['data_fine'] ?? null,
            ],
            'importo' => (float)($prenotazione->importo_totale ?? $prenotazione['importo_totale'] ?? 0),
            'total' => (float)($prenotazione->importo_totale ?? $prenotazione['importo_totale'] ?? 0),
            'parcheggio' => $par,
            'parking' => $par,
        ];

        $payload = json_encode([
            'success' => true,
            'data' => $payloadData
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    public function createPrenotazione(Request $request, Response $response, array $args): Response
    {
        $rawData = $request->getParsedBody();

        try {
            // ===== 1. VALIDAZIONE CAMPI OBBLIGATORI =====
            $requiredFields = ['parcheggio_id', 'data_inizio', 'orario_inizio', 'data_fine', 
                             'orario_fine', 'nome', 'cognome', 'targa', 'email'];
            
            $missingFields = [];
            foreach ($requiredFields as $field) {
                if (!isset($rawData[$field]) || trim((string)$rawData[$field]) === '') {
                    $missingFields[] = $field;
                }
            }

            if (!empty($missingFields)) {
                throw new \Exception("Campi obbligatori mancanti: " . implode(', ', $missingFields));
            }

            // ===== 2. FILTRO E PREPARAZIONE DATI =====
            // Combina data e ora in formato DATETIME
            $dataInizio = trim((string)$rawData['data_inizio']);
            $orarioInizio = trim((string)$rawData['orario_inizio']);
            $dataFine = trim((string)$rawData['data_fine']);
            $orarioFine = trim((string)$rawData['orario_fine']);

            $dataTimeInizio = $dataInizio . ' ' . $orarioInizio;
            $dataTimeFine = $dataFine . ' ' . $orarioFine;

            // Valida il formato datetime
            $inizio = \DateTime::createFromFormat('Y-m-d H:i', $dataTimeInizio);
            $fine = \DateTime::createFromFormat('Y-m-d H:i', $dataTimeFine);

            if (!$inizio || !$fine) {
                throw new \Exception("Formato data/ora non valido. Usa: YYYY-MM-DD HH:mm");
            }

            // Verifica che fine sia dopo inizio
            if ($fine <= $inizio) {
                throw new \Exception("La data/ora di fine deve essere dopo quella di inizio");
            }

            // Verifica che non sia nel passato
            $now = new \DateTime();
            if ($inizio < $now) {
                throw new \Exception("Non è possibile prenotare dal passato");
            }

            // ===== 3. PREPARAZIONE ENTITY =====
            $data = [
                'parcheggio_id' => (int)$rawData['parcheggio_id'],
                'data_inizio' => $inizio->format('Y-m-d H:i:s'),
                'data_fine' => $fine->format('Y-m-d H:i:s'),
                'nome' => trim((string)$rawData['nome']),
                'cognome' => trim((string)$rawData['cognome']),
                'targa' => strtoupper(trim((string)$rawData['targa'])), // Uppercase plate
                'email' => filter_var(trim((string)$rawData['email']), FILTER_VALIDATE_EMAIL),
                'telefono' => isset($rawData['telefono']) ? trim((string)$rawData['telefono']) : null,
                'note' => isset($rawData['note']) ? trim((string)$rawData['note']) : null,
            ];

            // Valida email
            if (!$data['email']) {
                throw new \Exception("Email non valida");
            }

            $prenotazione = new Prenotazione($data);

            // ===== 4. CREAZIONE PRENOTAZIONE =====
            $result = $this->repository->create($prenotazione);

            // ===== 5. RECUPERA DATI PARCHEGGIO =====
            $par = $this->parRepo->ottieniParcheggioById((int)$data['parcheggio_id']);

            $payloadData = [
                'codice' => $result->codice_prenotazione ?? null,
                'codice_prenotazione' => $result->codice_prenotazione ?? null,
                'nome' => $result->nome ?? null,
                'cognome' => $result->cognome ?? null,
                'targa' => $result->targa ?? null,
                'email' => $result->email ?? null,
                'telefono' => $result->telefono ?? null,
                'customer' => [
                    'firstName' => $result->nome ?? null,
                    'lastName' => $result->cognome ?? null,
                    'plate' => $result->targa ?? null,
                    'email' => $result->email ?? null,
                    'phone' => $result->telefono ?? null,
                ],
                'data_inizio' => $result->data_inizio ?? null,
                'data_fine' => $result->data_fine ?? null,
                'period' => [
                    'start' => $result->data_inizio ?? null,
                    'end' => $result->data_fine ?? null,
                ],
                'importo' => (float)($result->importo_totale ?? 0),
                'total' => (float)($result->importo_totale ?? 0),
                'parcheggio' => $par,
                'parking' => $par,
            ];

            $payload = json_encode([
                'success' => true,
                'data' => $payloadData
            ]);

            $response = $response->withStatus(201);

        } catch (\PDOException $e) {
            // SQLSTATE 45000 = trigger che blocca l'inserimento per mancanza di posti
            $statusCode = ($e->getCode() === '45000') ? 409 : 500;
            $message = ($e->getCode() === '45000') 
                ? 'Nessun posto disponibile nel periodo selezionato'
                : 'Errore nel database: ' . $e->getMessage();
            
            $payload = json_encode([
                'success' => false,
                'message' => $message
            ]);
            $response = $response->withStatus($statusCode);

        } catch (\Exception $e) {
            $payload = json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
            $response = $response->withStatus(400);
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