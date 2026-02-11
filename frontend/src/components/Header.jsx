import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ParkingSquare, Menu, X } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/city-map', label: 'Parking' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-[#0f1b3d] text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <ParkingSquare className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-xl font-bold tracking-tight">Smart Parking</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.to) ? 'bg-white/10 text-teal-300' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => navigate('/login')}
              className="ml-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition"
            >
              Log in
            </button>

            <button
              onClick={() => navigate('/city-map')}
              className="ml-1 px-5 py-2 bg-teal-500 hover:bg-teal-400 text-gray-900 text-sm font-bold rounded-lg transition-all duration-200 shadow-lg shadow-teal-500/25"
            >
              Book Now
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0f1b3d]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition
                  ${isActive(link.to) ? 'bg-white/10 text-teal-300' : 'text-white/80 hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false)
                navigate('/login')
              }}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5 rounded-lg"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setMobileOpen(false)
                navigate('/city-map')
              }}
              className="block w-full mt-2 px-4 py-3 bg-teal-500 text-gray-900 text-sm font-bold rounded-lg text-center"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
