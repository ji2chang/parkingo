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
    public function ottieniTuttiParcheggi(array $params = []): array
    {
        $sql    = "SELECT * FROM parcheggi WHERE 1=1";
        $binds  = [];

        if (!empty($params['citta'])) {
            $sql .= " AND citta = :citta";
            $binds[':citta'] = $params['citta'];
        }
        if (isset($params['al_chiuso']) && $params['al_chiuso'] !== '') {
            $sql .= " AND al_chiuso = :al_chiuso";
            $binds[':al_chiuso'] = (int) $params['al_chiuso'];
        }
        if (isset($params['elettrico']) && $params['elettrico'] !== '') {
            $sql .= " AND elettrico = :elettrico";
            $binds[':elettrico'] = (int) $params['elettrico'];
        }
        if (isset($params['disabili']) && $params['disabili'] !== '') {
            $sql .= " AND disabili = :disabili";
            $binds[':disabili'] = (int) $params['disabili'];
        }
        if (!empty($params['prezzo_max'])) {
            $sql .= " AND tariffa_oraria <= :prezzo_max";
            $binds[':prezzo_max'] = (float) $params['prezzo_max'];
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($binds);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function ottieniParcheggioById(int $id): ?array
    {
        $sql = "SELECT * FROM parcheggi WHERE id = :id LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function getAvailability(int $id, array $params): ?array
    {
        // Verifica che il parcheggio esista
        $check = $this->pdo->prepare("SELECT id, posti_totali, orario_apertura, orario_chiusura FROM parcheggi WHERE id = :id");
        $check->execute([':id' => $id]);
        $parcheggio = $check->fetch(PDO::FETCH_ASSOC);

        if (!$parcheggio) {
            return null;
        }

        // Supporta sia ?data_inizio=&data_fine= che ?data=&orario_apertura=&orario_chiusura=
        if (!empty($params['data_inizio']) && !empty($params['data_fine'])) {
            $data_inizio = $params['data_inizio'];
            $data_fine   = $params['data_fine'];
        } elseif (!empty($params['data'])) {
            // Usa gli orari passati oppure quelli del parcheggio come default
            $apertura  = $params['orario_apertura']  ?? $parcheggio['orario_apertura'];
            $chiusura  = $params['orario_chiusura']  ?? $parcheggio['orario_chiusura'];
            $data_inizio = $params['data'] . ' ' . $apertura;
            $data_fine   = $params['data'] . ' ' . $chiusura;
        } else {
            // Nessuna data fornita: restituisce solo posti totali
            return [
                'parcheggio_id'     => $id,
                'posti_totali'      => (int) $parcheggio['posti_totali'],
                'posti_disponibili' => null,
            ];
        }

        $stmt = $this->pdo->prepare(
            "SELECT posti_disponibili(:id, :data_inizio, :data_fine) AS disponibili"
        );
        $stmt->execute([
            ':id'          => $id,
            ':data_inizio' => $data_inizio,
            ':data_fine'   => $data_fine,
        ]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'parcheggio_id'     => $id,
            'posti_totali'      => (int) $parcheggio['posti_totali'],
            'posti_disponibili' => (int) $row['disponibili'],
        ];
    }

    public function ottieniTutteLeCitta(): array
    {
        $stmt = $this->pdo->query('SELECT DISTINCT citta FROM parcheggi ORDER BY citta ASC');
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}