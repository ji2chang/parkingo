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
            $parcheggi[] = new Parcheggio($row);
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

        return new Parcheggio($row);
    }
    public function ottieniTutteLeCitta(): array
    {
        $stmt = $this->db->query('SELECT DISTINCT citta FROM parcheggi ORDER BY citta ASC');
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}