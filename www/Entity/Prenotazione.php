<?php
namespace parkingo\Entity;

class Prenotazione
{
    public ?int    $id                   = null;
    public ?string $codice_prenotazione  = null;
    public ?int    $parcheggio_id        = null;
    public ?string $nome                 = null;
    public ?string $cognome              = null;
    public ?string $targa                = null;
    public ?string $email                = null;
    public ?string $telefono             = null;
    public ?string $data_inizio          = null;
    public ?string $data_fine            = null;
    public ?string $stato                = 'attiva';
    public ?float  $importo_totale       = null;
    public ?string $note                 = null;
    public ?string $created_at           = null;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function toArray(): array
    {
        return [
            ':codice_prenotazione' => $this->codice_prenotazione,
            ':parcheggio_id'       => $this->parcheggio_id,
            ':nome'                => $this->nome,
            ':cognome'             => $this->cognome,
            ':targa'               => $this->targa,
            ':email'               => $this->email,
            ':telefono'            => $this->telefono,
            ':inizio'              => $this->data_inizio,
            ':fine'                => $this->data_fine,
            ':importo_totale'      => $this->importo_totale,
        ];
    }

    public function toResponse(): array
    {
        return [
            'codice_prenotazione' => $this->codice_prenotazione,
            'parcheggio_id'       => $this->parcheggio_id,
            'nome'                => $this->nome,
            'cognome'             => $this->cognome,
            'targa'               => $this->targa,
            'email'               => $this->email,
            'telefono'            => $this->telefono,
            'data_inizio'         => $this->data_inizio,
            'data_fine'           => $this->data_fine,
            'importo_totale'      => $this->importo_totale,
            'stato'               => $this->stato,
        ];
    }
}