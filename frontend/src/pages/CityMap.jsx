import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation, Search, X, Car, Zap, Star } from 'lucide-react'
import ParkingInfoCard from '../components/ParkingInfoCard'

const mockParkings = [
  {
    id: 1,
    name: 'Central Plaza Parking',
    address: 'Via Roma 123, Milano',
    pricePerHour: 5,
    totalSpots: 120,
    availableSpots: 65,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
      { id: 'C', name: 'Zona C' },
      { id: 'EL', name: 'Elettrica' },
    ],
    position: { top: '22%', left: '28%' },
  },
  {
    id: 2,
    name: 'Dorumcy Parking',
    address: 'Corso Venezia 45, Milano',
    pricePerHour: 4,
    totalSpots: 80,
    availableSpots: 12,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
      { id: 'PR', name: 'Premium' },
    ],
    position: { top: '38%', left: '62%' },
  },
  {
    id: 3,
    name: 'Fikon Parking',
    address: 'Via Torino 88, Milano',
    pricePerHour: 3.5,
    totalSpots: 60,
    availableSpots: 45,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
    ],
    position: { top: '60%', left: '35%' },
  },
  {
    id: 4,
    name: 'Piazza Duomo Parking',
    address: 'Piazza Duomo 12, Milano',
    pricePerHour: 6,
    totalSpots: 150,
    availableSpots: 5,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
      { id: 'C', name: 'Zona C' },
      { id: 'EL', name: 'Elettrica' },
      { id: 'PR', name: 'Premium' },
    ],
    position: { top: '48%', left: '44%' },
  },
]

const getAvailColor = (p) => {
  const pct = (p.availableSpots / p.totalSpots) * 100
  if (pct > 50) return { ring: 'ring-emerald-400', bg: 'bg-emerald-500', pulse: 'bg-emerald-400' }
  if (pct > 15) return { ring: 'ring-orange-400', bg: 'bg-orange-500', pulse: 'bg-orange-400' }
  return { ring: 'ring-red-400', bg: 'bg-red-500', pulse: 'bg-red-400' }
}

const CityMap = () => {
  const [selectedParking, setSelectedParking] = useState(null)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()

  const handleSelectParking = (parking) => {
    navigate(`/parking/${parking.id}`, { state: { parking } })
  }

  const filtered = search
    ? mockParkings.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.address.toLowerCase().includes(search.toLowerCase())
      )
    : mockParkings

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col">
      {/* ── MAP AREA ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* CSS city map background */}
        <div className="absolute inset-0 bg-[#e8e0d8]">
          {/* Water / park areas */}
          <div className="absolute top-0 right-0 w-1/4 h-full bg-[#b8d4e3]/40" />
          <div className="absolute top-[15%] left-[10%] w-28 h-28 rounded-full bg-emerald-200/50" />
          <div className="absolute bottom-[10%] right-[20%] w-40 h-24 rounded-[40%] bg-emerald-200/40" />

          {/* Street grid */}
          {/* Horizontal roads */}
          <div className="absolute top-[20%] left-0 w-full h-[3px] bg-white/70" />
          <div className="absolute top-[35%] left-0 w-full h-[2px] bg-white/50" />
          <div className="absolute top-[50%] left-[5%] w-[90%] h-[4px] bg-white/80 rounded" />
          <div className="absolute top-[65%] left-0 w-full h-[2px] bg-white/50" />
          <div className="absolute top-[80%] left-0 w-full h-[3px] bg-white/70" />

          {/* Vertical roads */}
          <div className="absolute left-[15%] top-0 w-[2px] h-full bg-white/50" />
          <div className="absolute left-[30%] top-0 w-[3px] h-full bg-white/70" />
          <div className="absolute left-[45%] top-0 w-[4px] h-full bg-white/80" />
          <div className="absolute left-[60%] top-0 w-[2px] h-full bg-white/50" />
          <div className="absolute left-[75%] top-0 w-[3px] h-full bg-white/70" />

          {/* Building blocks */}
          <div className="absolute top-[7%] left-[17%] w-20 h-14 rounded-md bg-[#d5cbbf] shadow-sm" />
          <div className="absolute top-[8%] left-[47%] w-16 h-20 rounded-md bg-[#d0c5b8] shadow-sm" />
          <div className="absolute top-[25%] left-[33%] w-14 h-12 rounded-md bg-[#cec4b8] shadow-sm" />
          <div className="absolute top-[40%] left-[17%] w-18 h-16 rounded-md bg-[#d3c9bc] shadow-sm" />
          <div className="absolute top-[55%] left-[50%] w-20 h-12 rounded-md bg-[#d5cbbf] shadow-sm" />
          <div className="absolute top-[70%] left-[40%] w-16 h-14 rounded-md bg-[#cec4b8] shadow-sm" />
          <div className="absolute top-[72%] left-[65%] w-14 h-18 rounded-md bg-[#d0c5b8] shadow-sm" />
          <div className="absolute top-[28%] left-[68%] w-20 h-10 rounded-md bg-[#d3c9bc] shadow-sm" />
        </div>

        {/* ── MARKERS ── */}
        <div className="absolute inset-0">
          {filtered.map((parking) => {
            const color = getAvailColor(parking)
            const isActive = selectedParking?.id === parking.id
            return (
              <button
                key={parking.id}
                onClick={() => setSelectedParking(isActive ? null : parking)}
                className={`absolute group transition-all duration-300 z-10
                  ${isActive ? 'z-20 scale-110' : 'hover:scale-110'}`}
                style={{ top: parking.position.top, left: parking.position.left }}
              >
                {/* Pulse ring */}
                <span
                  className={`absolute inset-0 rounded-full ${color.pulse} animate-ping opacity-30`}
                  style={{ animationDuration: '2s' }}
                />
                {/* Marker dot */}
                <span
                  className={`relative flex items-center justify-center w-11 h-11 rounded-full shadow-lg
                    ${isActive ? `${color.bg} ring-4 ${color.ring} ring-offset-2` : `${color.bg} ring-2 ring-white`}
                    transition-all duration-200`}
                >
                  <Car className="w-5 h-5 text-white" />
                </span>
                {/* Label */}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded-md shadow
                    ${isActive ? 'bg-[#0f1b3d] text-white' : 'bg-white text-gray-800'}
                    transition-all duration-200`}
                >
                  {parking.availableSpots} liberi
                </span>
              </button>
            )
          })}
        </div>

        {/* ── FLOATING SEARCH BAR ── */}
        <div className="absolute top-4 left-4 right-4 z-30">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca parcheggio o indirizzo..."
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="h-6 w-px bg-gray-200" />
              <button className="p-2 bg-[#0f1b3d] text-white rounded-xl hover:bg-[#162550] transition">
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── LEGEND ── */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Alta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Media
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Bassa
          </span>
        </div>

        {/* ── LIST TOGGLE (mobile) ── */}
        <div className="absolute top-20 right-4 z-20 sm:hidden">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-3 bg-white rounded-xl shadow-lg"
          >
            <MapPin className="w-5 h-5 text-[#0f1b3d]" />
          </button>
        </div>

        {/* ── SIDEBAR LIST (desktop) ── */}
        <div className="absolute top-20 right-4 bottom-4 w-80 z-20 hidden sm:block overflow-y-auto rounded-2xl">
          <div className="space-y-3">
            {filtered.map((p) => {
              const color = getAvailColor(p)
              const isActive = selectedParking?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedParking(p)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-md border-2 transition-all duration-200 hover:shadow-lg
                    ${isActive ? 'border-teal-500' : 'border-transparent'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{p.name}</h3>
                    <span className={`flex-shrink-0 w-3 h-3 rounded-full ${color.bg}`} />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{p.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      {p.availableSpots}/{p.totalSpots} posti
                    </span>
                    <span className="text-xs font-bold text-teal-600">€{p.pricePerHour}/h</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.zones.map((z) => (
                      <span
                        key={z.id}
                        className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600"
                      >
                        {z.name}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── FLOATING INFO CARD (on marker click) ── */}
        {selectedParking && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-96 z-30 animate-[slideUp_0.3s_ease-out]">
            <ParkingInfoCard parking={selectedParking} onSelect={handleSelectParking} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CityMap
