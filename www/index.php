<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require './vendor/autoload.php';

$app = AppFactory::create();

$config = require './config/config.php';

// Rotta GET per ottenere una prenotazion
$app->get('/prenotazioni/{codice}', function (Request $request,
                         Response $response,
                         array $args): Response {
    $sql = "SELECT p.nome, p.cognome, p.targa, p.email, p.telefono, p.data_inizio, p.data_fine, p.importo_totale, p.note, p.created_at, p.updated_at, pa.nome ".
        "FROM prenotazioni p ".
        "WHERE codice_prenotazione=:codice_prenotazione ".
        "JOIN parcheggi pa ".
        "ON p.parcheggio_id=pa.id;";
    return $response;
});

// Rotta DELETE per rimuovere una prenotazione
$app->delete('/prenotazioni/{codice}', function (Request $request,
                         Response $response,
                         array $args): Response {
    
    return $response;
});

// Rotta POST per inserire una nuova prenotazione
$app->post('/prenotazioni', function (Request $request,
                         Response $response,
                         array $args): Response {
    return $response;
});

// Rotta PUT per aggiornare una prenotazione esistente
$app->put('/prenotazioni/{codice}', function (Request $request,
                         Response $response,
                         array $args): Response {
    return $response;
});



$app->run();
