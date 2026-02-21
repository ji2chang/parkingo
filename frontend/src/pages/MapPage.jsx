import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Star, Car } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MapFilters } from '../components/MapFilters'
import { PARKINGS } from '../utils/parkings'
import { formatCurrency } from '../utils/format'

const CENTER = [45.4641, 9.1919]
const ZOOM = 13
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

/** Build a colored SVG pin icon based on availability ratio */
function makeParkingIcon(available, total) {
  const ratio = available / total
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
  const ratio = parking.availableSpots / parking.totalSpots
  const badgeColor = ratio > 0.5 ? '#22c55e' : ratio > 0.2 ? '#f59e0b' : '#ef4444'
  return `
    <div style="min-width:210px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#f1f5f9;background:#1e293b;border-radius:16px;padding:0;overflow:hidden">
      <div style="padding:14px 16px 10px">
        <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#f1f5f9">${parking.name}</p>
        <p style="margin:0 0 8px;font-size:12px;color:#94a3b8">${parking.address}, ${parking.city}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
          <span style="font-size:18px;font-weight:800;color:#818cf8">${formatCurrency(parking.pricePerHour)}<span style="font-size:11px;font-weight:400;color:#94a3b8">/ora</span></span>
          <span style="font-size:11px;font-weight:600;color:${badgeColor};background:${badgeColor}22;border-radius:99px;padding:3px 9px">
            🚗 ${parking.availableSpots}/${parking.totalSpots}
          </span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;font-size:12px;color:#f59e0b;margin-bottom:12px">
          ★ ${parking.rating.toFixed(1)}
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

export function MapPage() {
  const navigate = useNavigate()
  const mapRef = useRef(null)         // Leaflet map instance
  const mapElRef = useRef(null)       // DOM element for the map
  const markersRef = useRef([])       // current L.Marker instances
  const [filters, setFilters] = useState({ amenities: [], maxPrice: null })
  const [selected, setSelected] = useState(null)

  /** Filter parkings by active filters */
  const filtered = useMemo(
    () =>
      PARKINGS.filter((p) => {
        if (filters.maxPrice && p.pricePerHour > filters.maxPrice) return false
        if (
          filters.amenities?.length > 0 &&
          !filters.amenities.every((a) => p.amenities.includes(a))
        )
          return false
        return true
      }),
    [filters]
  )

  /** Handle clicks on "Prenota ora" buttons inside Leaflet popups */
  const handlePopupClick = useCallback(
    (e) => {
      const btn = e.target.closest('[data-id]')
      if (btn) navigate(`/booking/${btn.dataset.id}`)
    },
    [navigate]
  )

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

    // Remove old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    // Add new markers
    filtered.forEach((parking) => {
      const marker = L.marker([parking.lat, parking.lng], {
        icon: makeParkingIcon(parking.availableSpots, parking.totalSpots),
      })
        .addTo(map)
        .bindPopup(makePopupHtml(parking), {
          maxWidth: 260,
          className: 'parkly-popup',
        })
        .on('click', () => setSelected(parking))

      markersRef.current.push(marker)
    })
  }, [filtered])

  /** Recenter map to default view */
  function recenter() {
    mapRef.current?.setView(CENTER, ZOOM)
  }

  const ratio = selected ? selected.availableSpots / selected.totalSpots : 1
  const availVariant = ratio > 0.5 ? 'success' : ratio > 0.2 ? 'warning' : 'danger'

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
                {selected.address}, {selected.city}
              </p>
              <div className="flex items-center gap-1 text-warning text-sm mt-1">
                <Star className="h-3.5 w-3.5 fill-warning" />
                {selected.rating.toFixed(1)}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {selected.amenities.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 items-end flex-shrink-0">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(selected.pricePerHour)}
                  <span className="text-sm font-normal text-white/50">/ora</span>
                </p>
                <Badge variant={availVariant} className="mt-1">
                  <Car className="h-3 w-3 mr-1 inline" />
                  {selected.availableSpots}/{selected.totalSpots} posti
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
