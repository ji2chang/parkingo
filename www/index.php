<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require './vendor/autoload.php';

$app = AppFactory::create();

// Rotta GET per ottenere una prenotazion
$app->get('/OttieniPrenotazione', function (Request $request,
                         Response $response,
                         array $args): Response {
    return $response;
});

// Rotta DELETE per rimuovere una prenotazione
$app->delete('/RimuoviPrenotazione', function (Request $request,
                         Response $response,
                         array $args): Response {
    return $response;
});

// Rotta POST per inserire una nuova prenotazione
$app->post('/InserisciPrenotazione', function (Request $request,
                         Response $response,
                         array $args): Response {
    $data =$request->getParseBody();
    $required = ['nome','cognome','targa','telefono','data_inizio','data_fine'];
    foreach($field in $required){
        if(empty($data[$field])){
            $response->getBody()->write(json_endcode([
                "success": false,
                "message": "Campo $field mancante" 
            ]));
            return $response->withStatus(400);}}
    $nome          = trim($data['nome']);
    $cognome       = trim($data['cognome']);
    $targa         = strtoupper(trim($data['targa']));
    $email         = $data['email'] ?? null;
    $telefono      = $data['telefono'] ?? null;
    $data_inizio   = $data['data_inizio'];
    $data_fine     = $data['data_fine'];    
    if(strtotime($data_inizio)>strtotime($data_fine)){
        $response->getBody()->write(json_decode[
            "Success": false,
            "message": "La data di inizio deve minore della data di fine"
        ])}
    $stmt = $pdo->prepare("SELECT * FROM parcheggi WHERE id = ?");
        $stmt->execute([$parcheggio_id]);
        $parcheggio = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$parcheggio) {
            throw new Exception("Parcheggio non trovato");
        }
    return $response;
});

// Rotta PUT per aggiornare una prenotazione esistente
$app->put('/AggiornaPrenotazione', function (Request $request,
                         Response $response,
                         array $args): Response {
    return $response;
});



