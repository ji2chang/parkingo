<?php

require '../../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use parkingo\Controller\PrenotazioneController;


$app = AppFactory::create();

$config = require '../../config/config.php';

$app->setBasePath('/api/bookings');
$app->get('/{code}', PrenotazioneController::class.':findByCodice' );

