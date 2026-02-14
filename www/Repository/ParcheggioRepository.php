<?php
namespace parkingo\Repository;

use parkingo\Entity\Parcheggio;
use parkingo\Utils\Connection;
use PDO;

class ParcheggioRepository {

    private ?PDO $pdo = null;

    public function __construct()
    {
        $this->pdo = Connection::getInstance()->getConnection();
    }

    public function add(Parcheggio $parcheggio): bool
    {
        $sql = "INSERT INTO parcheggi (
                    nome,
                    indirizzo,
                    citta,
                    cap,
                    posti_totali,
                    tariffa_oraria,
                    orario_apertura,
                    orario_chiusura,
                    aperto_24h,
                    descrizione,

                ) VALUES (
                    :nome,
                    :indirizzo,
                    :citta,
                    :cap,
                    :posti_totali,
                    :tariffa_oraria,
                    :orario_apertura,
                    :orario_chiusura,
                    :aperto_24h,
                    :descrizione,
                )";

        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute([
            ':nome' => $parcheggio->nome,
            ':indirizzo' => $parcheggio->indirizzo,
            ':citta' => $parcheggio->citta,
            ':cap' => $parcheggio->cap,
            ':posti_totali' => $parcheggio->posti_totali,
            ':tariffa_oraria' => $parcheggio->tariffa_oraria,
            ':orario_apertura' => $parcheggio->orario_apertura,
            ':orario_chiusura' => $parcheggio->orario_chiusura,
            ':aperto_24h' => $parcheggio->aperto_24h ? 1 : 0,
            ':descrizione' => $parcheggio->descrizione,
            ':created_at' => $parcheggio->created_at,
            ':updated_at' => $parcheggio->updated_at,
        ]);
    }
}
