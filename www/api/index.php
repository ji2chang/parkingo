<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

require '../vendor/autoload.php';

$app = AppFactory::create();

// 1. Set Base Path FIRST
$app->setBasePath('/api');

// 2. Add Routing Middleware SECOND
$app->addRoutingMiddleware();

// 3. Add Body Parsing (helpful for POST)
$app->addBodyParsingMiddleware();

// 5. Handle OPTIONS requests for all routes
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// 6. Define/Require your routes
require __DIR__ . '/routesParcheggio.php';
require __DIR__ . '/routesPrenotazione.php';

// 7. Error Middleware (Keep at the bottom)
$app->addErrorMiddleware(true, true, true);

$app->run();