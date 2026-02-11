import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Car, CreditCard, MapPin } from 'lucide-react'

const Booking = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { parking, zone } = location.state || {}

  const [formData, setFormData] = useState({
    date: '',
    entryTime: '',
    exitTime: '',
    vehicleType: 'Car',
    licensePlate: '',
  })

  const calculateDuration = () => {
    if (!formData.entryTime || !formData.exitTime) return 0
    const entry = new Date(`2000-01-01 ${formData.entryTime}`)
    const exit = new Date(`2000-01-01 ${formData.exitTime}`)
    const diff = (exit - entry) / (1000 * 60 * 60)
    return diff > 0 ? diff : 0
  }

  const duration = calculateDuration()
  const totalCost = duration * (zone?.pricePerHour || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock booking confirmation
    alert('Prenotazione confermata!')
    navigate('/city-map')
  }

  if (!parking || !zone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Dati mancanti. Torna alla mappa.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prenota la tua zona</h1>
              <p className="text-sm text-gray-600">Completa i dettagli per confermare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dettagli prenotazione</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                {/* Time inputs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-2" />
                      Orario entrata
                    </label>
                    <input
                      type="time"
                      value={formData.entryTime}
                      onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                               focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-2" />
                      Orario uscita
                    </label>
                    <input
                      type="time"
                      value={formData.exitTime}
                      onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                               focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                {/* Vehicle type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Car className="inline w-4 h-4 mr-2" />
                    Tipo veicolo
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option>Car</option>
                    <option>SUV</option>
                    <option>Motorcycle</option>
                    <option>Van</option>
                  </select>
                </div>

                {/* License plate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    Targa
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
                    }
                    placeholder="AA123BB"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                             focus:ring-blue-500 focus:border-blue-500 transition uppercase"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl 
                           hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Conferma Prenotazione
                </button>
              </form>
            </div>
          </div>

          {/* Summary column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Riepilogo</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Parcheggio</p>
                    <p className="font-semibold text-gray-900">{parking.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Zona selezionata</p>
                    <p className="font-semibold text-gray-900">{zone.name}</p>
                    {zone.isSpecial && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {zone.specialType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                  <Clock className="w-5 h-5 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Durata</p>
                    <p className="font-semibold text-gray-900">
                      {duration > 0 ? `${duration.toFixed(1)} ore` : 'Non calcolata'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Tariffa oraria</span>
                  <span className="font-semibold text-gray-900">€{zone.pricePerHour}/h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Totale</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Il prezzo finale potrebbe variare in base all'orario effettivo di uscita
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
