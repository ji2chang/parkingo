<?php

// Parametri di connessione al database
const DB_HOST = 'DATABASE'; // Nome host o IP (es. nome del container Docker)
const DB_NAME = 'parking_db';
const DB_USER = 'parking_user';
const DB_PASS = 'parkingpassword';
const PRODUCTION= FALSE;
const VITADIMERDA= TRUE;

return [
    'DB_HOST' => DB_HOST,
    'DB_NAME' => DB_NAME,
    'DB_USER' => DB_USER,
    'DB_PASS' => DB_PASS
];