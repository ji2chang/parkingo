
<?php

use parkingo\Controller\PrenotazioneController;
use parkingo\Controller\AnalyticsController;

$app->group('/bookings', function ($group) {
    $group->post('', PrenotazioneController::class . ':createPrenotazione');
    $group->get('/{code}', PrenotazioneController::class . ':findByCodice');
    $group->delete('/{code}', PrenotazioneController::class . ':deletePrenotazione');
    $group->patch('/{code}', PrenotazioneController::class . ':updatePrenotazione');
});

$app->group('/analytics', function ($group) {
    $group->get('', AnalyticsController::class . ':getStats');
    $group->get('/heatmap', AnalyticsController::class . ':getHeatmap');
});
