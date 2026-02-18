# Parkingo - Sistema Gestione Parcheggi

Parkingo è una REST API costruita con PHP (Slim Framework) e MariaDB per gestire le prenotazioni dei parcheggi. Il sistema si occupa di tutto il processo: dalla verifica della disponibilità al calcolo dei costi, fino alla cancellazione delle prenotazioni.

---

## Tecnologie

* Backend: PHP 8.2+ e Slim Framework 4.
* Database: MariaDB 10.11.
* Infrastruttura: Docker e Docker Compose per la gestione dei container.
* Architettura: Uso del Repository Pattern e Singleton per la gestione della connessione al database.

---

## Struttura del Database

Il database parking_db è organizzato in questo modo:
* parcheggi: Contiene i dati delle aree di sosta, le tariffe orarie e gli orari di apertura.
* prenotazioni: Registra i dati degli utenti, le targhe e i periodi di permanenza.
* chiusure_parcheggi: Gestisce i periodi in cui il parcheggio non è disponibile.
* Automazione: Sono presenti trigger per bloccare prenotazioni se i posti sono esauriti e procedure per generare codici univoci.

---

## TODO List

### Cose fatte
- Configurazione dell'ambiente Docker (Apache, PHP, MariaDB).
- Definizione dello schema SQL con tabelle e vincoli di integrità.
- Creazione della classe Connections per gestire il database in modo efficiente.
- Sviluppo del PrenotazioneRepository con le operazioni CRUD principali.

### Cose da fare a breve
- Completare il file index.php collegando le rotte Slim ai metodi del Repository.
- Aggiungere controlli di validazione sui dati inviati dall'utente (es. formato email e date).
- Gestire meglio i messaggi di errore per l'utente finale (404 e 500 in formato JSON).

### Sviluppi futuri
- Automatizzare il calcolo del prezzo totale basandosi sulla tariffa oraria del parcheggio.
- Creare una pagina web semplice per permettere agli utenti di prenotare visivamente.
- Gestire l'assegnazione specifica del posto auto (piano e codice) tramite la tabella dedicata.

---

## Come iniziare

1. Verifica di avere Docker installato sul computer.
2. Scarica il progetto.
3. Avvia i servizi con il comando:
   docker compose up -d
4. Puoi trovare le API all'indirizzo: http://localhost:9080

# Come sono gli api?
ritornano dei json di formato
{
   success : false,
   data : {
      att1 : "123"
   }
}