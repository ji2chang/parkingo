
<?php

use parkingo\Controller\UtenteController;
use parkingo\Middleware\JwtMiddleware;
$app->group('/user', function ($group) {
    $group->post('/login', UtenteController::class . ':login');
    $group->post('/signin', UtenteController::class . ':signin');
    $group->get('/profile', UtenteController::class . ':profilo')->add(JwtMiddleware::class);
    $group->patch('/profile', UtenteController::class . ':updateProfile')->add(JwtMiddleware::class);
});