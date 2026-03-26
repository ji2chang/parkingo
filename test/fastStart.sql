-- =====================================================
-- 1. Inserisci dati servizi
-- =====================================================
INSERT INTO servizi (nome) VALUES
('Coperto'),
('Scoperto'),
('Videosorveglianza'),
('Accesso H24'),
('Colonnine EV'),
('Valet');

-- =====================================================
-- 2. Inserisci dati parcheggi (20 parcheggi)
-- =====================================================
INSERT INTO parcheggi (nome, indirizzo, citta, cap, lat, lng, raggio, posti_totali, tariffa_oraria, orario_apertura, orario_chiusura, aperto_24h, descrizione) VALUES
('Parcheggio Stazione Centrale', 'Via Giovanni Battista Pirelli, 1', 'Milano', '20124', 45.485600, 9.203700, 50, 800, 3.50, '00:00:00', '23:59:59', 1, 'Parcheggio centrale vicino alla stazione'),
('Garage Duomo', 'Via Albricci, 8', 'Milano', '20122', 45.464200, 9.190400, 30, 250, 4.00, '07:00:00', '22:00:00', 0, 'Garage sotterraneo a pochi passi dal Duomo'),
('Saba San Siro', 'Via Caprilli, 12', 'Milano', '20148', 45.478200, 9.125800, 80, 1200, 2.50, '06:30:00', '23:30:00', 0, 'Parcheggio multipiano a servizio dello stadio'),
('Parcheggio Borghese', 'Viale del Galoppatoio, 33', 'Roma', '00197', 41.912300, 12.485200, 40, 400, 2.00, '08:00:00', '20:00:00', 0, 'Parcheggio all''aperto all''interno di Villa Borghese'),
('Termini Parking', 'Via Giolitti, 36', 'Roma', '00185', 41.902200, 12.502100, 35, 350, 3.00, '00:00:00', '23:59:59', 1, 'Parcheggio 24h a pochi minuti dalla Stazione Termini'),
('Piazza Navona Car Park', 'Corso del Rinascimento, 8', 'Roma', '00186', 41.899100, 12.473800, 20, 120, 4.50, '09:00:00', '21:00:00', 0, 'Piccolo parcheggio sotterraneo nel centro storico'),
('Garage Centrale Napoli', 'Via Galileo Ferraris, 10', 'Napoli', '80142', 40.855400, 14.280200, 45, 500, 2.00, '07:00:00', '23:00:00', 0, 'Parcheggio coperto vicino alla stazione centrale'),
('Parcheggio Mergellina', 'Via Mergellina, 34', 'Napoli', '80122', 40.820500, 14.216700, 25, 180, 1.80, '08:00:00', '22:00:00', 0, 'Parcheggio fronte mare'),
('Torino Centro Parking', 'Corso Inghilterra, 3', 'Torino', '10138', 45.067400, 7.665400, 60, 600, 2.20, '07:30:00', '23:30:00', 0, 'Parcheggio multipiano a 10 minuti dal centro'),
('Parcheggio Fiera Bologna', 'Piazza della Costituzione, 1', 'Bologna', '40128', 44.509300, 11.358200, 90, 1500, 1.50, '00:00:00', '23:59:59', 1, 'Ampio parcheggio a servizio del quartiere fieristico'),
('Park Firenze Santa Maria', 'Via Luigi Alamanni, 25', 'Firenze', '50123', 43.776500, 11.247900, 30, 300, 3.00, '06:00:00', '22:00:00', 0, 'Parcheggio a pochi passi dalla stazione'),
('Parcheggio Alberghi Genova', 'Via Milano, 47', 'Genova', '16126', 44.406300, 8.921800, 40, 220, 2.50, '08:00:00', '20:30:00', 0, 'Parcheggio coperto vicino al terminal crociere'),
('Parking Porto Antico', 'Ponte Spinola, 2', 'Genova', '16128', 44.409600, 8.929500, 35, 280, 2.80, '07:00:00', '23:00:00', 0, 'Parcheggio sotterraneo nel cuore del Porto Antico'),
('Saba San Giovanni', 'Via Libetta, 1', 'Roma', '00178', 41.852200, 12.566500, 55, 700, 1.90, '07:30:00', '21:30:00', 0, 'Parcheggio di quartiere con tariffe economiche'),
('Parcheggio Ospedale Careggi', 'Viale Morgagni, 85', 'Firenze', '50134', 43.799100, 11.255300, 50, 550, 1.20, '06:30:00', '20:30:00', 0, 'Parcheggio a servizio dell''area ospedaliera'),
('Parking San Luca', 'Via Saragozza, 100', 'Bologna', '40135', 44.492100, 11.331200, 45, 320, 2.00, '08:00:00', '22:00:00', 0, 'Parcheggio coperto vicino al centro storico'),
('Autosilo Verona Arena', 'Via Dietro Anfiteatro, 6', 'Verona', '37121', 45.438400, 10.994700, 25, 180, 3.50, '07:00:00', '21:00:00', 0, 'Parcheggio a pochi passi dall''Arena'),
('Parcheggio Lungomare Bari', 'Lungomare Nazario Sauro, 1', 'Bari', '70121', 41.125500, 16.869800, 60, 450, 1.50, '00:00:00', '23:59:59', 1, 'Parcheggio sul lungomare con vista mare'),
('Parking Aeroporto Catania', 'Via Fontanarossa, 20', 'Catania', '95121', 37.466800, 15.067900, 100, 1200, 2.20, '00:00:00', '23:59:59', 1, 'Parcheggio aeroportuale 24h'),
('Parcheggio Centro Pescara', 'Corso Umberto I, 150', 'Pescara', '65122', 42.464300, 14.214700, 35, 280, 1.80, '08:00:00', '22:00:00', 0, 'Parcheggio coperto nel centro città');

-- =====================================================
-- 3. Inserisci dati associativi parcheggi_servizi (assegnazione servizi per ogni parcheggio)
-- =====================================================

-- Ottieni ID servizi
SET @coperto = (SELECT id FROM servizi WHERE nome = 'Coperto');
SET @scoperto = (SELECT id FROM servizi WHERE nome = 'Scoperto');
SET @videosorveglianza = (SELECT id FROM servizi WHERE nome = 'Videosorveglianza');
SET @accesso_h24 = (SELECT id FROM servizi WHERE nome = 'Accesso H24');
SET @colonnine_ev = (SELECT id FROM servizi WHERE nome = 'Colonnine EV');
SET @valet = (SELECT id FROM servizi WHERE nome = 'Valet');

-- Parcheggio Stazione Centrale (id 1)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(1, @coperto), (1, @videosorveglianza), (1, @accesso_h24), (1, @colonnine_ev);

-- Garage Duomo (id 2)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(2, @coperto), (2, @videosorveglianza), (2, @colonnine_ev), (2, @valet);

-- Saba San Siro (id 3)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(3, @coperto), (3, @videosorveglianza), (3, @colonnine_ev);

-- Parcheggio Borghese (id 4)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(4, @scoperto), (4, @videosorveglianza);

-- Termini Parking (id 5)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(5, @coperto), (5, @videosorveglianza), (5, @accesso_h24), (5, @colonnine_ev), (5, @valet);

-- Piazza Navona Car Park (id 6)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(6, @coperto), (6, @videosorveglianza), (6, @valet);

-- Garage Centrale Napoli (id 7)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(7, @coperto), (7, @videosorveglianza), (7, @colonnine_ev);

-- Parcheggio Mergellina (id 8)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(8, @scoperto), (8, @videosorveglianza);

-- Torino Centro Parking (id 9)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(9, @coperto), (9, @videosorveglianza), (9, @colonnine_ev), (9, @valet);

-- Parcheggio Fiera Bologna (id 10)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(10, @scoperto), (10, @videosorveglianza), (10, @accesso_h24), (10, @colonnine_ev);

-- Park Firenze Santa Maria (id 11)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(11, @coperto), (11, @videosorveglianza);

-- Parcheggio Alberghi Genova (id 12)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(12, @coperto), (12, @videosorveglianza);

-- Parking Porto Antico (id 13)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(13, @coperto), (13, @videosorveglianza), (13, @colonnine_ev), (13, @valet);

-- Saba San Giovanni (id 14)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(14, @coperto), (14, @videosorveglianza);

-- Parcheggio Ospedale Careggi (id 15)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(15, @scoperto), (15, @videosorveglianza), (15, @colonnine_ev);

-- Parking San Luca (id 16)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(16, @coperto), (16, @videosorveglianza), (16, @valet);

-- Autosilo Verona Arena (id 17)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(17, @coperto), (17, @videosorveglianza), (17, @accesso_h24);

-- Parcheggio Lungomare Bari (id 18)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(18, @scoperto), (18, @videosorveglianza), (18, @accesso_h24);

-- Parking Aeroporto Catania (id 19)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(19, @scoperto), (19, @videosorveglianza), (19, @accesso_h24), (19, @colonnine_ev);

-- Parcheggio Centro Pescara (id 20)
INSERT INTO parcheggi_servizi (parcheggio_id, servizio_id) VALUES
(20, @coperto), (20, @videosorveglianza);