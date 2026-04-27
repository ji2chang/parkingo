<?php

use parkingo\Controller\ParcheggioController;
use \parkingo\Middleware\AdminMiddleware;
use \parkingo\Middleware\JwtMiddleware;
$app->delete('/parkings/{id:[0-9]+}', ParcheggioController::class . ':deletePrenotazione')
    ->add(AdminMiddleware::class)    
    ->add(JwtMiddleware::class);