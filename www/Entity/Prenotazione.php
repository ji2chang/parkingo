<?php
namespace parkingo\Entity;

class Prenotazione implements \ArrayAccess
{
    use ArrayAccessible;

    public int $id;
    public string $codice_prenotazione;
    public int $parcheggio_id;
    public int $id_utente;
    public int $id_auto;

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
                if ($key === 'importo_totale' && $value !== null) {
                    $this->$key = (float)$value;
                } else {
                    $this->$key = $value;
                }
            }
        }
    }

    public function toArray(): array
    {
        return [
            ':codice_prenotazione' => $this->codice_prenotazione,
            ':parcheggio_id'       => $this->parcheggio_id,
            ':id_utente'           => $this->id_utente,
            ':id_auto'             => $this->id_auto,
            ':inizio'              => $this->data_inizio,
            ':fine'                => $this->data_fine,
            ':importo_totale'      => $this->importo_totale,
            ':note'                => $this->note,
        ];
    }

    public function toResponse(): array
    {
        return [
            'codice_prenotazione' => $this->codice_prenotazione,
            'parcheggio_id'       => $this->parcheggio_id,
            'id_utente'           => $this->id_utente,
            'id_auto'             => $this->id_auto,
            'data_inizio'         => $this->data_inizio,
            'data_fine'           => $this->data_fine,
            'importo_totale'      => $this->importo_totale,
            'stato'               => $this->stato,
            'note'                => $this->note,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
            'annullata_at'        => $this->annullata_at,
        ];
    }
}