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

    public function aggiungiParcheggio(Parcheggio $parcheggio): ?Parcheggio{
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
                descrizione
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
                :descrizione
            )";

    $stmt = $this->pdo->prepare($sql);

    $success = $stmt->execute([
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
    ]);

    if (!$success) {
        return null;
    }

    // Recupero ID generato
    $parcheggio->id = $this->pdo->lastInsertId();

    return $parcheggio;
}
public function ottieniTuttiParcheggi(): array
{
    $sql = "SELECT * FROM parcheggi";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $parcheggi = [];

    foreach ($rows as $row) {
        $parcheggi[] = new Parcheggio(
            $row['nome'],
            $row['indirizzo'],
            $row['citta'],
            $row['cap'],
            $row['posti_totali'],
            $row['tariffa_oraria'],
            $row['orario_apertura'],
            $row['orario_chiusura'],
            (bool)$row['aperto_24h'],
            $row['descrizione']
        );
    }

    return $parcheggi;
}
public function ottieniParcheggioById(int $id): ?Parcheggio
{
    $sql = "SELECT * FROM parcheggi WHERE id = :id LIMIT 1";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([':id' => $id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        return null;
    }

    $parcheggio = new Parcheggio(
        $row['nome'],
        $row['indirizzo'],
        $row['citta'],
        $row['cap'],
        $row['posti_totali'],
        $row['tariffa_oraria'],
        $row['orario_apertura'],
        $row['orario_chiusura'],
        (bool)$row['aperto_24h'],
        $row['descrizione']
    );

    // assegno anche l'id
    $parcheggio->id = $row['id'];

    return $parcheggio;
}





}
