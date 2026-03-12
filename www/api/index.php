<?php

require '../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use parkingo\Controller\PrenotazioneController;
use parkingo\Controller\AnalyticsController;

$app = AppFactory::create();
$app->setBasePath('/api');

$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Middleware CORS
$app->add(function ($request, $handler) {
    $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:9080',
        'http://localhost:8080',
        'https://localhost:9443',
        'https://prova:9443',
    ];
    $origin = $request->getHeaderLine('Origin');
    $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0];

    // Gestione preflight OPTIONS
    if ($request->getMethod() === 'OPTIONS') {
        $response = new \Slim\Psr7\Response();
        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowOrigin)
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withStatus(204);
    }

    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', $allowOrigin)
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
});

require __DIR__ . '/routesParcheggio.php';
require __DIR__ . '/routesPrenotazione.php';

$app->run();
