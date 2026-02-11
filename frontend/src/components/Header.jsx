import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ParkingSquare } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <ParkingSquare className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Smart Parking</h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-teal-300 transition font-medium">
            Home
          </Link>
          <Link to="/city-map" className="hover:text-teal-300 transition font-medium">
            Parking
          </Link>
          <Link to="/parkings" className="hover:text-teal-300 transition font-medium">
            About
          </Link>
          <button
            onClick={() => navigate('/login')}
            className="hover:text-teal-300 transition font-medium"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/city-map')}
            className="px-6 py-2 bg-teal-400 hover:bg-teal-500 text-gray-900 font-bold 
                     rounded-lg transition-all"
          >
            Book Now
          </button>
        </nav>
      </div>
    </header>
  )
}
