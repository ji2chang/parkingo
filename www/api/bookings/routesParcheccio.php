<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use parkingo\Controller\ParcheggioController;

require '../../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/api/parkings', ParcheggioController::class . ':findAll');

$app->get('/api/parkings/{id}', ParcheggioController::class . ':findById');

$app->get('/api/parkings/{id}/availability', ParcheggioController::class . ':getAvailability');

$app->run();
