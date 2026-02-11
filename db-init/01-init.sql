-- Script di inizializzazione del database parking
-- Questo script viene eseguito automaticamente al primo avvio di MariaDB

-- Crea il database se non esiste
CREATE DATABASE IF NOT EXISTS parking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usa il database
USE parking_db;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_accesso TIMESTAMP NULL,
    attivo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_data_registrazione (data_registrazione)
);

CREATE TABLE IF NOT EXISTS reservation(
    id INT AUTO_INCREMENT PRIMARY KEY,
    parking_lot_id INT NOT NULL,
    user_id INT NOT NULL,
    license_plate VARCHAR(10) NOT NULL,
    status ENUM('ACTIVE','CANCELLED','EXPIRED') NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL check (end_time > start_time),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS parking_lot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_space (
    id INT AUTO_INCREMENT PRIMARY KEY,
    floor INT NOT NULL,
    code CHAR(4) NOT NULL,
    parking_lot_id INT NOT NULL,
    status ENUM('OCCUPIED', 'FREE', 'NOT AVAILABLE') NOT NULL,
    CONSTRAINT fk_parking FOREIGN KEY (parking_lot_id) REFERENCES parking_lot(id),
);

CREATE INDEX idx_parking_status
ON parking_space (parking_lot_id, status);