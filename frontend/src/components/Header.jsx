import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ParkingSquare,
  Menu,
  X,
  Search,
  User,
  Bell,
  ChevronDown,
} from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('user') || 'null')
    }
    return null
  })

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
   const syncUser = () => {
    const updated = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(updated)
  }
  window.addEventListener('storage', syncUser)
    document.addEventListener('click', onDocClick)
    return () => {
      window.removeEventListener('storage', syncUser)
      document.removeEventListener('click', onDocClick)
    }
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/city-map', label: 'Mappa' },
    { to: '/about', label: 'Chi siamo' },
    { to: '/contact', label: 'Contatti' },
  ]

  if (user && user.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin' })
  }

  const isActive = (path) => location.pathname === path

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return navigate('/city-map')
    navigate('/city-map', { state: { q: query } })
  }

  

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#08102a] via-[#0f1b3d] to-[#10243a] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 mr-2" aria-label="Smart Parking home">
            <div className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center">
              <ParkingSquare className="w-5 h-5 text-teal-400" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold leading-tight">Smart Parking</span>
              <div className="text-xs text-white/50">Zone · Elettrico · Premium</div>
            </div>
          </Link>

          {/* Center: Nav + Search (desktop) */}
          <div className="flex-1 flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive(link.to) ? 'bg-white/8 text-teal-300 ring-1 ring-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative max-w-xl mx-auto">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  aria-label="Cerca parcheggio, città o indirizzo"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/6 placeholder-white/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:bg-white/10 transition"
                  placeholder="Cerca città, indirizzo o parcheggio"
                />
              </div>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/city-map')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-gray-900 text-sm font-semibold rounded-xl shadow-sm shadow-teal-500/20 transition"
              aria-label="Prenota ora"
            >
              Book Now
            </button>

            <button className="hidden sm:inline-flex p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition" aria-label="Notifiche">
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/6 hover:bg-white/8 rounded-full transition text-sm"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/90 font-bold text-sm">
                  {user ? (user.email?.charAt(0) || 'U').toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <span className="hidden sm:inline text-sm text-white/90">{user ? user.email.split('@')[0] : 'Account'}</span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg text-sm">
                  <Link to="/parkings" className="block px-4 py-2 hover:bg-white/6" onClick={() => setProfileOpen(false)}>
                    Le mie prenotazioni
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-white/6" onClick={() => setProfileOpen(false)}>
                    Profilo
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user')
                      setProfileOpen(false)
                      navigate('/')
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/6"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
                aria-label="Apri menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-gradient-to-b from-[#0f1b3d] to-[#081426]">
          <div className="px-4 py-5 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition
                  ${isActive(link.to) ? 'bg-white/8 text-teal-300' : 'text-white/80 hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}

            <form onSubmit={(e) => { e.preventDefault(); navigate('/city-map', { state: { q: query } }); setMobileOpen(false) }} className="px-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-white/50"><Search className="w-4 h-4" /></span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/6 placeholder-white/40 text-white text-sm focus:outline-none"
                  placeholder="Cerca città o indirizzo"
                />
              </div>
            </form>

            <div className="flex gap-3">
              <button
                onClick={() => { setMobileOpen(false); navigate('/login') }}
                className="flex-1 px-4 py-2 bg-white/6 rounded-lg text-sm"
              >
                Accedi
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/city-map') }}
                className="flex-1 px-4 py-2 bg-teal-500 text-gray-900 font-semibold rounded-lg text-sm"
              >
                Prenota
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
