<?php
namespace parkingo\Entity;
use ArrayAccess;

class Parcheggio implements \ArrayAccess
{
    use ArrayAccessible;
    public int $id;
    public string $nome;
    public string $indirizzo;
    public string $citta;
    public ?string $cap;
    public int $posti_totali;
    public float $tariffa_oraria;
    public string $orario_apertura;
    public string $orario_chiusura;
    public bool $aperto_24h;
    public ?string $descrizione;
    public string $created_at;
    public string $updated_at;

    // Posizione geografica
    public ?float $lat;
    public ?float $lng;

    // Caratteristiche
    public bool $al_chiuso;
    public bool $elettrico;
    public bool $disabili;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }
}