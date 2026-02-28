
<?php

use parkingo\Controller\PrenotazioneController;

$app->group('/bookings', function ($group) {
    $group->post('', PrenotazioneController::class . ':createPrenotazione');
});
