import React from 'react'
import { MapPin, Clock, Euro } from 'lucide-react'

const ParkingInfoCard = ({ parking, onSelect }) => {
  const getAvailabilityLevel = () => {
    const percentage = (parking.availableSpots / parking.totalSpots) * 100
    if (percentage > 50) return { text: 'Alta disponibilità', color: 'text-green-600' }
    if (percentage > 20) return { text: 'Media disponibilità', color: 'text-orange-600' }
    return { text: 'Bassa disponibilità', color: 'text-red-600' }
  }

  const availability = getAvailabilityLevel()

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{parking.name}</h3>
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <p className="text-sm">{parking.address}</p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3">
          <Euro className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Tariffa oraria</p>
            <p className="text-lg font-bold text-gray-900">€{parking.pricePerHour}/h</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Disponibilità</p>
            <p className={`text-sm font-semibold ${availability.color}`}>
              {availability.text}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm text-gray-600 mb-2">Zone disponibili:</p>
        <div className="flex flex-wrap gap-2">
          {parking.zones.map((zone) => (
            <span
              key={zone.id}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
            >
              {zone.name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSelect(parking)}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
      >
        Visualizza Parcheggio
      </button>
    </div>
  )
}

export default ParkingInfoCard
