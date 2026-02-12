import React from 'react'
import { MapPin, Clock, Euro, Car, ArrowRight } from 'lucide-react'

const ParkingInfoCard = ({ parking, onSelect }) => {
  const pct = (parking.availableSpots / parking.totalSpots) * 100
  const status =
    pct > 50
      ? {
          text: 'Alta disponibilità',
          color: 'text-emerald-600',
          bar: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-700',
        }
      : pct > 15
        ? {
            text: 'Media disponibilità',
            color: 'text-orange-600',
            bar: 'bg-orange-500',
            badge: 'bg-orange-100 text-orange-700',
          }
        : {
            text: 'Bassa disponibilità',
            color: 'text-red-600',
            bar: 'bg-red-500',
            badge: 'bg-red-100 text-red-700',
          }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1 truncate">
            {parking.name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{parking.address}</span>
          </div>
        </div>
        <span
          className={`flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-bold ${status.badge}`}
        >
          {status.text}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">
            <Car className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            {parking.availableSpots} / {parking.totalSpots}
          </span>
          <span className={`font-bold ${status.color}`}>{Math.round(pct)}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${status.bar} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-sm">
          <Euro className="w-4 h-4 text-teal-600" />
          <span className="font-bold text-gray-900">€{parking.pricePerHour}</span>
          <span className="text-gray-400">/h</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {parking.zones.slice(0, 3).map((zone) => (
            <span
              key={zone.id}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600"
            >
              {zone.name}
            </span>
          ))}
          {parking.zones.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
              +{parking.zones.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(parking)}
        className="w-full py-2.5 bg-[#0f1b3d] hover:bg-[#162550] text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
      >
        Visualizza Zone <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ParkingInfoCard
