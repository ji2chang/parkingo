<?php

use parkingo\Controller\ParcheggioController;


$app->group('/parkings', function ($group) {
    // /cities deve stare prima di /{id} altrimenti FastRoute lo cattura come ID
    $group->get('/cities', ParcheggioController::class . ':getCitta');
    $group->get('', ParcheggioController::class . ':findAll');
    $group->get('/{id:[0-9]+}', ParcheggioController::class . ':findById');
    $group->get('/{id:[0-9]+}/availability', ParcheggioController::class . ':getAvailability');
});
