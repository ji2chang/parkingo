import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Car, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatCurrency, formatDate } from '../utils/format'
import { getAnalytics } from '../services/api'

export function AnalyticsPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [parkingUsage, setParkingUsage] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch analytics data from API
    getAnalytics()
      .then((response) => {
        // Backend returns { success: true, data: { stats, prenotazioni, parcheggi_top } }
        const data = response.data || response;
        setStats(data.stats || {})
        setBookings(data.prenotazioni || [])
        setParkingUsage(data.parcheggi_top || [])
      })
      .catch(() => {
        // Fallback: load from localStorage if API fails
        try {
          const stored = JSON.parse(localStorage.getItem('parkly_bookings') || '[]')
          setBookings(stored || [])
          
          // Calculate stats from stored bookings
          const totale = (stored || []).length
          const cancellate = (stored || []).filter((b) => (b.stato === 'cancellata' || b.status === 'cancelled')).length
          const attive = totale - cancellate
          const spesa_totale = (stored || []).reduce((s, b) => s + (Number(b.importo ?? b.total ?? 0) || 0), 0)
          const costo_medio = totale > 0 ? spesa_totale / totale : 0
          setStats({ totale, attive, cancellate, spesa_totale, costo_medio })

          // Group bookings by parking name for usage stats
          const usageMap = {}
          ;(stored || []).forEach((b) => {
            const name = b.parcheggio?.nome ?? b.parking?.name ?? b.parcheggio_nome ?? 'Unknown'
            if (!usageMap[name]) usageMap[name] = { nome: name, prenotazioni: 0 }
            usageMap[name].prenotazioni += 1
          })
          const usage = Object.values(usageMap).sort((a, z) => z.prenotazioni - a.prenotazioni)
          setParkingUsage(usage)
        } catch (e) {
          setStats({ totale: 0, attive: 0, cancellate: 0, spesa_totale: 0, costo_medio: 0 })
          setBookings([])
          setParkingUsage([])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart2 className="h-8 w-8 text-primary-light" />
          Analisi & Statistiche
        </h1>
        <p className="mt-1 text-white/50">Panoramica delle tue prenotazioni.</p>
      </motion.div>

      {loading && (
        <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
          <p className="text-white/40 text-lg">Caricamento statistiche…</p>
        </div>
      )}

      {!loading && stats && (
      <>
      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Prenotazioni totali', value: stats.totale ?? stats.total ?? 0, icon: <Car className="h-5 w-5" />, color: 'text-info' },
          { label: 'Attive', value: stats.attive ?? stats.active ?? 0, icon: <CheckCircle className="h-5 w-5" />, color: 'text-success' },
          { label: 'Cancellate', value: stats.cancellate ?? stats.cancelled ?? 0, icon: <XCircle className="h-5 w-5" />, color: 'text-danger' },
          { label: 'Spesa totale', value: formatCurrency(stats.spesa_totale ?? stats.totalSpend ?? 0), icon: <DollarSign className="h-5 w-5" />, color: 'text-warning' },
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
                    <p className="font-medium text-white truncate">{b.parcheggio?.nome}</p>
                    <p className="text-xs text-white/50">{formatDate(b.created_at)} · {b.code}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-semibold text-white">{formatCurrency(b.importo)}</span>
                    <Badge variant={b.stato === 'annullata' ? 'danger' : 'success'}>
                      {b.stato === 'annullata' ? 'Cancelled' : 'Active'}
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
              {parkingUsage.map((item) => {
                const name = item.nome ?? item.parking?.name ?? 'Sconosciuto'
                const id = item.id ?? item.parking?.id ?? name
                const count = item.prenotazioni ?? item.count ?? 0
                const maxCount = Math.max(...parkingUsage.map((p) => p.prenotazioni ?? p.count ?? 0))
                return (
                  <div key={id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{name}</span>
                      <span className="text-white/50">{count} prenotaz.</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (count / maxCount) * 100)}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Avg cost */}
      {(stats.attive ?? stats.active ?? 0) > 0 && (
        <Card title="Costo medio per prenotazione">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-primary-light" />
            <p className="text-4xl font-bold text-white">{formatCurrency(stats.costo_medio ?? stats.avgCost ?? 0)}</p>
          </div>
        </Card>
      )}
      </>
      )}
    </div>
  )
}
