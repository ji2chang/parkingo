<?php

use parkingo\Controller\AutoController;
use parkingo\Middleware\JwtMiddleware;

$app->group('/cars', function ($group) {
    $group->get('', AutoController::class . ':listAuto')->add(JwtMiddleware::class);
    $group->post('', AutoController::class . ':createAuto')->add(JwtMiddleware::class);
    $group->put('/{id}', AutoController::class . ':updateAuto')->add(JwtMiddleware::class);
    $group->patch('/{id}', AutoController::class . ':updateAuto')->add(JwtMiddleware::class);
    $group->delete('/{id}', AutoController::class . ':deleteAuto')->add(JwtMiddleware::class);
});
