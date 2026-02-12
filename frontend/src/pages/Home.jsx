import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Car,
  Zap,
  ShieldCheck,
  Clock,
  BadgeDollarSign,
  Sparkles,
  Star,
  Navigation,
} from 'lucide-react'

const stats = [
  { value: 120, suffix: '+', label: 'Hub di parcheggio' },
  { value: 18, suffix: 'k+', label: 'Prenotazioni mensili' },
  { value: 4.9, suffix: '/5', label: 'Soddisfazione media', decimals: 1 },
  { value: 2, suffix: ' min', label: 'Tempo medio di prenotazione' },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Prenotazioni garantite',
    desc: 'Posti bloccati e codici digitali sicuri con policy antifrode.',
  },
  {
    icon: Clock,
    title: 'Tempo reale',
    desc: 'Disponibilità e tariffe dinamiche aggiornate al secondo.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Prezzi smart',
    desc: 'Algoritmo che ottimizza costo, distanza e servizi extra.',
  },
  {
    icon: Zap,
    title: 'Check-in veloce',
    desc: 'Accesso contactless e navigazione guidata fino allo stallo.',
  },
]

const steps = [
  {
    step: '01',
    icon: MapPin,
    title: 'Scegli la zona',
    desc: 'Inserisci destinazione o punto di interesse e filtra per distanza e prezzo.',
  },
  {
    step: '02',
    icon: Car,
    title: 'Blocca il posto',
    desc: 'Seleziona il parcheggio migliore e conferma con pagamento sicuro.',
  },
  {
    step: '03',
    icon: Navigation,
    title: 'Arriva guidato',
    desc: 'Segui il percorso ottimale. Check-in digitale e supporto 24/7.',
  },
]

const testimonials = [
  {
    name: 'Luca Rossi',
    role: 'Product Manager, Milano',
    text: 'In centro il sabato mattina trovavo posto in 20 minuti. Ora in 2. È un altro livello.',
  },
  {
    name: 'Giulia Verdi',
    role: 'Freelance, Torino',
    text: 'Tariffe chiare e ingresso smart: niente più ticket o code al totem.',
  },
]

function useAnimatedNumber(target, start, decimals = 0, duration = 1100) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!start) return

    let frame
    let startTs

    const step = (ts) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const next = Number((target * progress).toFixed(decimals))
      setVal(next)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, start, duration, decimals])

  return val
}

function useReveal(threshold = 0.25) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

function StatItem({ stat, visible, delay }) {
  const animated = useAnimatedNumber(stat.value, visible, stat.decimals ?? 0)
  const display =
    stat.decimals !== undefined
      ? animated.toFixed(stat.decimals ?? 0) + (stat.suffix || '')
      : `${animated}${stat.suffix || ''}`

  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/20 border-2 border-slate-700/80 shadow-[0_35px_100px_-45px_rgba(15,23,42,1)] backdrop-blur-2xl px-7 py-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_120px_-50px_rgba(20,184,166,0.6)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <p className="text-5xl sm:text-6xl font-black text-teal-300 drop-shadow-[0_10px_30px_rgba(20,184,166,0.4)]">
        {display}
      </p>
      <p className="text-sm text-slate-200/90 font-semibold mt-3">{stat.label}</p>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [statsRef, statsVisible] = useReveal(0.2)
  const [featRef, featVisible] = useReveal(0.2)
  const [stepsRef, stepsVisible] = useReveal(0.2)
  const [testiRef, testiVisible] = useReveal(0.15)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/city-map', { state: { q: query } })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.18),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.12),transparent_40%)]" />
      <div className="absolute -left-10 top-10 w-72 h-72 bg-teal-400/10 blur-3xl rounded-full" />
      <div className="absolute right-0 bottom-10 w-96 h-96 bg-cyan-400/10 blur-3xl rounded-full" />

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-20 lg:py-24 space-y-24 lg:space-y-28 relative">
        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-items-center w-full">
          <div className="space-y-7 w-full max-w-3xl mx-auto text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur shadow-lg">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-xs uppercase tracking-[0.25em] text-slate-100 font-semibold">
                Nuova esperienza premium
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
              Prenota il tuo parcheggio{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-200 drop-shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                prima di partire
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300/90 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Occupazione live, percorsi ottimizzati e check-in digitale per entrare senza code. Un assistente personale per ogni spostamento in città.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => navigate('/city-map')}
                className="px-8 py-4 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/40 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-200 w-full sm:w-auto"
              >
                Apri la mappa live
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur text-slate-50 font-bold text-base hover:bg-white/10 hover:border-white/40 transition-all duration-200 w-full sm:w-auto">
                Guarda le tariffe
              </button>
            </div>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 bg-white/10 border-2 border-white/20 rounded-2xl p-2.5 backdrop-blur-xl shadow-[0_25px_80px_-50px_rgba(14,165,233,0.7)] max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-3 flex-1 px-4 py-3.5 rounded-xl bg-slate-950/60 border border-white/10 focus-within:border-teal-400/50 transition-colors">
                <MapPin className="w-5 h-5 text-teal-300 flex-shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent w-full outline-none text-slate-50 placeholder:text-slate-400 text-base"
                  placeholder="Inserisci indirizzo o punto di interesse"
                  aria-label="Cerca parcheggio"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-slate-50 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/30 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-200"
                aria-label="Trova parcheggio"
              >
                Trova parcheggio
              </button>
            </form>
            <div className="flex items-center gap-6 text-xs text-slate-300/90 justify-center lg:justify-start flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="font-medium">Disponibilità live</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                <span className="font-medium">EV ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-lg shadow-amber-300/50" />
                <span className="font-medium">Accesso H24</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center w-full max-w-xl lg:max-w-2xl">
            <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/25 via-teal-400/20 to-transparent blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
            <div className="relative w-full rounded-3xl border-2 border-white/15 bg-white/10 backdrop-blur-2xl p-7 shadow-[0_35px_120px_-60px_rgba(14,165,233,0.8)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 font-black flex items-center justify-center shadow-xl shadow-cyan-500/50">
                    <Car className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
                      Situazione attuale
                    </p>
                    <p className="text-xl font-bold mt-0.5">Centro città</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-300/40 shadow-lg shadow-emerald-500/20">
                  Verde
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border-2 border-white/15 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-sm text-slate-300/90 font-medium">Disponibilità stimata</p>
                    <p className="text-2xl font-black text-teal-300 mt-1">Bassa occupazione</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/25 border-2 border-emerald-300/40 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Sparkles className="w-6 h-6 text-emerald-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 shadow-lg backdrop-blur">
                    <p className="text-xs text-slate-400 font-semibold">EV fast</p>
                    <p className="text-xl font-bold mt-1">12 colonnine</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 shadow-lg backdrop-blur">
                    <p className="text-xs text-slate-400 font-semibold">Coperti</p>
                    <p className="text-xl font-bold mt-1">68 posti</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-slate-900/20 border-2 border-white/15 p-5 shadow-lg">
                  <p className="text-sm text-slate-300/90 font-medium">Percorso consigliato</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-400/25 border-2 border-teal-300/40 flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <Navigation className="w-5 h-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">8 min</p>
                      <p className="text-xs text-slate-400 mt-0.5">Via Torino → Via Orefici</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6 max-w-6xl mx-auto justify-items-center"
        >
          {stats.map((stat, idx) => (
            <StatItem key={stat.label} stat={stat} visible={statsVisible} delay={idx * 90} />
          ))}
        </section>

        {/* FEATURES */}
        <section className="space-y-10 max-w-6xl xl:max-w-7xl mx-auto" ref={featRef}>
          <div
            className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 transition-all duration-500 ${
              featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="text-center lg:text-left space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-teal-300 font-semibold">
                Tutto quello che ti serve
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Un ecosistema completo per la mobilità urbana
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-200/90 justify-center lg:justify-start flex-wrap">
              <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 font-semibold backdrop-blur">
                Supporto 24/7
              </span>
              <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 font-semibold backdrop-blur">
                Pagamenti sicuri
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch justify-items-center">
            {features.map((f, idx) => (
              <div
                key={f.title}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`rounded-2xl border-2 border-white/15 bg-white/10 backdrop-blur-2xl p-6 shadow-[0_30px_90px_-55px_rgba(14,165,233,0.7)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_100px_-50px_rgba(14,165,233,0.9)] hover:border-teal-400/30 ${
                  featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/25 to-teal-400/25 border-2 border-white/20 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <f.icon className="w-6 h-6 text-teal-200" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-50">{f.title}</h3>
                <p className="mt-3 text-sm text-slate-300/90 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MAP SHOWCASE */}
        <section className="relative py-6 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-items-center rounded-3xl border-2 border-white/15 bg-white/10 backdrop-blur-2xl p-10 lg:p-12 shadow-[0_40px_140px_-70px_rgba(14,165,233,0.8)]">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.25em] text-teal-300 font-semibold">Mappa predittiva</p>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">Suggerimenti basati su traffico reale</h2>
              <p className="text-slate-300/90 text-base leading-relaxed">
                Il motore di raccomandazione combina occupazione in tempo reale, eventi cittadini e preferenze salvate. Ti proponiamo il posto migliore prima che tu arrivi.
              </p>
              <div className="flex gap-4 text-sm text-slate-200 flex-wrap">
                <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 font-semibold backdrop-blur">
                  EV ready
                </span>
                <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 font-semibold backdrop-blur">
                  Fast lane
                </span>
                <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 font-semibold backdrop-blur">
                  Accesso H24
                </span>
              </div>
            </div>

            <div className="relative w-full">
              <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/30 via-teal-500/30 to-transparent blur-3xl animate-pulse" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/15 shadow-xl shadow-slate-900/70">
                <div className="h-[320px] sm:h-[360px] md:h-[420px] bg-[radial-gradient(circle_at_30%_30%,rgba(45,212,191,0.6),rgba(15,23,42,0.6)),radial-gradient(circle_at_70%_40%,rgba(14,165,233,0.55),rgba(15,23,42,0.8))]" />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_40%)]" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between rounded-xl bg-slate-950/80 border-2 border-white/15 backdrop-blur-xl px-5 py-3.5 shadow-lg">
                  <div className="flex items-center gap-2.5 text-sm text-slate-100 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                    Occupazione bassa
                  </div>
                  <div className="text-xs text-slate-300 font-medium">Aggiornato ora</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="relative py-6 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto" ref={stepsRef}>
            <div
              className={`text-center mb-16 transition-all duration-500 ${
                stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-teal-300 font-semibold">Flusso in 3 mosse</p>
              <h2 className="text-4xl lg:text-5xl font-black mt-2">Dal tap al parcheggio in meno di 2 minuti</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-7 md:gap-8 justify-items-center">
              {steps.map((s, idx) => (
                <div
                  key={s.step}
                  style={{ transitionDelay: `${idx * 90}ms` }}
                  className={`relative rounded-2xl border-2 border-white/15 bg-white/10 backdrop-blur-2xl p-7 shadow-[0_30px_95px_-55px_rgba(59,130,246,0.8)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_110px_-55px_rgba(59,130,246,1)] hover:border-cyan-400/30 ${
                    stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 font-black text-lg shadow-xl shadow-teal-500/50 animate-[float_4s_ease-in-out_infinite]">
                      {s.step}
                    </span>
                    <s.icon className="w-6 h-6 text-teal-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-50">{s.title}</h3>
                  <p className="text-sm text-slate-300/90 mt-3 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="relative py-6 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto" ref={testiRef}>
            <div
              className={`text-center mb-16 transition-all duration-500 ${
                testiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-teal-300 font-semibold">
                La voce degli utenti
              </p>
              <h2 className="text-4xl lg:text-5xl font-black mt-2">Esperienze reali, zero stress</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-7 lg:gap-8 justify-items-center">
              {testimonials.map((t, idx) => (
                <div
                  key={t.name}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                  className={`rounded-2xl border-2 border-white/15 bg-white/10 backdrop-blur-2xl p-7 shadow-[0_35px_105px_-60px_rgba(45,212,191,0.8)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_120px_-60px_rgba(45,212,191,1)] hover:border-teal-400/30 ${
                    testiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <div className="flex items-center gap-2 text-amber-300 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current drop-shadow-lg" />
                    ))}
                    <span className="text-xs text-slate-200/90 font-semibold ml-1">4.9/5</span>
                  </div>
                  <p className="text-base text-slate-100 leading-relaxed font-medium">{t.text}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-teal-500/40">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-50">{t.name}</p>
                      <p className="text-xs text-slate-300/90 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-10 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto rounded-3xl border-2 border-white/20 bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-300 text-slate-950 p-10 lg:p-12 shadow-[0_35px_120px_-65px_rgba(16,185,129,0.95)] overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.4),transparent_35%)]" />
            <div className="relative grid lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-2 space-y-5 text-center lg:text-left">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-900/80 font-bold">
                  Pronto a provare?
                </p>
                <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                  Blocca il tuo posto in anticipo e risparmia tempo ogni giorno.
                </h2>
                <p className="text-base text-slate-900/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Attiva gli alert di disponibilità, salva i preferiti e ricevi percorsi ottimizzati prima di partire.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <button
                  onClick={() => navigate('/city-map')}
                  className="px-8 py-4 rounded-2xl bg-slate-950 text-white font-black text-base w-full lg:w-auto shadow-2xl shadow-emerald-700/40 hover:translate-y-[-2px] hover:shadow-2xl transition-all duration-200"
                  aria-label="Apri la mappa per prenotare"
                >
                  Apri la mappa
                </button>
                <button className="px-8 py-4 rounded-2xl bg-white/40 backdrop-blur text-slate-900 font-bold text-base border-2 border-white/60 w-full lg:w-auto hover:bg-white/60 hover:border-white/80 transition-all duration-200">
                  Guarda le tariffe
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes shift {
          0% { transform: translateX(0); }
          50% { transform: translateX(-4%); }
          100% { transform: translateX(0); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
