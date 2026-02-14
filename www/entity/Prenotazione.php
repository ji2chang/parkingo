<?php

namespace App\Entity;

use App\Enum\StatoPrenotazione;

class Prenotazione
{
    public int $id;
    public string $codice_prenotazione;
    public int $parcheggio_id;

    public string $nome;
    public string $cognome;
    public string $targa;
    public ?string $email;
    public ?string $telefono;

    public string $data_inizio;
    public string $data_fine;

    public StatoPrenotazione $stato; // attiva, annullata, scaduta, completata

    public ?float $importo_totale;
    public ?string $note;

    public string $created_at;
    public string $updated_at;
    public ?string $annullata_at;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }
}
