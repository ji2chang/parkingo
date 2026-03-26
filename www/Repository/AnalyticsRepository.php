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
     * Get PDO connection instance (for direct queries when needed)
     */
    public function getPdo(): PDO {
        return $this->pdo;
    }
    /**
     * GET /api/analytics
     * Ritorna dati statistici globali: ricavi, occupazione media e conteggi stati.
     */
    public function getGlobalStats() {
        $sql = "SELECT * FROM statistiche_parcheggi";

        $stmt = $this->pdo->query($sql);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
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

    /**
     * Get recent bookings with parking info
     * Returns latest bookings with their associated parking data
     */
    public function getRecentBookings($limit = 6) {
        $sql = "SELECT 
                    p.codice_prenotazione as code, 
                    p.created_at, 
                    p.importo_totale as importo,
                    p.stato,
                    pa.id as parcheggio_id,
                    pa.nome as parcheggio_nome
                FROM prenotazioni p
                JOIN parcheggi pa ON p.parcheggio_id = pa.id
                ORDER BY p.created_at DESC
                LIMIT :limit";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get parking usage statistics grouped by parking name
     * Returns count of bookings per parking, sorted by frequency
     */
    public function getParkingUsageStats() {
        $sql = "SELECT 
                    pa.id,
                    pa.nome,
                    COUNT(p.id) as prenotazioni
                FROM parcheggi pa
                LEFT JOIN prenotazioni p ON pa.id = p.parcheggio_id 
                    AND p.stato != 'annullata'
                GROUP BY pa.id, pa.nome
                ORDER BY prenotazioni DESC
                limit 10
                ";
        
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}