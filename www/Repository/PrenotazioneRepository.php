<?php
namespace parkingo\Repository;

use Connections;
use PDO;

class PrenotazioneRepository {
    private $pdo;

    public function __construct() {
        $this->pdo = Connections::get();
    }

    /**
     * Recupera una prenotazione come oggetto standard.
     * Corretto l'ordine del JOIN e aggiunto l'alias per il nome del parcheggio.
     */
    public function getByCodice(string $codice) {
        $sql = "SELECT p.*, pa.nome as nome_parcheggio 
                FROM prenotazioni p 
                JOIN parcheggi pa ON p.parcheggio_id = pa.id 
                WHERE p.codice_prenotazione = :codice";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['codice' => $codice]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Crea una nuova prenotazione.
     * Corrisponde ai campi NOT NULL definiti nel file 01-init.sql.
     */
    public function create(array $data): bool {
        $sql = "INSERT INTO prenotazioni (
                    codice_prenotazione, nome, cognome, targa, email, 
                    telefono, parcheggio_id, data_inizio, data_fine, importo_totale
                ) VALUES (
                    :codice, :nome, :cognome, :targa, :email, 
                    :telefono, :parcheggio_id, :inizio, :fine, :importo
                )";

        return $this->pdo->prepare($sql)->execute($data);
    }

    /**
     * Aggiorna lo stato o i dettagli di una prenotazione.
     * Utilizza il codice_prenotazione come identificativo univoco.
     */
    public function update(string $codice, array $data): bool {
        $sql = "UPDATE prenotazioni 
                SET email = :email, 
                    telefono = :telefono, 
                    stato = :stato, 
                    note = :note 
                WHERE codice_prenotazione = :codice";

        $data['codice'] = $codice;
        return $this->pdo->prepare($sql)->execute($data);
    }

    /**
     * Elimina una prenotazione.
     */
    public function delete(string $codice): bool {
        $sql = "DELETE FROM prenotazioni WHERE codice_prenotazione = :codice";
        return $this->pdo->prepare($sql)->execute(['codice' => $codice]);
    }
}