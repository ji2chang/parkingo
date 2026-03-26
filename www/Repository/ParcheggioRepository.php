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
            ':lat'             => $parcheggio->lat,    
            ':lng'             => $parcheggio->lng,    
            ':raggio'          => $parcheggio->raggio, 
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

    public function ottieniTuttiParcheggi(array $params = []): array
    {
        $params = (array) $params;
        $useAvailability = !empty($params['data_inizio']) && 
                          !empty($params['orario_inizio']) && 
                          !empty($params['data_fine']) && 
                          !empty($params['orario_fine']);
        if (!$useAvailability) {
            throw new InvalidArgumentException("Per calcolare la disponibilità, è necessario fornire data_inizio, orario_inizio, data_fine e orario_fine");
        }
        // Costruisci SQL con o senza calcolo disponibilità
        $availabilitySQL = "posti_disponibili(
                            p.id, 
                            :data_inizio, :orario_inizio, 
                            :data_fine, :orario_fine
                    ) AS posti_disponibili";

        $sql = "SELECT p.*,
                    (SELECT GROUP_CONCAT(DISTINCT s.nome ORDER BY s.nome SEPARATOR ',')
                            FROM parcheggi_servizi ps
                            JOIN servizi s ON ps.servizio_id = s.id
                            WHERE ps.parcheggio_id = p.id) AS servizi_disponibili,
                    {$availabilitySQL}
                FROM parcheggi p
                WHERE 1=1";

        $binds = [];
        
        $binds[':data_inizio'] = $params['data_inizio'];
        $binds[':orario_inizio'] = $params['orario_inizio'];
        $binds[':data_fine'] = $params['data_fine'];
        $binds[':orario_fine'] = $params['orario_fine'];

        // --- Filtri opzionali ---
        if (!empty($params['query'])) {
            $sql .= " AND (p.nome LIKE :query_nome OR p.indirizzo LIKE :query_indirizzo)";
            $binds[':query_nome'] = '%' . $params['query'] . '%';
            $binds[':query_indirizzo'] = '%' . $params['query'] . '%';
        }

        if (!empty($params['citta'])) {
            $sql .= " AND p.citta = :citta";
            $binds[':citta'] = $params['citta'];
        }

        if (!empty($params['servizi'])) {
            $serviceList = is_string($params['servizi'])
                ? array_map('trim', explode(',', $params['servizi']))
                : $params['servizi'];

            if (!empty($serviceList)) {
                $placeholders = [];
                foreach ($serviceList as $index => $service) {
                    $placeholder = ":servizio_{$index}";
                    $placeholders[] = $placeholder;
                    $binds[$placeholder] = $service;
                }

                $sql .= " AND p.id IN (
                            SELECT parcheggio_id
                            FROM parcheggi_servizi ps2
                            JOIN servizi s2 ON ps2.servizio_id = s2.id
                            WHERE s2.nome IN (" . implode(', ', $placeholders) . ")
                            GROUP BY parcheggio_id
                            HAVING COUNT(DISTINCT s2.nome) = :servizio_count
                        )";
                $binds[':servizio_count'] = count($serviceList);
            }
        }

        if (!empty($params['prezzo_max'])) {
            $sql .= " AND p.tariffa_oraria <= :prezzo_max";
            $binds[':prezzo_max'] = (float) $params['prezzo_max'];
        }

        if (isset($params['aperto_24h']) && $params['aperto_24h'] !== '') {
            $sql .= " AND p.aperto_24h = :aperto_24h";
            $binds[':aperto_24h'] = (int) $params['aperto_24h'];
        }

        // --- Ordinamento ---
        $orderBy = 'p.tariffa_oraria ASC';
        if (!empty($params['order_by'])) {
            switch ($params['order_by']) {
                case 'prezzo_asc':  $orderBy = 'p.tariffa_oraria ASC'; break;
                case 'prezzo_desc': $orderBy = 'p.tariffa_oraria DESC'; break;
                case 'posti_asc':   $orderBy = 'p.posti_totali ASC'; break;
                case 'posti_desc':  $orderBy = 'p.posti_totali DESC'; break;
                case 'nome_asc':    $orderBy = 'p.nome ASC'; break;
            }
        }
        $sql .= " ORDER BY {$orderBy}";

        // --- Limit / Offset ---
        if (!empty($params['limit'])) {
            $sql .= " LIMIT :limit";
            $binds[':limit'] = (int) $params['limit'];

            if (!empty($params['offset'])) {
                $sql .= " OFFSET :offset";
                $binds[':offset'] = (int) $params['offset'];
            }
        }
        // echo $sql;
        // --- Esecuzione query ---
        $stmt = $this->pdo->prepare($sql);
        foreach ($binds as $key => $value) {
            if (strpos($key, ':limit') !== false || strpos($key, ':offset') !== false || is_int($value)) {
                $stmt->bindValue($key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key, $value, PDO::PARAM_STR);
            }
        }
        $stmt->execute();
        $parcheggi = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $parcheggi;
    }

    public function ottieniParcheggioById(int $id): ?array {
        $sql = "SELECT * FROM parcheggi WHERE id = :id LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function getAvailability(int $id, array $params): ?array
    {
        // Verifica che il parcheggio esista
        $check = $this->pdo->prepare(
            "SELECT id, posti_totali, orario_apertura, orario_chiusura 
            FROM parcheggi 
            WHERE id = :id"
        );
        $check->execute([':id' => $id]);
        $parcheggio = $check->fetch(PDO::FETCH_ASSOC);

        if (!$parcheggio) {
            return null;
        }

        // Controllo parametri obbligatori
        foreach (['data_inizio', 'orario_inizio', 'data_fine', 'orario_fine'] as $key) {
            if (empty($params[$key])) {
                throw new InvalidArgumentException("Parametro mancante: $key");
            }
        }

        $data_inizio   = $params['data_inizio'];
        $orario_inizio = $params['orario_inizio'];
        $data_fine     = $params['data_fine'];
        $orario_fine   = $params['orario_fine'];

        // Chiamata alla funzione MySQL aggiornata
        $stmt = $this->pdo->prepare(
            "SELECT posti_disponibili(
                :id, 
                :data_inizio, :orario_inizio, 
                :data_fine, :orario_fine
            ) AS disponibili"
        );

        $stmt->execute([
            ':id'             => $id,
            ':data_inizio'    => $data_inizio,
            ':orario_inizio'  => $orario_inizio,
            ':data_fine'      => $data_fine,
            ':orario_fine'    => $orario_fine,
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