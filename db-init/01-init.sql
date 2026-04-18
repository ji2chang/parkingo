-- ============================================
-- DATABASE: Sistema Prenotazione Parcheggi
-- Versione compatibile MariaDB 10.11
-- ============================================
DROP DATABASE IF EXISTS parking_db;

-- Crea il database se non esiste
CREATE DATABASE IF NOT EXISTS parking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE parking_db;

-- ============================================
-- TABELLA: parcheggi
-- ============================================
DROP TABLE IF EXISTS chiusure_parcheggi;
DROP TABLE IF EXISTS parcheggi;
DROP TABLE IF EXISTS prenotazioni;
DROP TABLE IF EXISTS utenti;


CREATE TABLE parcheggi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    indirizzo VARCHAR(255) NOT NULL,
    citta VARCHAR(100) NOT NULL,
    cap VARCHAR(10),
    lat DECIMAL(9,6) NOT NULL
        CHECK (lat >= -90.000000 AND lat <= 90.000000),

    lng DECIMAL(9,6) NOT NULL
        CHECK (lng >= -180.000000 AND lng <= 180.000000),
    raggio FLOAT NOT NULL CHECK (raggio > 0),
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

CREATE TABLE utenti (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    nome_utente VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE,
    ruolo ENUM('User', 'ParkingAdmin', 'SystemAdmin') NOT NULL DEFAULT 'User', -- questo serve per gestire i permessi, lascia stare
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE auto (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    targa VARCHAR(20) NOT NULL UNIQUE,
    id_utente INT,
    FOREIGN KEY (id_utente) REFERENCES utenti(id)
);

CREATE TABLE servizi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE parcheggi_servizi (
    parcheggio_id INT NOT NULL,
    servizio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (parcheggio_id, servizio_id),
    FOREIGN KEY (parcheggio_id) REFERENCES parcheggi(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (servizio_id) REFERENCES servizi(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_parcheggio (parcheggio_id),
    INDEX idx_servizio (servizio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ============================================
-- TABELLA: prenotazioni
-- ============================================
CREATE TABLE prenotazioni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codice_prenotazione VARCHAR(21) NOT NULL UNIQUE COMMENT 'Codice univoco stile nanoid',
    parcheggio_id INT NOT NULL,
    
    -- Dati utente 
    id_utente INT not null,
    id_auto INT not null,
    
    -- Periodo prenotazione
    data_inizio DATETIME NOT NULL,
    data_fine DATETIME NOT NULL,
    
    -- Stato prenotazione
    stato ENUM('attiva', 'annullata', 'scaduta', 'completata') NOT NULL DEFAULT 'attiva',
    
    -- Metadati
    importo_totale DECIMAL(10,2) NULL COMMENT 'Calcolato o salvato',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    annullata_at TIMESTAMP,
    
    -- Chiavi esterne
    FOREIGN KEY (parcheggio_id) REFERENCES parcheggi(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_utente) REFERENCES utenti(id),
    FOREIGN KEY (id_auto) REFERENCES auto(id),
    
    -- Indici per performance
    INDEX idx_codice (codice_prenotazione),
    INDEX idx_parcheggio (parcheggio_id),
    INDEX idx_stato (stato),
    INDEX idx_utente (id_utente),
    INDEX idx_auto (id_auto),

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

    DECLARE caratteri VARCHAR(64)
        CHARACTER SET utf8
        COLLATE utf8_general_ci
        DEFAULT '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

    DECLARE lunghezza INT DEFAULT 21;
    DECLARE i INT;

    SET nuovo_codice = '' COLLATE utf8_general_ci;

    WHILE codice_esistente > 0 DO
        SET nuovo_codice = '' COLLATE utf8_general_ci;
        SET i = 0;

        WHILE i < lunghezza DO
            SET nuovo_codice = CONCAT(
                nuovo_codice,
                SUBSTRING(caratteri, FLOOR(1 + RAND() * 64), 1)
            );
            SET i = i + 1;
        END WHILE;

        SELECT COUNT(*) INTO codice_esistente
        FROM prenotazioni
        WHERE codice_prenotazione = nuovo_codice;
    END WHILE;
END//


-- Function to calculate available parking spots in a given time period
DROP FUNCTION IF EXISTS posti_disponibili//
CREATE FUNCTION posti_disponibili(
    p_parcheggio_id INT,
    p_data_inizio DATE,
    p_orario_inizio TIME,
    p_data_fine DATE,
    p_orario_fine TIME
) RETURNS INT
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE p_posti_totali INT DEFAULT 0;
    DECLARE posti_occupati INT DEFAULT 0;
    DECLARE p_start DATETIME;
    DECLARE p_end DATETIME;

    SET p_start = TIMESTAMP(p_data_inizio, p_orario_inizio);
    SET p_end   = TIMESTAMP(p_data_fine, p_orario_fine);

    -- Get total parking spots for this parking lot
    SELECT COALESCE(posti_totali, 0) INTO p_posti_totali
    FROM parcheggi
    WHERE id = p_parcheggio_id;
    -- If parking lot not found, return 0
    IF p_posti_totali <= 0 THEN
        RETURN 0;
    END IF;

    -- Count bookings that overlap with the requested time period
    -- Non-overlap condition: booking_end <= request_start OR booking_start >= request_end
    SELECT COUNT(*) INTO posti_occupati
    FROM prenotazioni
    WHERE parcheggio_id = p_parcheggio_id
      AND stato != 'annullata'
      AND NOT (data_fine <= p_start OR data_inizio >= p_end);

    -- Return available spots, but ensure it's not negative
    RETURN p_posti_totali - posti_occupati;
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
        DATE(NEW.data_inizio),
        TIME(NEW.data_inizio),
        DATE(NEW.data_fine),
        TIME(NEW.data_fine)
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

-- Vista per statistiche globali parcheggi
-- Returns global statistics: total bookings, active, cancelled, total spend, average cost
DROP VIEW IF EXISTS statistiche_parcheggi;
CREATE VIEW statistiche_parcheggi AS
SELECT 
    COUNT(*) as totale,
    SUM(CASE WHEN stato = 'attiva' THEN 1 ELSE 0 END) as attive,
    SUM(CASE WHEN stato = 'annullata' THEN 1 ELSE 0 END) as cancellate,
    COALESCE(SUM(CASE WHEN stato != 'annullata' THEN importo_totale ELSE 0 END), 0) as spesa_totale,
    ROUND(COALESCE(AVG(CASE WHEN stato != 'annullata' THEN importo_totale END), 0), 2) as costo_medio
FROM prenotazioni;

-- Vista per prenotazioni attive con dettagli parcheggio
DROP VIEW IF EXISTS prenotazioni_attive_dettagli;
CREATE VIEW prenotazioni_attive_dettagli AS
SELECT 
    pr.codice_prenotazione,
    u.nome,
    u.cognome,
    a.targa,
    pr.data_inizio,
    pr.data_fine,
    pr.importo_totale,
    p.nome AS parcheggio_nome,
    p.indirizzo,
    p.citta,
    TIMESTAMPDIFF(HOUR, pr.data_inizio, pr.data_fine) AS ore_prenotate
FROM prenotazioni pr
JOIN parcheggi p ON pr.parcheggio_id = p.id
JOIN utenti u ON pr.id_utente = u.id
JOIN auto a ON pr.id_auto = a.id
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