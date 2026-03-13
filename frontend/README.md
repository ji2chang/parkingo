# Parkly — Sistema Prenotazione Parcheggi

Applicazione React 18 multi-pagina basata su Vite, Tailwind CSS e React Router v6 per prenotare e gestire parcheggi premium. L'interfaccia prende ispirazione da Airbnb, Stripe, Linear e Vercel, con animazioni Framer Motion, validazione realtime e toast contestuali.

## Stack

- React 18 + Vite 5
- React Router DOM v6
- Tailwind CSS 3 con design system personalizzato
- Framer Motion per transizioni e micro-interazioni
- React Hook Form per flussi form multi-step
- Axios + date-fns per API e gestione date
- Lucide React per icone coerenti

## Requisiti Funzionali
 
### Ricerca e Mappa
 
| ID | Descrizione | Priorità |
|---|---|---|
| RF-01 | L'utente può cercare parcheggi per posizione geografica (coordinate), filtrando per disponibilità, orario e altri criteri tramite `MapFilters`. | Alta |
| RF-02 | I parcheggi disponibili sono visualizzati su una mappa interattiva (`MapPage`), con nome, posizione e stato occupazione. | Alta |
| RF-03 | L'utente può accedere alla scheda di dettaglio del parcheggio (`ParkingInfoCard`) con capacità, orari, tariffe e disponibilità in tempo reale. | Alta |
| RF-04 | Il sistema espone filtri avanzati (`MapFilters.jsx`): tipo di veicolo, orario arrivo/partenza, distanza, prezzo massimo. I filtri sono persistibili come ricerche salvate. | Media |
| RF-05 | Gli utenti possono salvare configurazioni di ricerca frequenti (`useSavedSearches.js`) per riutilizzarle rapidamente. | Bassa |
| RF-06 | Il sistema raggruppa i parcheggi per zona geografica (`ZoneCard.jsx`), permettendo una navigazione gerarchica. | Media |
 
### Prenotazioni
 
| ID | Descrizione | Priorità |
|---|---|---|
| RF-07 | L'utente può prenotare un posto auto specificando parcheggio, data/ora inizio e fine tramite `BookingPage`. Il sistema verifica la disponibilità prima di creare la prenotazione. | Alta |
| RF-08 | Dopo la creazione, il sistema mostra una pagina di conferma (`ConfirmationPage`) con riepilogo: codice prenotazione, parcheggio, orari, importo. | Alta |
| RF-09 | L'utente può visualizzare le proprie prenotazioni attive e storiche, con stato (confermata, annullata, completata). | Alta |
| RF-10 | L'utente può cancellare una prenotazione esistente; il sistema aggiorna automaticamente lo stato del posto auto a libero. | Alta |
| RF-11 | Il sistema supporta la modifica di prenotazioni esistenti (orari, posto auto) tramite `PrenotazioneController`. | Media |
| RF-12 | Prima di creare una prenotazione, il backend verifica che il posto sia libero nell'intervallo richiesto e che il parcheggio non sia in chiusura programmata (`ChiusuraParcheggio`). | Alta |
 
### Gestione Parcheggio (Pannello Gestore)
 
| ID | Descrizione | Priorità |
|---|---|---|
| RF-14 | Il gestore accede a `ManagePage` per visualizzare e modificare i propri parcheggi, posti auto e prenotazioni attive. | Alta |
| RF-15 | Il gestore può aggiungere, modificare o rimuovere posti auto da un parcheggio. Ogni posto ha uno stato (`StatoPostoAuto`: libero, occupato, riservato). | Alta |
| RF-16 | Il gestore può definire periodi di chiusura temporanea (`ChiusuraParcheggio`), che impediscono nuove prenotazioni nell'intervallo. | Media |
| RF-17 | Il gestore può aggiornare le informazioni del parcheggio: nome, indirizzo, coordinate, capacità, tariffe, orari di apertura. | Alta |
 


```bash
npm install
cp .env.example .env           # imposta VITE_API_BASE_URL
npm run dev                    # http://localhost:5173
```

### Script disponibili

| Script           | Descrizione                               |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Avvia Vite in modalità sviluppo           |
| `npm run build`  | Produce la build production-ready         |
| `npm run preview`| Serve localmente la build prod            |

## Struttura progetto

```

├── components/
│   ├── layout (Navbar, Footer, Layout, Breadcrumbs)
│   ├── ui (Button, Input, Card, Modal, Toast, Badge, Loader, DateTimePicker)
│   ├── booking (SearchForm, ParkingCard, BookingForm, BookingSummary)
│   └── manage (CodeInput, BookingDetails, BookingTimeline)
├── hooks (useApi, useToast, useBooking)
├── pages (Home, Search, Booking, Confirmation, Manage, BookingDetails)
├── utils (api, validation, format, cn)
├── App.jsx (routing + animazioni)
└── main.jsx (BrowserRouter + providers)
```

## Funzionalità chiave

- Ricerca parcheggi con validazione date (max 30 giorni), skeleton e toast
- Prenotazione multistep con step indicator, riepilogo sticky e micro-interazioni
- Pagina di conferma con codice copiabile, CTA (PDF, gestione, nuova prenotazione)
- Gestione prenotazioni con codice 21 caratteri, timeline e azioni Modifica/Annulla con dialoghi di conferma
- Toast notifiche e modali coerenti, loader pulsanti, badge stato e empty states curati
- Accessibilità: focus visibili, semantic HTML e ARIA labels mirati

## Endpoints attesi

Configura `VITE_API_BASE_URL` nel `.env` e assicurati che il backend esponga:

- `GET /api/parcheggi.php?data_inizio=...&data_fine=...`
- `GET /api/parcheggio.php?id=...`
- `POST /api/prenotazioni.php`
- `GET /api/prenotazione.php?codice=...`
- `PUT /api/prenotazione.php?codice=...`
- `DELETE /api/prenotazione.php?codice=...`

In assenza di backend, il layer `src/utils/api.js` usa fallback/mock data per mantenere l'UX.

## Qualità & design system

- Palette proprietaria, typography Plus Jakarta Sans / DM Sans da Google Fonts
- Sistema spacing 4/8/16/24/32/48/64 px, border radius coerenti, ombre eleganti
- Componenti riutilizzabili (button variants, floating inputs, card hover, modal, toast, skeleton)
- Validazione realtime (regex e helper in `utils/validation.js`), loader/empty/error states dedicati

## Deploy

Esegui `npm run build` per generare `dist/` e pubblica su hosting statico (Vercel, Netlify, S3, ecc.).
