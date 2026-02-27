
<?php

use parkingo\Controller\PrenotazioneController;

$app->group('/bookings', function ($group) {
    $group->get('/all', PrenotazioneController::class . ':findAll');
    $group->post('', PrenotazioneController::class . ':createPrenotazione');
});
