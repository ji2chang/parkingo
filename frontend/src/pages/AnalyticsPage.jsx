import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Car, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatCurrency, formatDate } from '../utils/format'
import { useBooking } from '../hooks/useBooking'
import { PARKINGS } from '../utils/parkings'

export function AnalyticsPage() {
  const navigate = useNavigate()
  const { bookings } = useBooking()

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== 'cancelled')
    const total = active.reduce((sum, b) => sum + (b.total ?? 0), 0)
    const avgCost = active.length ? total / active.length : 0
    return {
      total: bookings.length,
      active: active.length,
      cancelled: bookings.length - active.length,
      totalSpend: total,
      avgCost,
    }
  }, [bookings])

  const parkingUsage = useMemo(() => {
    const map = {}
    bookings.forEach((b) => {
      const id = b.parking?.id
      if (!id) return
      map[id] = (map[id] ?? 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({ parking: PARKINGS.find((p) => p.id === id), count }))
  }, [bookings])

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart2 className="h-8 w-8 text-primary-light" />
          Analisi & Statistiche
        </h1>
        <p className="mt-1 text-white/50">Panoramica delle tue prenotazioni.</p>
      </motion.div>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Prenotazioni totali', value: stats.total, icon: <Car className="h-5 w-5" />, color: 'text-info' },
          { label: 'Attive', value: stats.active, icon: <CheckCircle className="h-5 w-5" />, color: 'text-success' },
          { label: 'Cancellate', value: stats.cancelled, icon: <XCircle className="h-5 w-5" />, color: 'text-danger' },
          { label: 'Spesa totale', value: formatCurrency(stats.totalSpend), icon: <DollarSign className="h-5 w-5" />, color: 'text-warning' },
        ].map(({ label, value, icon, color }, i) => (
          <motion.div
            key={label}
            className="glass-panel rounded-3xl border border-white/10 p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50 mt-0.5">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <Card title="Prenotazioni recenti">
          {bookings.length === 0 ? (
            <div className="py-8 text-center text-white/40">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Nessuna prenotazione ancora.</p>
              <Button variant="ghost" className="mt-4" onClick={() => navigate('/search')}>
                Inizia a prenotare
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {bookings.slice(0, 6).map((b) => (
                <div
                  key={b.code}
                  className="flex items-center justify-between gap-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl px-2 transition-colors"
                  onClick={() => navigate(`/manage/${b.code}`)}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{b.parking?.name}</p>
                    <p className="text-xs text-white/50">{formatDate(b.createdAt)} · {b.code}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-semibold text-white">{formatCurrency(b.total)}</span>
                    <Badge variant={b.status === 'cancelled' ? 'danger' : 'success'}>
                      {b.status === 'cancelled' ? 'Cancellata' : 'Attiva'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Parking usage */}
        <Card title="Parcheggi più utilizzati">
          {parkingUsage.length === 0 ? (
            <div className="py-8 text-center text-white/40">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Nessun dato disponibile.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {parkingUsage.map(({ parking, count }) => (
                <div key={parking?.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{parking?.name ?? 'Sconosciuto'}</span>
                    <span className="text-white/50">{count} prenotaz.</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (count / Math.max(...parkingUsage.map((p) => p.count))) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Avg cost */}
      {stats.active > 0 && (
        <Card title="Costo medio per prenotazione">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-primary-light" />
            <p className="text-4xl font-bold text-white">{formatCurrency(stats.avgCost)}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
