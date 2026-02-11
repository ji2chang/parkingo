import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation } from 'lucide-react'
import ParkingInfoCard from '../components/ParkingInfoCard'

// Mock data - in produzione sostituire con chiamate API
const mockParkings = [
  {
    id: 1,
    name: 'Central Plaza Parking',
    address: 'Via Roma 123, Milano',
    lat: 45.464,
    lng: 9.19,
    pricePerHour: 5,
    totalSpots: 120,
    availableSpots: 65,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
      { id: 'C', name: 'Zona C' },
      { id: 'EL', name: 'Zona Elettrica' },
    ],
  },
  {
    id: 2,
    name: 'Dorumcy Parking',
    address: 'Corso Venezia 45, Milano',
    lat: 45.472,
    lng: 9.195,
    pricePerHour: 4,
    totalSpots: 80,
    availableSpots: 12,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
      { id: 'PR', name: 'Zona Premium' },
    ],
  },
  {
    id: 3,
    name: 'Fikon Parking',
    address: 'Via Torino 88, Milano',
    lat: 45.458,
    lng: 9.182,
    pricePerHour: 3.5,
    totalSpots: 60,
    availableSpots: 45,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
    ],
  },
  {
    id: 4,
    name: 'Identral Plaza Parking',
    address: 'Piazza Duomo 12, Milano',
    lat: 45.457,
    lng: 9.201,
    pricePerHour: 6,
    totalSpots: 150,
    availableSpots: 5,
    zones: [
      { id: 'A', name: 'Zona A' },
      { id: 'B', name: 'Zona B' },
      { id: 'C', name: 'Zona C' },
      { id: 'EL', name: 'Zona Elettrica' },
      { id: 'PR', name: 'Zona Premium' },
    ],
  },
]

const CityMap = () => {
  const [selectedParking, setSelectedParking] = useState(null)
  const navigate = useNavigate()

  const handleSelectParking = (parking) => {
    navigate(`/parking/${parking.id}`, { state: { parking } })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Map area - placeholder for real Google Maps integration */}
      <div className="relative flex-1 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
        {/* Mock map with markers */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/9.19,45.464,13,0/1200x800@2x?access_token=pk.mock')] bg-cover bg-center opacity-60"></div>

        {/* Mock parking markers */}
        <div className="absolute inset-0">
          {mockParkings.map((parking) => (
            <button
              key={parking.id}
              onClick={() => setSelectedParking(parking)}
              className={`absolute p-3 rounded-full transition-all duration-300 hover:scale-110
                ${selectedParking?.id === parking.id ? 'bg-blue-600 shadow-2xl ring-4 ring-blue-300' : 'bg-blue-700 shadow-lg hover:bg-blue-600'}`}
              style={{
                left: `${20 + parking.id * 15}%`,
                top: `${30 + parking.id * 10}%`,
              }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </button>
          ))}
        </div>

        {/* Floating header */}
        <div className="absolute top-6 left-6 right-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trova un parcheggio</h1>
              <p className="text-gray-600 text-sm">Seleziona un marker sulla mappa</p>
            </div>
            <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating info card */}
        {selectedParking && (
          <div className="absolute bottom-6 left-6 w-96 animate-[slideUp_0.3s_ease-out]">
            <ParkingInfoCard
              parking={selectedParking}
              onSelect={handleSelectParking}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CityMap
