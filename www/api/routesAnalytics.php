<?php

use parkingo\Controller\AnalyticsController;

$app->group('/analytics', function ($group) {
    // /cities deve stare prima di /{id} altrimenti FastRoute lo cattura come ID
    $group->get('/', AnalyticsController::class . ':getStats');
    $group->get('/heatmap', AnalyticsController::class . ':getHeatmap');
});
