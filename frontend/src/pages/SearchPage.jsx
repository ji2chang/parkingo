import { useState, useEffect, useCallback } from 'react'
import { Search, Bookmark, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ParkingCard } from '../components/ParkingCard'
import { getParkings } from '../services/api'
import { useSavedSearches } from '../hooks/useSavedSearches'
import { useToast } from '../hooks/useToast'
import { formatRelative } from '../utils/format'

const AMENITY_OPTIONS = ['Coperto', 'Scoperto', 'Videosorveglianza', 'Accesso H24', 'Colonnine EV', 'Valet']

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [amenities, setAmenities] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const { savedSearches, addSearch, removeSearch } = useSavedSearches()
  const { showToast } = useToast()

  const fetchResults = useCallback(
    async ({ q = query, c = city, mp = maxPrice, am = amenities } = {}) => {
      setLoading(true)
      try {
        const params = {}
        if (c) params.citta = c
        if (mp) params.prezzo_max = parseFloat(mp)
        if (q) params.query = q
        am.forEach((a) => {
          if (a === 'Coperto') params.al_chiuso = true
          if (a === 'Colonnine EV') params.elettrico = true
          if (a === 'Disabili') params.disabili = true
        })
        const payload = await getParkings(params)
        const list = Array.isArray(payload) ? payload : payload?.data ?? []
        setResults(list.map(normalizeParking))
      } catch (err) {
        showToast({ type: 'danger', title: 'Errore', description: err.message })
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    [query, city, maxPrice, amenities, showToast]
  )

  // Carica al mount e quando cambiano i filtri (debounce leggero)
  useEffect(() => {
    const t = setTimeout(() => fetchResults(), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, city, maxPrice, amenities])

  function toggleAmenity(a) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  function handleSaveSearch() {
    if (!query && !city && !maxPrice && amenities.length === 0) {
      showToast({ type: 'warning', title: 'Nessun filtro da salvare' })
      return
    }
    addSearch({ query, city, maxPrice, amenities })
    showToast({ type: 'success', title: 'Ricerca salvata!' })
  }

  function applySearch(s) {
    setQuery(s.query ?? '')
    setCity(s.city ?? '')
    setMaxPrice(s.maxPrice ? String(s.maxPrice) : '')
    setAmenities(s.amenities ?? [])
  }

  function reset() {
    setQuery('')
    setCity('')
    setMaxPrice('')
    setAmenities([])
  }

  const hasFilters = query || city || maxPrice || amenities.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Cerca parcheggio</h1>
        <p className="mt-1 text-white/50">Trova il posto giusto per il tuo veicolo.</p>
      </div>

      {/* Search bar */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <Input
            className="flex-1 min-w-[180px]"
            placeholder="Nome parcheggio o indirizzo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Input
            className="min-w-[140px]"
            placeholder="Città"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button
            variant="secondary"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setShowFilters((v) => !v)}
          >
            Filtri
          </Button>
          <Button variant="ghost" leftIcon={<Bookmark className="h-4 w-4" />} onClick={handleSaveSearch}>
            Salva ricerca
          </Button>
          {hasFilters && (
            <Button variant="ghost" leftIcon={<X className="h-4 w-4" />} onClick={reset}>
              Reset
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                    Prezzo max / ora (€)
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={maxPrice || 10}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm text-white/70 w-20 text-right">
                      {maxPrice ? `€ ${parseFloat(maxPrice).toFixed(2)}` : 'Qualsiasi'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                    Servizi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((a) => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          amenities.includes(a)
                            ? 'border-primary bg-primary/20 text-primary-light'
                            : 'border-white/20 text-white/60 hover:border-white/40'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Saved searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white/50 uppercase tracking-widest">Ricerche salvate</p>
          <div className="flex flex-wrap gap-2">
            {savedSearches.slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <button
                  onClick={() => applySearch(s)}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition-colors"
                >
                  {s.query || s.city || `Ricerca ${i + 1}`} · {formatRelative(s.savedAt)}
                </button>
                <button
                  onClick={() => removeSearch(i)}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <p className="text-sm text-white/50 mb-4">
          {loading ? 'Ricerca in corso…' : `${results.length} parcheggio${results.length !== 1 ? 'i' : ''} trovato${results.length !== 1 ? 'i' : ''}`}
        </p>
        {loading ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-12 text-center">
            <p className="text-white/40 text-lg">Caricamento…</p>
          </div>
        ) : results.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-12 text-center">
            <p className="text-white/40 text-lg">Nessun parcheggio trovato con i filtri selezionati.</p>
            <Button variant="ghost" className="mt-4" onClick={reset}>
              Rimuovi filtri
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <ParkingCard key={p.id} parking={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Normalize parking object returned by the API into the shape used by the UI
 */
function normalizeParking(p) {
  return {
    id: p.id?.toString(),
    name: p.nome ?? p.name ?? 'Parcheggio',
    address: p.indirizzo ?? p.address ?? '',
    city: p.citta ?? p.city ?? '',
    cap: p.cap ?? undefined,
    totalSpots: p.posti_totali ?? p.totalSpots ?? 0,
    availableSpots: p.posti_disponibili ?? p.availableSpots ?? 0,
    pricePerHour: p.tariffa_oraria ?? p.pricePerHour ?? 0,
    openingTime: p.orario_apertura ?? p.openingTime ?? null,
    closingTime: p.orario_chiusura ?? p.closingTime ?? null,
    open24h: p.aperto_24h ?? p.open24h ?? false,
    description: p.descrizione ?? p.description ?? '',
    lat: typeof p.lat === 'number' ? p.lat : (typeof p.latitude === 'number' ? p.latitude : null),
    lng: typeof p.lng === 'number' ? p.lng : (typeof p.longitude === 'number' ? p.longitude : null),
    rating: typeof p.rating === 'number' ? p.rating : undefined,
    amenities: p.servizi ?? p.amenities ?? [],
    images: p.images ?? [],
  }
}
