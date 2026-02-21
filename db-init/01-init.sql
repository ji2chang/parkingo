-- ============================================
-- DATABASE: Sistema Prenotazione Parcheggi
-- Versione compatibile MariaDB 10.11
-- ============================================

-- Crea il database se non esiste
CREATE DATABASE IF NOT EXISTS parking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE parking_db;

-- ============================================
-- TABELLA: parcheggi
-- ============================================
DROP TABLE IF EXISTS chiusure_parcheggi;
DROP TABLE IF EXISTS parcheggi;
DROP TABLE IF EXISTS prenotazioni;


CREATE TABLE parcheggi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    indirizzo VARCHAR(255) NOT NULL,
    citta VARCHAR(100) NOT NULL,
    cap VARCHAR(10),
    posti_totali INT NOT NULL,
    tariffa_oraria DECIMAL(5,2) NOT NULL COMMENT 'Tariffa in euro per ora',
    orario_apertura TIME NOT NULL DEFAULT '00:00:00',
    orario_chiusura TIME NOT NULL DEFAULT '23:59:59',
    aperto_24h BOOLEAN DEFAULT FALSE,
    descrizione TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_citta (citta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABELLA: prenotazioni
-- ============================================
CREATE TABLE prenotazioni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codice_prenotazione VARCHAR(21) NOT NULL UNIQUE COMMENT 'Codice univoco stile nanoid',
    parcheggio_id INT NOT NULL,
    
    -- Dati utente (no autenticazione)
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    targa VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL COMMENT 'Opzionale per conferme',
    telefono VARCHAR(20) NULL,
    
    -- Periodo prenotazione
    data_inizio DATETIME NOT NULL,
    data_fine DATETIME NOT NULL,
    
    -- Stato prenotazione
    stato ENUM('attiva', 'annullata', 'scaduta', 'completata') NOT NULL DEFAULT 'attiva',
    
    -- Metadati
    importo_totale DECIMAL(10,2) NULL COMMENT 'Calcolato o salvato',
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    annullata_at TIMESTAMP NULL,
    
    -- Chiavi esterne
    FOREIGN KEY (parcheggio_id) REFERENCES parcheggi(id) ON DELETE RESTRICT,
    
    -- Indici per performance
    INDEX idx_codice (codice_prenotazione),
    INDEX idx_parcheggio (parcheggio_id),
    INDEX idx_stato (stato),
    INDEX idx_periodo (data_inizio, data_fine),
    INDEX idx_targa (targa),
    
    -- Vincoli (rimosso CURRENT_TIMESTAMP dal CHECK per compatibilità)
    CONSTRAINT chk_periodo CHECK (data_fine > data_inizio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABELLA: chiusure_parcheggi (opzionale)
-- Per gestire giorni/periodi di chiusura
-- ============================================
CREATE TABLE chiusure_parcheggi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parcheggio_id INT NOT NULL,
    data_inizio DATETIME NOT NULL,
    data_fine DATETIME NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parcheggio_id) REFERENCES parcheggi(id) ON DELETE CASCADE,
    INDEX idx_parcheggio_periodo (parcheggio_id, data_inizio, data_fine)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS posti_auto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piano INT NOT NULL,
    codice CHAR(4) NOT NULL,
    parcheggio_id INT NOT NULL,
    stato ENUM('OCCUPATO', 'LIBERO', 'NON DISPONIBILE') NOT NULL,
    CONSTRAINT fk_parcheggio FOREIGN KEY (parcheggio_id) REFERENCES parcheggi(id)
);

-- ============================================
-- STORED PROCEDURE UTILI
-- ============================================

-- Procedura per generare codice prenotazione univoco (stile nanoid - 21 caratteri)
DELIMITER //
DROP PROCEDURE IF EXISTS genera_codice_prenotazione//
CREATE PROCEDURE genera_codice_prenotazione(OUT nuovo_codice VARCHAR(21))
BEGIN
    DECLARE codice_esistente INT DEFAULT 1;

    -- Variabile con collation coerente con la tabella
    DECLARE caratteri VARCHAR(64)
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_general_ci
        DEFAULT '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

    DECLARE lunghezza INT DEFAULT 21;
    DECLARE i INT;

    -- Anche l'output deve avere la collation corretta
    SET nuovo_codice = '' COLLATE utf8mb4_general_ci;

    WHILE codice_esistente > 0 DO
            SET nuovo_codice = '' COLLATE utf8mb4_general_ci;
            SET i = 0;

            WHILE i < lunghezza DO
                    SET nuovo_codice = CONCAT(
                            nuovo_codice,
                            SUBSTRING(caratteri, FLOOR(1 + RAND() * 64), 1)
                                       );
                    SET i = i + 1;
                END WHILE;

            -- Nessun CONVERT: MariaDB gestisce correttamente la collation se le variabili sono coerenti
            SELECT COUNT(*) INTO codice_esistente
            FROM prenotazioni
            WHERE codice_prenotazione = nuovo_codice;
        END WHILE;
END//


-- Funzione per calcolare posti disponibili in un periodo
DROP FUNCTION IF EXISTS posti_disponibili//
CREATE FUNCTION posti_disponibili(
    p_parcheggio_id INT,
    p_data_inizio DATETIME,
    p_data_fine DATETIME
) RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE posti_totali INT;
    DECLARE posti_occupati INT;
    
    -- Recupera posti totali del parcheggio
    SELECT parcheggi.posti_totali INTO posti_totali
    FROM parcheggi
    WHERE id = p_parcheggio_id;
    
    -- Conta prenotazioni attive che si sovrappongono al periodo richiesto
    SELECT COUNT(*) INTO posti_occupati
    FROM prenotazioni
    WHERE parcheggio_id = p_parcheggio_id
      AND stato = 'attiva'
      AND (
          (data_inizio < p_data_fine AND data_fine > p_data_inizio)
      );
    
    RETURN posti_totali - posti_occupati;
END //

-- Procedura per aggiornare automaticamente prenotazioni scadute
DROP PROCEDURE IF EXISTS aggiorna_prenotazioni_scadute//
CREATE PROCEDURE aggiorna_prenotazioni_scadute()
BEGIN
    UPDATE prenotazioni
    SET stato = 'scaduta',
        updated_at = CURRENT_TIMESTAMP
    WHERE stato = 'attiva'
      AND data_fine < CURRENT_TIMESTAMP;
      
    SELECT ROW_COUNT() as prenotazioni_aggiornate;
END //

-- Trigger per validare la disponibilità prima dell'inserimento
DROP TRIGGER IF EXISTS before_insert_prenotazione//
CREATE TRIGGER before_insert_prenotazione
BEFORE INSERT ON prenotazioni
FOR EACH ROW
BEGIN
    DECLARE disponibili INT;
    
    -- Verifica disponibilità
    SET disponibili = posti_disponibili(
        NEW.parcheggio_id,
        NEW.data_inizio,
        NEW.data_fine
    );
    
    IF disponibili <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Nessun posto disponibile per il periodo selezionato';
    END IF;
END //

DELIMITER ;

-- ============================================
-- VIEW UTILI
-- ============================================

-- Vista per statistiche parcheggi
DROP VIEW IF EXISTS statistiche_parcheggi;
CREATE VIEW statistiche_parcheggi AS
SELECT 
    p.id,
    p.nome,
    p.citta,
    p.posti_totali,
    COUNT(CASE WHEN pr.stato = 'attiva' THEN 1 END) as prenotazioni_attive,
    COUNT(CASE WHEN pr.stato = 'completata' THEN 1 END) as prenotazioni_completate,
    COUNT(CASE WHEN pr.stato = 'annullata' THEN 1 END) as prenotazioni_annullate,
    SUM(CASE WHEN pr.stato = 'completata' THEN pr.importo_totale ELSE 0 END) as ricavi_totali
FROM parcheggi p
LEFT JOIN prenotazioni pr ON p.id = pr.parcheggio_id
GROUP BY p.id, p.nome, p.citta, p.posti_totali;

-- Vista per prenotazioni attive con dettagli parcheggio
DROP VIEW IF EXISTS prenotazioni_attive_dettagli;
CREATE VIEW prenotazioni_attive_dettagli AS
SELECT 
    pr.codice_prenotazione,
    pr.nome,
    pr.cognome,
    pr.targa,
    pr.data_inizio,
    pr.data_fine,
    pr.importo_totale,
    p.nome as parcheggio_nome,
    p.indirizzo,
    p.citta,
    TIMESTAMPDIFF(HOUR, pr.data_inizio, pr.data_fine) as ore_prenotate
FROM prenotazioni pr
JOIN parcheggi p ON pr.parcheggio_id = p.id
WHERE pr.stato = 'attiva';

-- ============================================
-- GRANT PERMISSIONS per parking_user
-- ============================================
CREATE USER 'parking_user'@localhost IDENTIFIED BY 'parkingpassword';
GRANT ALL PRIVILEGES ON parking_db.* TO 'parking_user'@'%';
FLUSH PRIVILEGES;

-- Messaggio finale
SELECT 'Database parcheggi_db creato con successo!' as Messaggio;
SELECT COUNT(*) as Parcheggi_Inseriti FROM parcheggi;
SELECT COUNT(*) as Prenotazioni_Inserite FROM prenotazioni;