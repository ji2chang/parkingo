<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require './vendor/autoload.php';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

// Connessione database
function getDb(): PDO {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=parking_db;charset=utf8mb4",
        "lamp_user",
        "password"
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}

// Rotta GET per ottenere una prenotazione
$app->get('/OttieniPrenotazione', function (Request $request, Response $response, array $args): Response {
    $codice_prenotazione = $request->getQueryParams()['codice_prenotazione'] ?? null;
    
    if (!$codice_prenotazione) {
        $response->getBody()->write(json_encode(['error' => 'codice_prenotazione mancante']));
        return $response->withStatus(400);
    }
    
    $pdo = getDb();
    $stmt = $pdo->prepare("SELECT * FROM prenotazioni WHERE codice_prenotazione = ?");
    $stmt->execute([$codice_prenotazione]);
    $prenotazione = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$prenotazione) {
        $response->getBody()->write(json_encode(['error' => 'Prenotazione non trovata']));
        return $response->withStatus(404);
    }
    
    $response->getBody()->write(json_encode($prenotazione));
    return $response->withHeader('Content-Type', 'application/json');
});

// Rotta DELETE per rimuovere una prenotazione
$app->delete('/RimuoviPrenotazione', function (Request $request, Response $response, array $args): Response {
    $codice_prenotazione = $request->getQueryParams()['codice_prenotazione'] ?? null;
    
    if (!$codice_prenotazione) {
        $response->getBody()->write(json_encode(['error' => 'codice_prenotazione mancante']));
        return $response->withStatus(400);
    }
    
    $pdo = getDb();
    $stmt = $pdo->prepare("
        UPDATE prenotazioni 
        SET stato = 'annullata', annullata_at = CURRENT_TIMESTAMP 
        WHERE codice_prenotazione = ?
    ");
    $stmt->execute([$codice_prenotazione]);
    
    if ($stmt->rowCount() === 0) {
        $response->getBody()->write(json_encode(['error' => 'Prenotazione non trovata']));
        return $response->withStatus(404);
    }
    
    $response->getBody()->write(json_encode(['success' => true]));
    return $response->withHeader('Content-Type', 'application/json');
});

// Rotta POST per inserire una nuova prenotazione
$app->post('/InserisciPrenotazione', function (Request $request, Response $response, array $args): Response {
    $data = $request->getParsedBody();
    
    $pdo = getDb();
    
    // Calcola importo totale
    $stmt = $pdo->prepare("
        SELECT tariffa_oraria, 
               TIMESTAMPDIFF(HOUR, ?, ?) as ore
        FROM parcheggi 
        WHERE id = ?
    ");
    $stmt->execute([$data['data_inizio'], $data['data_fine'], $data['parcheggio_id']]);
    $calc = $stmt->fetch(PDO::FETCH_ASSOC);
    $importo_totale = $calc['tariffa_oraria'] * $calc['ore'];
    
    // Genera codice prenotazione
    $stmt = $pdo->prepare("CALL genera_codice_prenotazione(@codice)");
    $stmt->execute();
    $codice = $pdo->query("SELECT @codice as codice")->fetch()['codice'];
    
    // Inserisci prenotazione
    $stmt = $pdo->prepare("
        INSERT INTO prenotazioni (
            codice_prenotazione, parcheggio_id, nome, cognome, targa, 
            email, telefono, data_inizio, data_fine, stato, importo_totale, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'attiva', ?, ?)
    ");
    
    $stmt->execute([
        $codice,
        $data['parcheggio_id'],
        $data['nome'],
        $data['cognome'],
        $data['targa'],
        $data['email'] ?? null,
        $data['telefono'] ?? null,
        $data['data_inizio'],
        $data['data_fine'],
        $importo_totale,
        $data['note'] ?? null
    ]);
    
    $response->getBody()->write(json_encode([
        'success' => true,
        'codice_prenotazione' => $codice
    ]));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
});

// Rotta PUT per aggiornare una prenotazione esistente
$app->put('/AggiornaPrenotazione', function (Request $request, Response $response, array $args): Response {
    $data = $request->getParsedBody();
    $codice_prenotazione = $data['codice_prenotazione'] ?? null;
    
    if (!$codice_prenotazione) {
        $response->getBody()->write(json_encode(['error' => 'codice_prenotazione mancante']));
        return $response->withStatus(400);
    }
    
    $pdo = getDb();
    
    // Ricalcola importo totale
    $stmt = $pdo->prepare("
        SELECT p.tariffa_oraria, 
               TIMESTAMPDIFF(HOUR, ?, ?) as ore
        FROM prenotazioni pr
        JOIN parcheggi p ON pr.parcheggio_id = p.id
        WHERE pr.codice_prenotazione = ?
    ");
    $stmt->execute([$data['data_inizio'], $data['data_fine'], $codice_prenotazione]);
    $calc = $stmt->fetch(PDO::FETCH_ASSOC);
    $importo_totale = $calc['tariffa_oraria'] * $calc['ore'];
    
    $stmt = $pdo->prepare("
        UPDATE prenotazioni 
        SET nome = ?, cognome = ?, targa = ?, email = ?, telefono = ?, 
            data_inizio = ?, data_fine = ?, importo_totale = ?, note = ?
        WHERE codice_prenotazione = ?
    ");
    
    $stmt->execute([
        $data['nome'],
        $data['cognome'],
        $data['targa'],
        $data['email'] ?? null,
        $data['telefono'] ?? null,
        $data['data_inizio'],
        $data['data_fine'],
        $importo_totale,
        $data['note'] ?? null,
        $codice_prenotazione
    ]);
    
    if ($stmt->rowCount() === 0) {
        $response->getBody()->write(json_encode(['error' => 'Prenotazione non trovata']));
        return $response->withStatus(404);
    }
    
    $response->getBody()->write(json_encode(['success' => true]));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();