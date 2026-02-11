import React, { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Star } from 'lucide-react'
import ZoneCard from '../components/ZoneCard'

// Mock zones data - in produzione da API
const mockZones = {
  1: [
    {
      id: 'A',
      name: 'Zona A',
      available: 25,
      total: 30,
      pricePerHour: 5,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'B',
      name: 'Zona B',
      available: 18,
      total: 30,
      pricePerHour: 5,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'C',
      name: 'Zona C',
      available: 22,
      total: 30,
      pricePerHour: 5,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'EL',
      name: 'Zona Elettrica',
      available: 5,
      total: 15,
      pricePerHour: 7,
      floor: 0,
      isSpecial: true,
      specialType: '⚡ Elettrica',
    },
    {
      id: 'PR',
      name: 'Zona Premium',
      available: 3,
      total: 15,
      pricePerHour: 10,
      floor: 0,
      isSpecial: true,
      specialType: '★ Premium',
    },
  ],
  2: [
    {
      id: 'A',
      name: 'Zona A',
      available: 8,
      total: 20,
      pricePerHour: 4,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'B',
      name: 'Zona B',
      available: 4,
      total: 20,
      pricePerHour: 4,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'PR',
      name: 'Zona Premium',
      available: 0,
      total: 10,
      pricePerHour: 8,
      floor: 0,
      isSpecial: true,
      specialType: '★ Premium',
    },
  ],
  3: [
    {
      id: 'A',
      name: 'Zona A',
      available: 30,
      total: 30,
      pricePerHour: 3.5,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'B',
      name: 'Zona B',
      available: 15,
      total: 30,
      pricePerHour: 3.5,
      floor: 0,
      isSpecial: false,
    },
  ],
  4: [
    {
      id: 'A',
      name: 'Zona A',
      available: 2,
      total: 40,
      pricePerHour: 6,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'B',
      name: 'Zona B',
      available: 2,
      total: 40,
      pricePerHour: 6,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'C',
      name: 'Zona C',
      available: 1,
      total: 40,
      pricePerHour: 6,
      floor: 0,
      isSpecial: false,
    },
    {
      id: 'EL',
      name: 'Zona Elettrica',
      available: 0,
      total: 15,
      pricePerHour: 8,
      floor: 0,
      isSpecial: true,
      specialType: '⚡ Elettrica',
    },
    {
      id: 'PR',
      name: 'Zona Premium',
      available: 0,
      total: 15,
      pricePerHour: 12,
      floor: 0,
      isSpecial: true,
      specialType: '★ Premium',
    },
  ],
}

const ParkingZoneMap = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const parking = location.state?.parking

  const [selectedLevel, setSelectedLevel] = useState('Level 1')
  const [selectedZone, setSelectedZone] = useState(null)

  const zones = mockZones[id] || []

  const handleZoneSelect = (zone) => {
    if (zone.available > 0) {
      setSelectedZone(zone)
    }
  }

  const handleConfirm = () => {
    if (selectedZone) {
      navigate('/booking', {
        state: {
          parking,
          zone: selectedZone,
        },
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {parking?.name || 'Parcheggio'}
                </h1>
                <p className="text-sm text-gray-600">Seleziona una zona disponibile</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLevel('Level 1')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${selectedLevel === 'Level 1' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Level 1
              </button>
              <button
                onClick={() => setSelectedLevel('Level 2')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${selectedLevel === 'Level 2' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Level 2
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Smart Parking Reservation System</h2>
          <p className="text-gray-600">
            Zone disponibili - Piano {selectedLevel === 'Level 1' ? '1' : '2'}
          </p>
        </div>

        {/* Zone grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              onSelect={handleZoneSelect}
              isSelected={selectedZone?.id === zone.id}
            />
          ))}
        </div>

        {/* Confirm button */}
        {selectedZone && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
            <button
              onClick={handleConfirm}
              className="px-8 py-4 bg-blue-900 text-white font-bold text-lg rounded-2xl 
                       shadow-2xl hover:bg-blue-800 transition-all duration-300 hover:scale-105"
            >
              Conferma Selezione
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParkingZoneMap
