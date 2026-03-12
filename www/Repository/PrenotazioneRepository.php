<?php
namespace parkingo\Repository;

use DateTime;
use Exception;
use parkingo\Entity\Prenotazione;
use parkingo\Utils\Connection;
use PDO;

class PrenotazioneRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Connection::get();
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
     * @throws Exception
     */
    public function create(Prenotazione $data): Prenotazione
    {
        // 1. Genero il codice tramite stored procedure
        $stmt = $this->pdo->prepare("CALL genera_codice_prenotazione(@codice)");
        $stmt->execute();

        $result = $this->pdo->query("SELECT @codice AS codice")->fetch();
        $codice = $result['codice'];

        // 2. Recupero la tariffa oraria del parcheggio
        $stmt = $this->pdo->prepare("SELECT tariffa_oraria FROM parcheggi WHERE id = :id");
        $stmt->execute(['id' => $data->parcheggio_id]);
        $tariffa = $stmt->fetchColumn();

        if (!$tariffa) {
            throw new Exception("Parcheggio non trovato o tariffa mancante");
        }

        // 3. Calcolo delle ore tra inizio e fine
        $inizio = new DateTime($data->data_inizio);
        $fine   = new DateTime($data->data_fine);

        $diffOre = $inizio->diff($fine)->h + ($inizio->diff($fine)->days * 24);

        // 4. Calcolo importo totale
        $importoTotale = $diffOre * $tariffa;

        // 5. Preparo i parametri per l’INSERT
        $data->importo_totale = $importoTotale;
        $data->codice_prenotazione = $codice;

        // 6. Query di inserimento
        $sql = "INSERT INTO prenotazioni (
                codice_prenotazione, nome, cognome, targa, email, 
                telefono, parcheggio_id, data_inizio, data_fine, importo_totale
            ) VALUES (
                :codice_prenotazione, :nome, :cognome, :targa, :email, 
                :telefono, :parcheggio_id, :inizio, :fine, :importo_totale
            )";
        $ok = $this->pdo->prepare($sql)->execute($data->toArray());
        if (!$ok){
            throw new Exception("Inserimento della prenotazione non riuscito");
        }
        return $data;
    }



    /**
     * Aggiorna le date di una prenotazione (data_inizio, data_fine).
     * Ricalcola importo_totale in base alla nuova durata.
     */
    public function update(Prenotazione $data): bool {
        // Ricalcolo importo se vengono passate entrambe le date
        $extraSet = '';
        $binds = [':codice_prenotazione' => $data->codice_prenotazione];

        if ($data->data_inizio && $data->data_fine) {
            // Recupera tariffa oraria
            $stmt = $this->pdo->prepare("SELECT tariffa_oraria FROM parcheggi p JOIN prenotazioni pr ON pr.parcheggio_id = p.id WHERE pr.codice_prenotazione = :codice");
            $stmt->execute([':codice' => $data->codice_prenotazione]);
            $tariffa = (float) $stmt->fetchColumn();

            $inizio  = new DateTime($data->data_inizio);
            $fine    = new DateTime($data->data_fine);
            $diffOre = $inizio->diff($fine)->h + ($inizio->diff($fine)->days * 24);
            $importo = $diffOre * $tariffa;

            $extraSet = "data_inizio = :data_inizio, data_fine = :data_fine, importo_totale = :importo_totale,";
            $binds[':data_inizio']    = $data->data_inizio;
            $binds[':data_fine']      = $data->data_fine;
            $binds[':importo_totale'] = $importo;
        }

        $sql = "UPDATE prenotazioni 
                SET {$extraSet}
                    stato = stato
                WHERE codice_prenotazione = :codice_prenotazione
                  AND stato = 'attiva'";

        // Se non ci sono campi da aggiornare oltre la data, aggiorna solo le date
        if (empty($extraSet)) {
            return false;
        }

        // Rimuovi la virgola finale prima di WHERE
        $sql = "UPDATE prenotazioni 
                SET data_inizio = :data_inizio,
                    data_fine   = :data_fine,
                    importo_totale = :importo_totale
                WHERE codice_prenotazione = :codice_prenotazione
                  AND stato = 'attiva'";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($binds);
        return $stmt->rowCount() > 0;
    }

    /**
     * Soft delete: imposta stato='annullata'.
     */
    public function delete(string $codice): bool
    {
        $sql = "UPDATE prenotazioni 
                SET stato = 'annullata' 
                WHERE codice_prenotazione = :codice
                  AND stato = 'attiva'";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['codice' => $codice]);
        return $stmt->rowCount() > 0;
    }
}