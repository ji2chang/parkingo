<?php

namespace App\Enum;

enum StatoPostoAuto: string
{
    case OCCUPATO = 'OCCUPATO';
    case LIBERO = 'LIBERO';
    case NON_DISPONIBILE = 'NON DISPONIBILE';
}
