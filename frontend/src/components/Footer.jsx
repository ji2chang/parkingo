import React from 'react'
import { Link } from 'react-router-dom'
import { ParkingSquare, Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react'

const links = [
  {
    title: 'Prodotto',
    items: [
      { label: 'Home', to: '/' },
      { label: 'Trova parcheggio', to: '/city-map' },
      { label: 'Chi siamo', to: '/about' },
      { label: 'Contatti', to: '/contact' },
    ],
  },
  {
    title: 'Risorse',
    items: [
      { label: 'FAQ', to: '/contact' },
      { label: 'Guida rapida', to: '/about' },
      { label: 'Aggiornamenti', to: '/' },
    ],
  },
  {
    title: 'Legale',
    items: [
      { label: 'Privacy Policy' },
      { label: 'Termini di Servizio' },
      { label: 'Cookie Policy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#060c1f] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 -left-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,27,61,0.5),_transparent_60%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* CTA Banner */}
        <div className="glass-panel grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 shadow-glass md:grid-cols-[2fr,1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Prenota in anticipo</p>
            <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Anticipa il tuo arrivo e blocca la zona perfetta
            </h3>
            <p className="mt-4 text-sm text-white/60 sm:text-base">
              Tariffe dinamiche aggiornate in tempo reale, notifiche di disponibilità e gestione
              smart per ogni tipologia di zona: Standard, Elettrico e Premium.
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white/5 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Risparmia fino al</p>
              <p className="mt-1 text-4xl font-bold text-teal-300">35%</p>
              <p className="text-sm text-white/60">Prenotando prima dell'arrivo in struttura</p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-teal-400"
            >
              Esplora le zone disponibili
            </button>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.4fr,1fr]">
          {/* Brand + copy */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3" aria-label="Smart Parking home">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner">
                <ParkingSquare className="h-5 w-5 text-teal-300" />
              </div>
              <div>
                <p className="text-lg font-semibold">Smart Parking</p>
                <span className="text-xs uppercase tracking-[0.35em] text-white/40">
                  City zones network
                </span>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Una piattaforma pensata per città moderne: prenotazioni veloci, monitoraggio in tempo
              reale e un'esperienza premium per automobilisti e gestori.
            </p>

            <div className="grid grid-cols-3 gap-4 text-xs text-white/50 sm:text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xl font-semibold text-white">+50</p>
                <p>Parcheggi coperti</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xl font-semibold text-white">12</p>
                <p>Città partner</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xl font-semibold text-white">24/7</p>
                <p>Supporto dedicato</p>
              </div>
            </div>
          </div>

          {/* Link lists */}
          <div className="grid gap-10 sm:grid-cols-2">
            {links.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                  {section.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      {item.to ? (
                        <Link
                          className="text-sm text-white/70 transition hover:text-teal-200"
                          to={item.to}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="cursor-pointer text-sm text-white/70 transition hover:text-teal-200">
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                Contatti
              </h4>
              <ul className="mt-4 space-y-4 text-sm text-white/65">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 flex-shrink-0 text-teal-300" />
                  info@smartparking.it
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0 text-teal-300" />
                  +39 02 1234 5678
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-teal-300" />
                  Via Roma 123, 20121 Milano
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-4">
                {[Instagram, Linkedin, Twitter].map((Icon) => (
                  <button
                    key={Icon.displayName || Icon.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:text-teal-200"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Smart Parking. Tutti i diritti riservati.</span>
          <span>Milano · Torino · Bologna · Roma</span>
        </div>
      </div>
    </footer>
  )
}
