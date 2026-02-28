<?php
namespace parkingo\Entity;
use ArrayAccess;

class Prenotazione implements \ArrayAccess
{
    use ArrayAccessible;

    public int $id;
    public string $codice_prenotazione;
    public int $parcheggio_id;

    // Dati utente
    public string $nome;
    public string $cognome;
    public string $targa;
    public ?string $email;
    public ?string $telefono;

    // Periodo prenotazione
    public string $data_inizio; // DATETIME
    public string $data_fine;   // DATETIME

    // Stato prenotazione (attiva, annullata, scaduta, completata)
    public string $stato;

    // Metadati
    public ?float $importo_totale;
    public ?string $note;
    public string $created_at;
    public string $updated_at;
    public ?string $annullata_at;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                // Cast per l'importo se presente, essendo DECIMAL nel DB
                if ($key === 'importo_totale' && $value !== null) {
                    $this->$key = (float)$value;
                } else {
                    $this->$key = $value;
                }
            }
        }
    }
}