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

## Requisiti

- Node.js 18+
- npm 9+

## Setup rapido

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
