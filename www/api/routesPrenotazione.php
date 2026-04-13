<?php

use parkingo\Controller\PrenotazioneController;
use parkingo\Middleware\JwtMiddleware;

$app->group('/bookings', function ($group) {
    $group->post('', PrenotazioneController::class . ':createPrenotazione')->add(JwtMiddleware::class);
    $group->delete('/{code}', PrenotazioneController::class . ':deletePrenotazione')->add(JwtMiddleware::class);
    $group->patch('/{code}', PrenotazioneController::class . ':updatePrenotazione')->add(JwtMiddleware::class);
    $group->get('/{code}', PrenotazioneController::class . ':findByCodice');
});