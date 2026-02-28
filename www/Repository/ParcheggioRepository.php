<?php
namespace parkingo\Repository;

use parkingo\Entity\Parcheggio;
use parkingo\Utils\Connection;
use PDO;

class ParcheggioRepository {

    private ?PDO $pdo;

    public function __construct()
    {
        $this->pdo = Connection::get();
    }

    public function aggiungiParcheggio(Parcheggio $parcheggio): ?Parcheggio {
        // Query aggiornata con i campi mancanti: lat, lng, raggio
        $sql = "INSERT INTO parcheggi (
                    nome, indirizzo, citta, cap, 
                    lat, lng, raggio, 
                    posti_totali, tariffa_oraria, 
                    orario_apertura, orario_chiusura, 
                    aperto_24h, descrizione
                ) VALUES (
                    :nome, :indirizzo, :citta, :cap, 
                    :lat, :lng, :raggio, 
                    :posti_totali, :tariffa_oraria, 
                    :orario_apertura, :orario_chiusura, 
                    :aperto_24h, :descrizione
                )";

        $stmt = $this->pdo->prepare($sql);

        $success = $stmt->execute([
            ':nome'            => $parcheggio->nome,
            ':indirizzo'       => $parcheggio->indirizzo,
            ':citta'           => $parcheggio->citta,
            ':cap'             => $parcheggio->cap,
            ':lat'             => $parcheggio->lat,    // Aggiunto
            ':lng'             => $parcheggio->lng,    // Aggiunto
            ':raggio'          => $parcheggio->raggio, // Aggiunto
            ':posti_totali'    => $parcheggio->posti_totali,
            ':tariffa_oraria'  => $parcheggio->tariffa_oraria,
            ':orario_apertura' => $parcheggio->orario_apertura,
            ':orario_chiusura' => $parcheggio->orario_chiusura,
            ':aperto_24h'      => $parcheggio->aperto_24h ? 1 : 0,
            ':descrizione'     => $parcheggio->descrizione,
        ]);

        if (!$success) {
            return null;
        }

        $parcheggio->id = (int)$this->pdo->lastInsertId();
        return $parcheggio;
    }

    public function ottieniTuttiParcheggi(): array {
        $sql = "SELECT * FROM parcheggi";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $parcheggi = [];

        foreach ($rows as $row) {
            // Assicurati che il costruttore di Parcheggio accetti l'array $row
            $parcheggi[] = new Parcheggio($row);
        }

        return $parcheggi;
    }

    public function ottieniParcheggioById(int $id): ?Parcheggio {
        $sql = "SELECT * FROM parcheggi WHERE id = :id LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return new Parcheggio($row);
    }
}