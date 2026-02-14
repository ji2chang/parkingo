<?php
namespace App\Entity;
class ChiusuraParcheggio
{
    public int $id;
    public int $parcheggio_id;
    public string $data_inizio;
    public string $data_fine;
    public ?string $motivo;
    public string $created_at;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }
}
