<?php
namespace parkingo\Entity;

use parkingo\Enum\StatoPostoAuto;

class PostoAuto
{
    public int $id;
    public int $piano;
    public string $codice;
    public int $parcheggio_id;
    public StatoPostoAuto $stato; // OCCUPATO, LIBERO, NON DISPONIBILE

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }
}
