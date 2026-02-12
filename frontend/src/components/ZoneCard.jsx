import React from 'react'

const ZoneCard = ({ zone, onSelect, isSelected }) => {
  const getAvailabilityColor = () => {
    if (zone.available === 0) return 'bg-red-500'
    if (zone.available < 5) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getAvailabilityText = () => {
    if (zone.available === 0) return 'Pieno'
    if (zone.available < 5) return 'Quasi pieno'
    return 'Disponibile'
  }

  return (
    <div
      onClick={() => onSelect && onSelect(zone)}
      className={`
        relative p-6 rounded-2xl border-2 cursor-pointer
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${isSelected ? 'border-blue-600 shadow-lg ring-4 ring-blue-200' : 'border-gray-200'}
        ${zone.available === 0 ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      style={{
        backgroundColor: zone.available === 0 ? '#fee2e2' : '#ffffff',
      }}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <div className={`w-3 h-3 rounded-full ${getAvailabilityColor()}`}></div>
      </div>

      {/* Zone header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{zone.name}</h3>
        {zone.isSpecial && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {zone.specialType}
          </span>
        )}
      </div>

      {/* Availability */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-sm font-semibold ${getAvailabilityColor().replace('bg-', 'text-')}`}
          >
            {getAvailabilityText()}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          {zone.available} / {zone.total} posti disponibili
        </p>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{zone.pricePerHour}€</p>
          <p className="text-xs text-gray-500">per ora</p>
        </div>
        {zone.available > 0 && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation()
              onSelect && onSelect(zone)
            }}
          >
            Seleziona
          </button>
        )}
      </div>
    </div>
  )
}

export default ZoneCard
