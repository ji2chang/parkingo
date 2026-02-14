<?php
namespace App\Enum;

enum StatoPrenotazione: string
{
    case ATTIVA = 'attiva';
    case ANNULLATA = 'annullata';
    case SCADUTA = 'scaduta';
    case COMPLETATA = 'completata';
}
