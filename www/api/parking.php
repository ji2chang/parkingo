<?php

require '../../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use parkingo\Controller\PrenotazioneController;

$app = AppFactory::create();
$app->setBasePath('/api/bookings');

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
});

// Gestione preflight OPTIONS
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

$config = require '../../config/config.php';


$app->get('/', function (Request $request, Response $response, array $args) {
    $response->getBody()->write('ciao');
    return $response;
});

$app->get('/{code}', PrenotazioneController::class . ':findByCodice');

$app->run();
