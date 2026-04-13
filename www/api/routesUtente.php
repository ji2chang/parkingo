
<?php

use parkingo\Controller\UtenteController;
$app->group('/user', function ($group) {
    $group->post('/login', UtenteController::class . ':login');
    $group->post('/signin', UtenteController::class . ':signin');
});