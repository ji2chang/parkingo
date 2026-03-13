import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, BarChart2, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const FEATURES = [
  {
    icon: <Search className="h-7 w-7 text-primary-light" />,
    title: 'Trova il tuo parcheggio',
    description: 'Cerca tra centinaia di parcheggi vicino a te, filtra per prezzo e servizi.',
    action: '/search',
    cta: 'Cerca',
  },
  {
    icon: <MapPin className="h-7 w-7 text-info" />,
    title: 'Esplora sulla mappa',
    description: 'Visualizza la disponibilità in tempo reale su una mappa interattiva.',
    action: '/map',
    cta: 'Apri mappa',
  },
  {
    icon: <BarChart2 className="h-7 w-7 text-success" />,
    title: 'Analisi e statistiche',
    description: 'Monitora le tue prenotazioni, i costi e i trend di utilizzo.',
    action: '/analytics',
    cta: 'Vedi analisi',
  },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.section
        className="flex flex-col items-center gap-6 pt-8 pb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/40 text-white text-4xl font-bold">
          P
        </div>
        <h1 className="text-5xl font-bold leading-tight">
          Parcheggia{' '}
          <span className="bg-gradient-to-r from-primary-light to-info bg-clip-text text-transparent">
            senza stress
          </span>
        </h1>
        <p className="max-w-xl text-lg text-white/60">
          parkingo ti aiuta a trovare, prenotare e gestire il tuo parcheggio in pochi secondi.
          Nessuna sorpresa, solo comodità.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button size="lg" onClick={() => navigate('/search')} leftIcon={<Search className="h-5 w-5" />}>
            Cerca parcheggio
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/map')} leftIcon={<MapPin className="h-5 w-5" />}>
            Vedi mappa
          </Button>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ icon, title, description, action, cta }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
          >
            <Card className="h-full" hoverable>
              <div className="flex flex-col gap-4 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-white/60">{description}</p>
                </div>
                <Button variant="ghost" onClick={() => navigate(action)} rightIcon={<Zap className="h-4 w-4" />}>
                  {cta}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Quick stats */}
      <motion.section
        className="glass-panel rounded-3xl border border-white/10 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5+', label: 'Parcheggi disponibili' },
            { value: '24/7', label: 'Supporto attivo' },
            { value: '< 1 min', label: 'Tempo medio prenotazione' },
            { value: '100%', label: 'Pagamenti sicuri' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-primary-light">{value}</p>
              <p className="mt-1 text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
