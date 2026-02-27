<?php
namespace parkingo\Enum;

enum StatoPrenotazione: string
{
    case ATTIVA = 'attiva';
    case ANNULLATA = 'annullata';
    case SCADUTA = 'scaduta';
    case COMPLETATA = 'completata';
}
