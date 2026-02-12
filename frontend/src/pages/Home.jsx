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
      className={`rounded-2xl bg-gradient-to-br from-slate-900/70 via-slate-900/30 to-slate-900/10 border border-slate-800/70 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl px-6 py-8 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <p className="text-4xl sm:text-5xl font-black text-teal-300 drop-shadow-[0_8px_24px_rgba(20,184,166,0.35)]">
        {display}
      </p>
      <p className="text-sm text-slate-200/80 font-semibold mt-2">{stat.label}</p>
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

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-16 lg:py-20 space-y-20 lg:space-y-24 relative">
        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center justify-items-center w-full">
          <div className="space-y-6 w-full max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur">
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-200">
                Nuova esperienza premium
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Prenota il tuo parcheggio{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-200">
                prima di partire
              </span>
            </h1>
            <p className="text-lg text-slate-300/80 max-w-xl space-y-1">
              <span className="block">
                Occupazione live, percorsi ottimizzati e check-in digitale per entrare senza code.
              </span>
              <span className="block">Un assistente personale per ogni spostamento in città.</span>
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/city-map')}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/30 hover:-translate-y-[1px] transition w-full sm:w-auto"
              >
                Apri la mappa live
              </button>
              <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur text-slate-50 font-semibold hover:border-white/30 w-full sm:w-auto">
                Guarda le tariffe
              </button>
            </div>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur shadow-[0_22px_70px_-50px_rgba(14,165,233,0.6)] max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-slate-950/50 border border-white/5">
                <MapPin className="w-5 h-5 text-teal-200" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent w-full outline-none text-slate-50 placeholder:text-slate-400"
                  placeholder="Inserisci indirizzo o punto di interesse"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-slate-50 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20"
              >
                Trova parcheggio
              </button>
            </form>
            <div className="flex items-center gap-4 text-xs text-slate-300/80 justify-center">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Disponibilità live
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                EV ready
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                Accesso H24
              </div>
            </div>
          </div>

          <div className="relative flex justify-center w-full max-w-xl">
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-teal-400/10 to-transparent blur-3xl" />
            <div className="relative w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_30px_100px_-50px_rgba(14,165,233,0.7)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                      Situazione attuale
                    </p>
                    <p className="text-lg font-semibold">Centro città</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-200 text-xs border border-emerald-200/30">
                  Verde
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300/80">Disponibilità stimata</p>
                    <p className="text-2xl font-bold text-teal-200">Bassa occupazione</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400">EV fast</p>
                    <p className="text-lg font-semibold">12 colonnine</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400">Coperti</p>
                    <p className="text-lg font-semibold">68 posti</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-slate-900/10 border border-white/10 p-4">
                  <p className="text-sm text-slate-300/80">Percorso consigliato</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-400/20 border border-teal-300/30 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="font-semibold">8 min</p>
                      <p className="text-xs text-slate-400">Via Torino → Via Orefici</p>
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
        <section className="space-y-8 max-w-6xl xl:max-w-7xl mx-auto" ref={featRef}>
          <div
            className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition-all duration-500 ${
              featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="text-center lg:text-left space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-teal-200">
                Tutto quello che ti serve
              </p>
              <h2 className="text-3xl sm:text-4xl font-black">
                Un ecosistema completo per la mobilità urbana
              </h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200/80 justify-center lg:justify-start">
              <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                Supporto 24/7
              </span>
              <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                Pagamenti sicuri
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch justify-items-center">
            {features.map((f, idx) => (
              <div
                key={f.title}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_25px_70px_-50px_rgba(14,165,233,0.6)] transition-all duration-500 hover:-translate-y-2 ${
                  featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-white/10 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-teal-200" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-50">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-300/80 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MAP SHOWCASE */}
        <section className="relative py-6 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center justify-items-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 lg:p-10 shadow-[0_35px_120px_-60px_rgba(14,165,233,0.7)]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-teal-200">Mappa predittiva</p>
              <h2 className="text-4xl font-black">Suggerimenti basati su traffico reale</h2>
              <p className="text-slate-300/80 space-y-1">
                <span className="block">
                  Il motore di raccomandazione combina occupazione in tempo reale,
                </span>
                <span className="block">eventi cittadini e preferenze salvate.</span>
                <span className="block">Ti proponiamo il posto migliore prima che tu arrivi.</span>
              </p>
              <div className="flex gap-3 text-sm text-slate-200">
                <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                  EV ready
                </span>
                <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                  Fast lane
                </span>
                <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                  Accesso H24
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-cyan-500/25 via-teal-500/25 to-transparent blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-slate-900/60">
                <div className="h-[320px] sm:h-[360px] md:h-[420px] bg-[radial-gradient(circle_at_30%_30%,rgba(45,212,191,0.6),rgba(15,23,42,0.6)),radial-gradient(circle_at_70%_40%,rgba(14,165,233,0.55),rgba(15,23,42,0.8))]" />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_40%)]" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between rounded-xl bg-slate-950/70 border border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />{' '}
                    Occupazione bassa
                  </div>
                  <div className="text-xs text-slate-300">Aggiornato ora</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="relative py-6 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto" ref={stepsRef}>
            <div
              className={`text-center mb-14 transition-all duration-500 ${
                stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-teal-200">Flusso in 3 mosse</p>
              <h2 className="text-4xl font-black">Dal tap al parcheggio in meno di 2 minuti</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
              {steps.map((s, idx) => (
                <div
                  key={s.step}
                  style={{ transitionDelay: `${idx * 90}ms` }}
                  className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_25px_80px_-50px_rgba(59,130,246,0.7)] transition-all duration-500 hover:-translate-y-2 ${
                    stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/40 animate-[float_4s_ease-in-out_infinite]">
                      {s.step}
                    </span>
                    <s.icon className="w-6 h-6 text-teal-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-50">{s.title}</h3>
                  <p className="text-sm text-slate-300/80 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="relative py-6 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto" ref={testiRef}>
            <div
              className={`text-center mb-14 transition-all duration-500 ${
                testiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-teal-200">
                La voce degli utenti
              </p>
              <h2 className="text-4xl font-black">Esperienze reali, zero stress</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 justify-items-center">
              {testimonials.map((t, idx) => (
                <div
                  key={t.name}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                  className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_30px_90px_-55px_rgba(45,212,191,0.7)] transition-all duration-500 hover:-translate-y-2 ${
                    testiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <div className="flex items-center gap-2 text-amber-300 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs text-slate-200/80">4.9/5</span>
                  </div>
                  <p className="text-base text-slate-100 leading-relaxed">{t.text}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-950 font-bold flex items-center justify-center">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-50">{t.name}</p>
                      <p className="text-xs text-slate-300/80">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-10 px-2">
          <div className="max-w-6xl xl:max-w-7xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-300 text-slate-950 p-8 lg:p-10 shadow-[0_32px_100px_-60px_rgba(16,185,129,0.85)] overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.35),transparent_35%)]" />
            <div className="relative grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-900/70">
                  Pronto a provare?
                </p>
                <h2 className="text-4xl font-black leading-tight">
                  Blocca il tuo posto in anticipo e risparmia tempo ogni giorno.
                </h2>
                <p className="text-base text-slate-900/80 max-w-2xl space-y-1 mx-auto lg:mx-0">
                  <span className="block">
                    Attiva gli alert di disponibilità, salva i preferiti
                  </span>
                  <span className="block">e ricevi percorsi ottimizzati prima di partire.</span>
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <button
                  onClick={() => navigate('/city-map')}
                  className="px-6 py-4 rounded-2xl bg-slate-950 text-white font-bold w-full lg:w-auto shadow-xl shadow-emerald-600/30 hover:translate-y-[-1px] transition"
                >
                  Apri la mappa
                </button>
                <button className="px-6 py-4 rounded-2xl bg-white/30 text-slate-900 font-semibold border border-white/50 w-full lg:w-auto">
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
