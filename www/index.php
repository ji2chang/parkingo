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
    return $response;
});

// Rotta PUT per aggiornare una prenotazione esistente
$app->put('/AggiornaPrenotazione', function (Request $request,
                         Response $response,
                         array $args): Response {
    return $response;
});

// Rotta per servire l'applicazione React
$app->get('/[/{path:.*}]', function (Request $request, Response $response, array $args) {
    $file = __DIR__ . '/index.html';
    if (file_exists($file)) {
        $response->getBody()->write(file_get_contents($file));
        return $response;
    }
    return $response->withStatus(404, 'File non trovato');
});

$app->run();



