<?php

use parkingo\Controller\ParcheggioController;

$app->group('/parkings', function ($group) {
    $group->get('', ParcheggioController::class . ':findAll');
    $group->get('/{id}', ParcheggioController::class . ':findById');
    $group->get('/{id}/availability', ParcheggioController::class . ':getAvailability');
    $group->get('/cities', ParcheggioController::class.':getCitta');
});
