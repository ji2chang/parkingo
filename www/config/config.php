<?php

// Parametri di connessione al database
const DB_HOST = 'database'; // Nome host o IP (es. nome del container Docker)
const DB_NAME = 'parking_db';
const DB_USER = 'parking_user';
const DB_PASS = 'parkingpassword';

// jwt
const JWT_SECRET = 'y_TsfdjAcvgjha67jh£g@cV';
const JWT_ALGO = 'HS256';

const JWT_EXPIRE_MINUTES = 60;
const PRODUCTION= FALSE;

return [
    'DB_HOST' => DB_HOST,
    'DB_NAME' => DB_NAME,
    'DB_USER' => DB_USER,
    'DB_PASS' => DB_PASS,
    'JWT_SECRET' => JWT_SECRET,
    'JWT_ALGO' => JWT_ALGO,
    'JWT_EXPIRE_MINUTES' => JWT_EXPIRE_MINUTES,
    'PRODUCTION' => PRODUCTION,
];