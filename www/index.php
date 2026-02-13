<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require './vendor/autoload.php';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// ===========================================
// CONFIGURAZIONE DATABASE
// ===========================================
function getDbConnection(): PDO {
    $host = 'localhost';
    $dbname = 'parking_db';
    $username = 'lamp_user';
    $password = 'your_password'; // Modifica con la tua password
    
    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        throw new Exception("Errore di connessione al database: " . $e->getMessage());
    }
}

// ===========================================
// FUNZIONI HELPER
// ===========================================

/**
 * Genera un codice prenotazione univoco usando la stored procedure
 */
function generaCodicePrenotazione(PDO $pdo): string {
    $stmt = $pdo->prepare("CALL genera_codice_prenotazione(@codice)");
    $stmt->execute();
    
    $result = $pdo->query("SELECT @codice as codice")->fetch();
    return $result['codice'];
}

/**
 * Verifica disponibilità parcheggio usando la funzione SQL
 */
function verificaDisponibilita(PDO $pdo, int $parcheggio_id, string $data_inizio, string $data_fine): int {
    $stmt = $pdo->prepare("SELECT posti_disponibili(?, ?, ?) as disponibili");
    $stmt->execute([$parcheggio_id, $data_inizio, $data_fine]);
    $result = $stmt->fetch();
    return (int)$result['disponibili'];
}

/**
 * Calcola l'importo totale della prenotazione
 */
function calcolaImporto(PDO $pdo, int $parcheggio_id, string $data_inizio, string $data_fine): float {
    // Recupera la tariffa oraria
    $stmt = $pdo->prepare("SELECT tariffa_oraria FROM parcheggi WHERE id = ?");
    $stmt->execute([$parcheggio_id]);
    $parcheggio = $stmt->fetch();
    
    if (!$parcheggio) {
        throw new Exception("Parcheggio non trovato");
    }
    
    // Calcola le ore (arrotondando per eccesso)
    $inizio = new DateTime($data_inizio);
    $fine = new DateTime($data_fine);
    $diff = $inizio->diff($fine);
    $ore = $diff->days * 24 + $diff->h + ($diff->i > 0 ? 1 : 0);
    
    return $ore * $parcheggio['tariffa_oraria'];
}

/**
 * Invia risposta JSON formattata
 */
function jsonResponse(Response $response, array $data, int $status = 200): Response {
    $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status);
}

// ===========================================
// ROUTE: GET /OttieniPrenotazione
// Parametri query: codice (codice_prenotazione)
// ===========================================
$app->get('/OttieniPrenotazione', function (Request $request, Response $response, array $args): Response {
    try {
        $queryParams = $request->getQueryParams();
        $codice = $queryParams['codice'] ?? null;
        
        if (!$codice) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Parametro "codice" mancante'
            ], 400);
        }
        
        $pdo = getDbConnection();
        
        // Query con JOIN per ottenere anche i dettagli del parcheggio
        $stmt = $pdo->prepare("
            SELECT 
                pr.id,
                pr.codice_prenotazione,
                pr.nome,
                pr.cognome,
                pr.targa,
                pr.email,
                pr.telefono,
                pr.data_inizio,
                pr.data_fine,
                pr.stato,
                pr.importo_totale,
                pr.note,
                pr.created_at,
                p.nome as parcheggio_nome,
                p.indirizzo as parcheggio_indirizzo,
                p.citta as parcheggio_citta,
                p.cap as parcheggio_cap,
                TIMESTAMPDIFF(HOUR, pr.data_inizio, pr.data_fine) as ore_totali
            FROM prenotazioni pr
            JOIN parcheggi p ON pr.parcheggio_id = p.id
            WHERE pr.codice_prenotazione = ?
        ");
        
        $stmt->execute([$codice]);
        $prenotazione = $stmt->fetch();
        
        if (!$prenotazione) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Prenotazione non trovata'
            ], 404);
        }
        
        return jsonResponse($response, [
            'success' => true,
            'data' => $prenotazione
        ]);
        
    } catch (Exception $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// ===========================================
// ROUTE: POST /InserisciPrenotazione
// Body JSON richiesto
// ===========================================
$app->post('/InserisciPrenotazione', function (Request $request, Response $response, array $args): Response {
    try {
        $data = $request->getParsedBody();
        
        // Validazione campi obbligatori
        $campiObbligatori = ['parcheggio_id', 'nome', 'cognome', 'targa', 'data_inizio', 'data_fine'];
        foreach ($campiObbligatori as $campo) {
            if (empty($data[$campo])) {
                return jsonResponse($response, [
                    'success' => false,
                    'error' => "Campo obbligatorio mancante: $campo"
                ], 400);
            }
        }
        
        $pdo = getDbConnection();
        
        // Verifica che il parcheggio esista
        $stmt = $pdo->prepare("SELECT id FROM parcheggi WHERE id = ?");
        $stmt->execute([$data['parcheggio_id']]);
        if (!$stmt->fetch()) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Parcheggio non esistente'
            ], 400);
        }
        
        // Validazione date
        $dataInizio = new DateTime($data['data_inizio']);
        $dataFine = new DateTime($data['data_fine']);
        $now = new DateTime();
        
        if ($dataFine <= $dataInizio) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'La data di fine deve essere successiva alla data di inizio'
            ], 400);
        }
        
        if ($dataInizio < $now) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'La data di inizio non può essere nel passato'
            ], 400);
        }
        
        // Verifica disponibilità
        $disponibili = verificaDisponibilita(
            $pdo,
            $data['parcheggio_id'],
            $data['data_inizio'],
            $data['data_fine']
        );
        
        if ($disponibili <= 0) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Nessun posto disponibile per il periodo selezionato'
            ], 409);
        }
        
        // Calcola importo
        $importo = calcolaImporto(
            $pdo,
            $data['parcheggio_id'],
            $data['data_inizio'],
            $data['data_fine']
        );
        
        // Genera codice prenotazione
        $codicePrenotazione = generaCodicePrenotazione($pdo);
        
        // Inserisci prenotazione
        $stmt = $pdo->prepare("
            INSERT INTO prenotazioni (
                codice_prenotazione,
                parcheggio_id,
                nome,
                cognome,
                targa,
                email,
                telefono,
                data_inizio,
                data_fine,
                stato,
                importo_totale,
                note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'attiva', ?, ?)
        ");
        
        $stmt->execute([
            $codicePrenotazione,
            $data['parcheggio_id'],
            $data['nome'],
            $data['cognome'],
            strtoupper($data['targa']),
            $data['email'] ?? null,
            $data['telefono'] ?? null,
            $data['data_inizio'],
            $data['data_fine'],
            $importo,
            $data['note'] ?? null
        ]);
        
        // Recupera la prenotazione appena inserita
        $stmt = $pdo->prepare("
            SELECT 
                pr.*,
                p.nome as parcheggio_nome,
                p.indirizzo as parcheggio_indirizzo,
                p.citta as parcheggio_citta
            FROM prenotazioni pr
            JOIN parcheggi p ON pr.parcheggio_id = p.id
            WHERE pr.codice_prenotazione = ?
        ");
        $stmt->execute([$codicePrenotazione]);
        $nuovaPrenotazione = $stmt->fetch();
        
        return jsonResponse($response, [
            'success' => true,
            'message' => 'Prenotazione creata con successo',
            'data' => $nuovaPrenotazione
        ], 201);
        
    } catch (PDOException $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => 'Errore database: ' . $e->getMessage()
        ], 500);
    } catch (Exception $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// ===========================================
// ROUTE: PUT /AggiornaPrenotazione
// Body JSON: codice + campi da aggiornare
// ===========================================
$app->put('/AggiornaPrenotazione', function (Request $request, Response $response, array $args): Response {
    try {
        $data = $request->getParsedBody();
        
        if (empty($data['codice'])) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Codice prenotazione mancante'
            ], 400);
        }
        
        $pdo = getDbConnection();
        
        // Verifica che la prenotazione esista e sia attiva
        $stmt = $pdo->prepare("
            SELECT * FROM prenotazioni 
            WHERE codice_prenotazione = ? AND stato = 'attiva'
        ");
        $stmt->execute([$data['codice']]);
        $prenotazioneEsistente = $stmt->fetch();
        
        if (!$prenotazioneEsistente) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Prenotazione non trovata o non più modificabile'
            ], 404);
        }
        
        // Prepara i campi aggiornabili
        $campiAggiornabili = [];
        $valori = [];
        
        if (isset($data['nome'])) {
            $campiAggiornabili[] = "nome = ?";
            $valori[] = $data['nome'];
        }
        if (isset($data['cognome'])) {
            $campiAggiornabili[] = "cognome = ?";
            $valori[] = $data['cognome'];
        }
        if (isset($data['targa'])) {
            $campiAggiornabili[] = "targa = ?";
            $valori[] = strtoupper($data['targa']);
        }
        if (isset($data['email'])) {
            $campiAggiornabili[] = "email = ?";
            $valori[] = $data['email'];
        }
        if (isset($data['telefono'])) {
            $campiAggiornabili[] = "telefono = ?";
            $valori[] = $data['telefono'];
        }
        if (isset($data['note'])) {
            $campiAggiornabili[] = "note = ?";
            $valori[] = $data['note'];
        }
        
        // Gestione modifica date (più complessa, richiede ricalcolo disponibilità)
        if (isset($data['data_inizio']) || isset($data['data_fine'])) {
            $nuovaDataInizio = $data['data_inizio'] ?? $prenotazioneEsistente['data_inizio'];
            $nuovaDataFine = $data['data_fine'] ?? $prenotazioneEsistente['data_fine'];
            
            // Validazione date
            $dataInizio = new DateTime($nuovaDataInizio);
            $dataFine = new DateTime($nuovaDataFine);
            
            if ($dataFine <= $dataInizio) {
                return jsonResponse($response, [
                    'success' => false,
                    'error' => 'La data di fine deve essere successiva alla data di inizio'
                ], 400);
            }
            
            // Verifica disponibilità (escludendo questa prenotazione)
            $stmt = $pdo->prepare("
                SELECT COUNT(*) as occupati
                FROM prenotazioni
                WHERE parcheggio_id = ?
                  AND stato = 'attiva'
                  AND id != ?
                  AND (data_inizio < ? AND data_fine > ?)
            ");
            $stmt->execute([
                $prenotazioneEsistente['parcheggio_id'],
                $prenotazioneEsistente['id'],
                $nuovaDataFine,
                $nuovaDataInizio
            ]);
            $occupati = $stmt->fetch()['occupati'];
            
            $stmt = $pdo->prepare("SELECT posti_totali FROM parcheggi WHERE id = ?");
            $stmt->execute([$prenotazioneEsistente['parcheggio_id']]);
            $postiTotali = $stmt->fetch()['posti_totali'];
            
            if ($occupati >= $postiTotali) {
                return jsonResponse($response, [
                    'success' => false,
                    'error' => 'Nessun posto disponibile per il nuovo periodo'
                ], 409);
            }
            
            // Ricalcola importo
            $nuovoImporto = calcolaImporto(
                $pdo,
                $prenotazioneEsistente['parcheggio_id'],
                $nuovaDataInizio,
                $nuovaDataFine
            );
            
            $campiAggiornabili[] = "data_inizio = ?";
            $valori[] = $nuovaDataInizio;
            $campiAggiornabili[] = "data_fine = ?";
            $valori[] = $nuovaDataFine;
            $campiAggiornabili[] = "importo_totale = ?";
            $valori[] = $nuovoImporto;
        }
        
        if (empty($campiAggiornabili)) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Nessun campo da aggiornare specificato'
            ], 400);
        }
        
        // Esegui l'aggiornamento
        $valori[] = $data['codice'];
        $sql = "UPDATE prenotazioni SET " . implode(", ", $campiAggiornabili) . " WHERE codice_prenotazione = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($valori);
        
        // Recupera la prenotazione aggiornata
        $stmt = $pdo->prepare("
            SELECT 
                pr.*,
                p.nome as parcheggio_nome,
                p.indirizzo as parcheggio_indirizzo,
                p.citta as parcheggio_citta
            FROM prenotazioni pr
            JOIN parcheggi p ON pr.parcheggio_id = p.id
            WHERE pr.codice_prenotazione = ?
        ");
        $stmt->execute([$data['codice']]);
        $prenotazioneAggiornata = $stmt->fetch();
        
        return jsonResponse($response, [
            'success' => true,
            'message' => 'Prenotazione aggiornata con successo',
            'data' => $prenotazioneAggiornata
        ]);
        
    } catch (PDOException $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => 'Errore database: ' . $e->getMessage()
        ], 500);
    } catch (Exception $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// ===========================================
// ROUTE: DELETE /RimuoviPrenotazione
// Parametri query: codice
// ===========================================
$app->delete('/RimuoviPrenotazione', function (Request $request, Response $response, array $args): Response {
    try {
        $queryParams = $request->getQueryParams();
        $codice = $queryParams['codice'] ?? null;
        
        if (!$codice) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Parametro "codice" mancante'
            ], 400);
        }
        
        $pdo = getDbConnection();
        
        // Verifica che la prenotazione esista
        $stmt = $pdo->prepare("SELECT * FROM prenotazioni WHERE codice_prenotazione = ?");
        $stmt->execute([$codice]);
        $prenotazione = $stmt->fetch();
        
        if (!$prenotazione) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Prenotazione non trovata'
            ], 404);
        }
        
        if ($prenotazione['stato'] !== 'attiva') {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Impossibile annullare una prenotazione non attiva'
            ], 400);
        }
        
        // Annulla la prenotazione (non eliminazione fisica)
        $stmt = $pdo->prepare("
            UPDATE prenotazioni 
            SET stato = 'annullata', 
                annullata_at = CURRENT_TIMESTAMP 
            WHERE codice_prenotazione = ?
        ");
        $stmt->execute([$codice]);
        
        return jsonResponse($response, [
            'success' => true,
            'message' => 'Prenotazione annullata con successo',
            'codice' => $codice
        ]);
        
    } catch (Exception $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// ===========================================
// ROUTE AGGIUNTIVE UTILI
// ===========================================

// Lista tutti i parcheggi disponibili
$app->get('/parcheggi', function (Request $request, Response $response, array $args): Response {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->query("SELECT * FROM parcheggi ORDER BY citta, nome");
        $parcheggi = $stmt->fetchAll();
        
        return jsonResponse($response, [
            'success' => true,
            'data' => $parcheggi
        ]);
    } catch (Exception $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// Verifica disponibilità per un parcheggio in un periodo
$app->get('/verificaDisponibilita', function (Request $request, Response $response, array $args): Response {
    try {
        $queryParams = $request->getQueryParams();
        $parcheggio_id = $queryParams['parcheggio_id'] ?? null;
        $data_inizio = $queryParams['data_inizio'] ?? null;
        $data_fine = $queryParams['data_fine'] ?? null;
        
        if (!$parcheggio_id || !$data_inizio || !$data_fine) {
            return jsonResponse($response, [
                'success' => false,
                'error' => 'Parametri mancanti: parcheggio_id, data_inizio, data_fine'
            ], 400);
        }
        
        $pdo = getDbConnection();
        $disponibili = verificaDisponibilita($pdo, $parcheggio_id, $data_inizio, $data_fine);
        $importo = calcolaImporto($pdo, $parcheggio_id, $data_inizio, $data_fine);
        
        return jsonResponse($response, [
            'success' => true,
            'data' => [
                'posti_disponibili' => $disponibili,
                'disponibile' => $disponibili > 0,
                'importo_stimato' => $importo
            ]
        ]);
    } catch (Exception $e) {
        return jsonResponse($response, [
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// ===========================================
// AVVIO APPLICAZIONE
// ===========================================
$app->run();