import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ShieldCheck, BadgeDollarSign, MapPin, Car, Zap } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Time Saving',
    desc: 'Trova e prenota un parcheggio in pochi secondi. Niente più giri a vuoto cercando un posto libero.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Booking',
    desc: 'Prenotazioni sicure e garantite. Il tuo posto è riservato e confermato all\'istante.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Best Rates',
    desc: 'Confronta le tariffe in tempo reale e scegli sempre l\'offerta migliore nella tua zona.',
  },
]

const stats = [
  { value: '50+', label: 'Parcheggi' },
  { value: '10k+', label: 'Utenti' },
  { value: '99%', label: 'Soddisfazione' },
  { value: '24/7', label: 'Supporto' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* ──── HERO ──── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* bg image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000&auto=format')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1b3d]/90 via-[#0f1b3d]/70 to-[#0f1b3d]/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Find and Reserve
              <br />
              <span className="text-teal-400">Your Spot</span> in Seconds
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-lg leading-relaxed">
              Smart Parking Reservation System — trova, confronta e prenota un parcheggio vicino a te con un solo click.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/city-map')}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40"
              >
                Book Now
              </button>
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Scopri di più
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──── STATS BAR ──── */}
      <section className="bg-[#0f1b3d] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-teal-400">{s.value}</p>
                <p className="text-sm text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── FEATURES ──── */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Perché scegliere Smart Parking?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Un'esperienza di parcheggio moderna, sicura e conveniente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center mb-5">
                  <f.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Come funziona</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tre semplici passi per il tuo parcheggio perfetto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: MapPin,
                title: 'Cerca',
                desc: 'Apri la mappa e trova i parcheggi disponibili vicino alla tua destinazione.',
              },
              {
                step: '02',
                icon: Car,
                title: 'Seleziona zona',
                desc: 'Scegli la zona che preferisci: Standard, Elettrica o Premium.',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Prenota',
                desc: 'Conferma la prenotazione e il tuo posto è garantito. Semplice.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 mb-6 group-hover:bg-teal-100 transition">
                  <item.icon className="w-8 h-8 text-teal-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0f1b3d] text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="bg-[#0f1b3d] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Pronto a parcheggiare senza stress?
          </h2>
          <p className="text-white/60 mb-8">
            Unisciti a migliaia di utenti che risparmiano tempo e denaro ogni giorno.
          </p>
          <button
            onClick={() => navigate('/city-map')}
            className="px-10 py-4 bg-teal-500 hover:bg-teal-400 text-gray-900 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/30"
          >
            Trova un parcheggio
          </button>
        </div>
      </section>
    </div>
  )
}
