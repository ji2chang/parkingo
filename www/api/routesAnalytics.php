<?php

use parkingo\Controller\AnalyticsController;

$app->group('/analytics', function ($group) {
    // /cities deve stare prima di /{id} altrimenti FastRoute lo cattura come ID
    $group->get('/', ParcheggioController::class . ':getStats');
    $group->get('/heatmap', ParcheggioController::class . ':getHeatmap');
});
