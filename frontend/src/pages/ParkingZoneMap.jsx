import React, { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Star, Layers, Car } from 'lucide-react'

/* ── Mock zone data per parking per level ── */
const mockZones = {
  1: {
    1: [
      { id: 'A', name: 'Zona A', available: 25, total: 30, pricePerHour: 5, isSpecial: false },
      { id: 'B', name: 'Zona B', available: 18, total: 30, pricePerHour: 5, isSpecial: false },
      { id: 'C', name: 'Zona C', available: 22, total: 30, pricePerHour: 5, isSpecial: false },
      { id: 'EL', name: 'Zona Elettrica', available: 5, total: 15, pricePerHour: 7, isSpecial: true, specialType: 'Elettrica' },
    ],
    2: [
      { id: 'D', name: 'Zona D', available: 12, total: 20, pricePerHour: 4, isSpecial: false },
      { id: 'PR', name: 'Zona Premium', available: 3, total: 15, pricePerHour: 10, isSpecial: true, specialType: 'Premium' },
    ],
  },
  2: {
    1: [
      { id: 'A', name: 'Zona A', available: 8, total: 20, pricePerHour: 4, isSpecial: false },
      { id: 'B', name: 'Zona B', available: 4, total: 20, pricePerHour: 4, isSpecial: false },
      { id: 'PR', name: 'Zona Premium', available: 0, total: 10, pricePerHour: 8, isSpecial: true, specialType: 'Premium' },
    ],
    2: [
      { id: 'C', name: 'Zona C', available: 15, total: 25, pricePerHour: 3.5, isSpecial: false },
    ],
  },
  3: {
    1: [
      { id: 'A', name: 'Zona A', available: 30, total: 30, pricePerHour: 3.5, isSpecial: false },
      { id: 'B', name: 'Zona B', available: 15, total: 30, pricePerHour: 3.5, isSpecial: false },
    ],
    2: [],
  },
  4: {
    1: [
      { id: 'A', name: 'Zona A', available: 2, total: 40, pricePerHour: 6, isSpecial: false },
      { id: 'B', name: 'Zona B', available: 2, total: 40, pricePerHour: 6, isSpecial: false },
      { id: 'EL', name: 'Zona Elettrica', available: 0, total: 15, pricePerHour: 8, isSpecial: true, specialType: 'Elettrica' },
    ],
    2: [
      { id: 'C', name: 'Zona C', available: 1, total: 40, pricePerHour: 6, isSpecial: false },
      { id: 'PR', name: 'Zona Premium', available: 0, total: 15, pricePerHour: 12, isSpecial: true, specialType: 'Premium' },
    ],
  },
}

/* ── Helpers ── */
const pct = (a, t) => Math.round((a / t) * 100)

const statusColor = (available, total) => {
  if (available === 0) return { bar: 'bg-red-500', text: 'text-red-600', label: 'Pieno', badge: 'bg-red-100 text-red-700' }
  const p = pct(available, total)
  if (p < 20) return { bar: 'bg-orange-500', text: 'text-orange-600', label: 'Quasi pieno', badge: 'bg-orange-100 text-orange-700' }
  return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Disponibile', badge: 'bg-emerald-100 text-emerald-700' }
}

const specialIcon = (type) => {
  if (type === 'Elettrica') return <Zap className="w-3.5 h-3.5" />
  if (type === 'Premium') return <Star className="w-3.5 h-3.5" />
  return null
}

const specialColor = (type) => {
  if (type === 'Elettrica') return 'bg-sky-100 text-sky-700 border-sky-200'
  if (type === 'Premium') return 'bg-amber-100 text-amber-700 border-amber-200'
  return ''
}

const ParkingZoneMap = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const parking = location.state?.parking

  const [level, setLevel] = useState(1)
  const [selectedZone, setSelectedZone] = useState(null)

  const parkingLevels = mockZones[id] || { 1: [], 2: [] }
  const zones = parkingLevels[level] || []
  const availableLevels = Object.keys(parkingLevels)
    .map(Number)
    .filter((l) => parkingLevels[l].length > 0)

  const totalAvail = zones.reduce((s, z) => s + z.available, 0)
  const totalAll = zones.reduce((s, z) => s + z.total, 0)

  const handleZoneSelect = (zone) => {
    if (zone.available > 0) setSelectedZone(zone.id === selectedZone?.id ? null : zone)
  }

  const handleConfirm = () => {
    if (selectedZone) {
      navigate('/booking', { state: { parking, zone: selectedZone } })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {parking?.name || 'Parcheggio'}
                </h1>
                <p className="text-sm text-gray-500">
                  {totalAvail}/{totalAll} posti disponibili — Piano {level}
                </p>
              </div>
            </div>

            {/* Level tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start">
              {availableLevels.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLevel(l)
                    setSelectedZone(null)
                  }}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                    ${level === l ? 'bg-[#0f1b3d] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Layers className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                  Piano {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ZONE GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {zones.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Nessuna zona su questo piano</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {zones.map((zone) => {
              const st = statusColor(zone.available, zone.total)
              const isActive = selectedZone?.id === zone.id
              const disabled = zone.available === 0
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone)}
                  disabled={disabled}
                  className={`text-left rounded-2xl border-2 p-6 transition-all duration-200 group
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : ''}
                    ${isActive ? 'border-teal-500 bg-teal-50/50 shadow-lg ring-2 ring-teal-200' : ''}
                    ${!disabled && !isActive ? 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md' : ''}
                  `}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{zone.name}</h3>
                      {zone.isSpecial && (
                        <span
                          className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${specialColor(zone.specialType)}`}
                        >
                          {specialIcon(zone.specialType)}
                          {zone.specialType}
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${st.badge}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">
                        <Car className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                        {zone.available} / {zone.total}
                      </span>
                      <span className={`font-bold ${st.text}`}>
                        {pct(zone.available, zone.total)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${st.bar} transition-all duration-500`}
                        style={{ width: `${pct(zone.available, zone.total)}%` }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-gray-900">
                      €{zone.pricePerHour}
                      <span className="text-sm font-normal text-gray-400">/h</span>
                    </span>
                    {!disabled && (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                          ${isActive ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#0f1b3d] group-hover:text-white'}`}
                      >
                        {isActive ? 'Selezionata ✓' : 'Seleziona'}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── CONFIRM BAR ── */}
      {selectedZone && (
        <div className="fixed bottom-0 left-0 right-0 z-30 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Zona selezionata</p>
                <p className="font-bold text-gray-900">
                  {selectedZone.name}{' '}
                  <span className="text-teal-600">— €{selectedZone.pricePerHour}/h</span>
                </p>
              </div>
              <button
                onClick={handleConfirm}
                className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-gray-900 font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200"
              >
                Conferma e Prenota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParkingZoneMap
