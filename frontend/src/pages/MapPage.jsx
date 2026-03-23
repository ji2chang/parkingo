import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Star, Car } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MapFilters } from '../components/MapFilters'
import { getParkings } from '../services/api'
import { formatCurrency } from '../utils/format'
import { useBookingRefresh, BOOKING_EVENTS } from '../hooks/useBookingRefresh'

const CENTER = [41.8719, 12.5674]
const ZOOM = 6
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

/** Build a colored SVG pin icon based on availability ratio */
function makeParkingIcon(available, total) {
  const ratio = total > 0 ? available / total : 1
  const color = ratio > 0.5 ? '#22c55e' : ratio > 0.2 ? '#f59e0b' : '#ef4444'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
    <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/></filter>
    <ellipse cx="19" cy="45" rx="7" ry="3" fill="rgba(0,0,0,0.25)"/>
    <path filter="url(#s)" d="M19 0C8.5 0 0 8.5 0 19c0 13 19 29 19 29S38 32 38 19C38 8.5 29.5 0 19 0z" fill="${color}"/>
    <circle cx="19" cy="19" r="10" fill="rgba(0,0,0,0.2)"/>
    <text x="19" y="24" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="800" fill="white">P</text>
  </svg>`
  return L.divIcon({
    html: svg,
    iconSize: [38, 48],
    iconAnchor: [19, 48],
    popupAnchor: [0, -50],
    className: '',
  })
}

/** Inline popup HTML — no React rendering needed */
function makePopupHtml(parking) {
  const total = parking.totalSpots ?? 0
  const available = parking.availableSpots ?? 0
  const ratio = total > 0 ? available / total : 1
  const badgeColor = ratio > 0.5 ? '#22c55e' : ratio > 0.2 ? '#f59e0b' : '#ef4444'
  return `
    <div style="min-width:210px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#f1f5f9;background:#1e293b;border-radius:16px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#f1f5f9">${parking.name}</p>
        <p style="margin:0 0 8px;font-size:12px;color:#94a3b8">${parking.address}, ${parking.city}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
          <span style="font-size:18px;font-weight:800;color:#818cf8">${formatCurrency(parking.pricePerHour ?? 0)}<span style="font-size:11px;font-weight:400;color:#94a3b8">/ora</span></span>
          <span style="font-size:11px;font-weight:600;color:${badgeColor};background:${badgeColor}22;border-radius:99px;padding:3px 9px">
            🚗 ${available}/${total}
          </span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;font-size:12px;color:#f59e0b;margin-bottom:12px">
          ★ ${typeof parking.rating === 'number' ? parking.rating.toFixed(1) : '-'}
        </div>
      </div>
      <button
        data-id="${parking.id}"
        style="display:block;width:100%;padding:10px;background:#6366f1;color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;transition:background .15s"
        onmouseover="this.style.background='#4f46e5'"
        onmouseout="this.style.background='#6366f1'"
      >
        Prenota ora →
      </button>
    </div>`
}


function normalizeParking(p) {
  let lat = p.lat ?? p.latitude
  let lng = p.lng ?? p.longitude
  
  if (typeof lat === 'string') lat = parseFloat(lat)
  if (typeof lng === 'string') lng = parseFloat(lng)
  
  const isValidLat = typeof lat === 'number' && !isNaN(lat) && lat >= 35 && lat <= 47
  const isValidLng = typeof lng === 'number' && !isNaN(lng) && lng >= 8 && lng <= 20
  
  return {
    id: p.id?.toString(),
    name: p.nome ?? p.name ?? 'Parcheggio',
    address: p.indirizzo ?? p.address ?? '',
    city: p.citta ?? p.city ?? '',
    cap: p.cap ?? undefined,
    totalSpots: p.posti_totali ?? p.totalSpots ?? 0,
    // If API returns `posti_disponibili` as null significa che tutti i posti sono liberi
    availableSpots:
      (p.posti_disponibili !== null && p.posti_disponibili !== undefined)
        ? p.posti_disponibili
        : (p.availableSpots ?? p.posti_totali ?? p.totalSpots ?? 0),
    pricePerHour: p.tariffa_oraria ?? p.pricePerHour ?? 0,
    openingTime: p.orario_apertura ?? p.openingTime ?? null,
    closingTime: p.orario_chiusura ?? p.closingTime ?? null,
    open24h: p.aperto_24h ?? p.open24h ?? false,
    description: p.descrizione ?? p.description ?? '',
    lat: isValidLat ? lat : CENTER[0],
    lng: isValidLng ? lng : CENTER[1],
    rating: typeof p.rating === 'number' ? p.rating : undefined,
    amenities: p.servizi_disponibili 
      ? (typeof p.servizi_disponibili === 'string' 
        ? p.servizi_disponibili.split(',').map(s => s.trim())
        : p.servizi_disponibili)
      : p.amenities ?? p.servizi ?? [],
    images: p.images ?? [],
  }
}

export function MapPage() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapElRef = useRef(null)
  const markersRef = useRef([])
  const [filters, setFilters] = useState({ amenities: [], maxPrice: null })
  const [selected, setSelected] = useState(null)
  const [allParkings, setAllParkings] = useState([])
  const [startDate, setStartDate] = useState('')
  const [startHour, setStartHour] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endHour, setEndHour] = useState('')

  // Inizializza date/ore
  useEffect(() => {
    const now = new Date()
    const start = new Date(now)
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    setStartDate(start.toISOString().slice(0, 10))
    setStartHour(start.toISOString().slice(11, 13) + ':00')
    
    setEndDate(end.toISOString().slice(0, 10))
    setEndHour(end.toISOString().slice(11, 13) + ':00')
  }, [])

  // Carica parcheggi dall'API al mount e quando cambiano le date
  const fetchParkings = useCallback(async () => {
    if (!startDate || !startHour || !endDate || !endHour) return
    
    try {
      const payload = await getParkings({
        data_inizio: startDate,
        orario_inizio: startHour,
        data_fine: endDate,
        orario_fine: endHour,
      })
      // API returns { success: boolean, data: [...] }
      const list = Array.isArray(payload)
        ? payload
        : payload?.data ?? []
      setAllParkings(list.map(normalizeParking))
    } catch {
      setAllParkings([])
    }
  }, [startDate, startHour, endDate, endHour])

  useEffect(() => {
    fetchParkings()
  }, [fetchParkings])

  // Refresh parkings when a booking is created, cancelled, or updated (availability may have changed)
  useBookingRefresh([BOOKING_EVENTS.CREATED, BOOKING_EVENTS.CANCELLED, BOOKING_EVENTS.UPDATED], () => {
    fetchParkings()
  })

  /** Filter parkings by active filters */
  const filtered = useMemo(
    () =>
      allParkings.filter((p) => {
        if (filters.maxPrice && (p.pricePerHour ?? 0) > filters.maxPrice) return false
        if (
          filters.amenities?.length > 0 &&
          !filters.amenities.every((a) => (p.amenities ?? []).includes(a))
        )
          return false
        return true
      }),
    [filters, allParkings]
  )

  /** Handle clicks on "Prenota ora" buttons inside Leaflet popups */
  const handlePopupClick = useCallback(
    (e) => {
      const btn = e.target.closest('[data-id]')
      if (btn) navigate(`/booking/${btn.dataset.id}`)
    },
    [navigate]
  )

  // Validazione date
  const isDateValid = () => {
    if (!startDate || !startHour || !endDate || !endHour) return false
    const start = new Date(`${startDate}T${startHour}`)
    const end = new Date(`${endDate}T${endHour}`)
    return start < end
  }

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    if (newStartDate && endDate && newStartDate > endDate) {
      setEndDate(newStartDate)
    }
  }

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value
    if (newEndDate && startDate && newEndDate < startDate) {
      return
    }
    setEndDate(newEndDate)
  }

  /** Initialise Leaflet map once on mount */
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return

    const map = L.map(mapElRef.current, {
      center: CENTER,
      zoom: ZOOM,
      zoomControl: false,
    })

    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map)

    // Custom zoom control (top-right)
    L.control.zoom({ position: 'topright' }).addTo(map)

    // Delegate popup button clicks to the map container
    mapElRef.current.addEventListener('click', handlePopupClick)

    mapRef.current = map

    return () => {
      mapElRef.current?.removeEventListener('click', handlePopupClick)
      map.remove()
      mapRef.current = null
    }
  }, [handlePopupClick])

  /** Re-render markers whenever filtered list changes */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Use a LayerGroup for markers
    if (!map._markerLayer) {
      map._markerLayer = L.layerGroup().addTo(map)
    }
    map._markerLayer.clearLayers()

    filtered.forEach((parking) => {
      const marker = L.marker([parking.lat, parking.lng], {
        icon: makeParkingIcon(parking.availableSpots ?? 0, parking.totalSpots ?? 0),
      })
        .bindPopup(makePopupHtml(parking), {
          maxWidth: 260,
          className: 'parkly-popup',
        })
        .on('click', () => setSelected(parking))
      map._markerLayer.addLayer(marker)
    })

    // Auto-fit bounds to show all markers if there are any
    if (filtered.length > 0) {
      try {
        const bounds = L.latLngBounds(filtered.map(p => [p.lat, p.lng]))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      } catch (e) {
        console.warn('Error fitting bounds:', e)
      }
    }
  }, [filtered])

  /** Recenter map to default view */
  function recenter() {
    mapRef.current?.setView(CENTER, ZOOM)
  }

  const ratio = selected ? (selected.availableSpots ?? 0) / (selected.totalSpots ?? 1) : 1
  const availVariant = ratio > 0.5 ? 'success' : ratio > 0.2 ? 'warning' : 'danger'
  
  const HOURS = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Mappa parcheggi</h1>
          <p className="mt-1 text-white/50">
            {filtered.length} parcheggio{filtered.length !== 1 ? 'i' : ''} visibili
          </p>
        </div>
        <MapFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Time filters */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* INIZIO */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Inizio</p>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
            />
            <select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>Ora</option>
              {HOURS.map((h) => (
                <option key={h} value={h} style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* FINE */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Fine</p>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
            />
            <select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>Ora</option>
              {HOURS.map((h) => (
                <option key={h} value={h} style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map container */}
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{ height: '540px' }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Leaflet renders here */}
        <div ref={mapElRef} style={{ height: '100%', width: '100%' }} />

        {/* Recenter button (outside Leaflet) */}
        <button
          onClick={recenter}
          title="Centra mappa"
          className="absolute bottom-4 left-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1e293b] border border-white/10 text-white shadow-lg hover:bg-primary transition-colors"
        >
          <Navigation className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-white/50 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-success" /> Disponibile
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-warning" /> Pochi posti
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-danger" /> Quasi esaurito
        </span>
      </div>

      {/* Selected parking card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            className="glass-panel rounded-3xl border border-primary/30 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-lg">{selected.name}</h3>
              <p className="text-sm text-white/60 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                {selected.address}{selected.address && selected.city ? ', ' : ''}{selected.city}
              </p>
              <div className="flex items-center gap-1 text-warning text-sm mt-1">
                <Star className="h-3.5 w-3.5 fill-warning" />
                {typeof selected.rating === 'number' ? selected.rating.toFixed(1) : '-'}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(selected.amenities ?? []).map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 items-end flex-shrink-0">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(selected.pricePerHour ?? 0)}
                  <span className="text-sm font-normal text-white/50">/ora</span>
                </p>
                <Badge variant={availVariant} className="mt-1">
                  <Car className="h-3 w-3 mr-1 inline" />
                  {selected.availableSpots ?? 0}/{selected.totalSpots ?? 0} posti
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  Chiudi
                </Button>
                <Button size="sm" onClick={() => navigate(`/booking/${selected.id}`)}>
                  Prenota
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
