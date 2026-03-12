<?php

namespace parkingo\Repository;

use parkingo\Utils\Connection;
use PDO;

/**
 * AnalyticsRepository
 * Gestisce la logica di estrazione dati statistici per il sistema parcheggi.
 */
class AnalyticsRepository {
        private PDO $pdo;

    public function __construct() {
        $this->pdo = Connection::get();
    }
    /**
     * GET /api/analytics
     * Ritorna dati statistici globali: ricavi, occupazione media e conteggi stati.
     */
    public function getGlobalStats() {
        $sql = "SELECT 
                    COUNT(*) as totale_prenotazioni,
                    SUM(CASE WHEN stato = 'completata' THEN importo_totale ELSE 0 END) as ricavi_totali,
                    SUM(CASE WHEN stato = 'annullata' THEN 1 ELSE 0 END) as totale_annullate,
                    (SELECT COUNT(*) FROM parcheggi) as totale_parcheggi,
                    (SELECT AVG(posti_totali) FROM parcheggi) as media_posti_per_struttura
                FROM prenotazioni";

        $stmt = $this->pdo->query($sql);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        // Calcolo tasso di conversione/completamento
        $stats['tasso_completamento'] = $stats['totale_prenotazioni'] > 0 
            ? round(($stats['totale_prenotazioni'] - $stats['totale_annullate']) / $stats['totale_prenotazioni'] * 100, 2) 
            : 0;

        return $stats;
    }

    /**
     * GET /api/analytics/heatmap
     * Ritorna la densità di prenotazioni per giorno della settimana e ora.
     * Utile per visualizzare quando i parcheggi sono più carichi.
     */
    public function getHeatmapData() {
        // Raggruppiamo per giorno della settimana (1=Dom, 7=Sab in MariaDB) e ora
        $sql = "SELECT 
                    DAYOFWEEK(data_inizio) as giorno_settimana,
                    HOUR(data_inizio) as ora_giorno,
                    COUNT(*) as volume_prenotazioni
                FROM prenotazioni
                WHERE stato != 'annullata'
                GROUP BY giorno_settimana, ora_giorno
                ORDER BY giorno_settimana, ora_giorno";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Metodo Extra: Performance per Parcheggio
     * Sfrutta la VIEW 'statistiche_parcheggi' definita nel tuo SQL
     */
    public function getParkingPerformance() {
        $sql = "SELECT * FROM statistiche_parcheggi ORDER BY ricavi_totali DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}