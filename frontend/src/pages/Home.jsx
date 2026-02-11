import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Lock, DollarSign } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
      {/* Hero section with city background */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000')",
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>

        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Find and Reserve Your
            <br />
            Spot in Seconds
          </h1>
          <p className="text-xl text-white/90 mb-8">Smart Parking Reservation System</p>
          <button
            onClick={() => navigate('/city-map')}
            className="px-8 py-4 bg-teal-400 hover:bg-teal-500 text-gray-900 font-bold text-lg 
                     rounded-xl transition-all duration-300 shadow-2xl hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Time Saving */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-2xl mb-4">
                <Clock className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time Saving</h3>
              <p className="text-gray-600 leading-relaxed">
                Evrymitiion; speed up spots for insrvorn: and se miore ilost time saving.
              </p>
            </div>

            {/* Secure Booking */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-2xl mb-4">
                <Lock className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure coniection cirovuier reabiuzone system and secure booking.
              </p>
            </div>

            {/* Best Rates */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-2xl mb-4">
                <DollarSign className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Rates</h3>
              <p className="text-gray-600 leading-relaxed">
                Best rates to gnstae a money for your compositions or alise prices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
