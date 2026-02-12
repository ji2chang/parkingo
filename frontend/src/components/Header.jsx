import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ParkingSquare, Menu, X, User, Bell, ChevronDown } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/city-map', label: 'Mappa Parcheggi' },
    { to: '/about', label: 'Chi siamo' },
    { to: '/contact', label: 'Contatti' },
  ]

  const isActive = (path) => location.pathname === path

  const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-md'
          : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Smart Parking - Pagina Iniziale"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-500 border border-teal-400 flex items-center justify-center">
                <ParkingSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold leading-tight hidden sm:inline text-slate-900">
                Smart Parking
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      isActive(link.to)
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:inline-flex p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Notifiche"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full transition text-sm"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                    {(user.email?.charAt(0) || 'U').toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium text-slate-900">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg text-sm py-1">
                    <Link
                      to="/parkings"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Le mie prenotazioni
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profilo
                    </Link>
                    <div className="border-t border-slate-200 my-1" />
                    <button
                      onClick={() => {
                        localStorage.removeItem('user')
                        setProfileOpen(false)
                        navigate('/')
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition"
                >
                  Accedi
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-full transition shadow-sm"
                >
                  Registrati
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
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
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg">
          <div className="px-4 py-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition
                  ${
                    isActive(link.to)
                      ? 'bg-slate-800 text-teal-300'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-700 pt-4 mt-4 space-y-3">
              {user ? (
                <>
                  <Link
                    to="/parkings"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-200"
                  >
                    Le mie prenotazioni
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user')
                      setMobileOpen(false)
                      navigate('/')
                    }}
                    className="w-full text-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      navigate('/login')
                    }}
                    className="flex-1 px-4 py-3 bg-slate-800 rounded-lg text-sm font-semibold text-slate-200"
                  >
                    Accedi
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      navigate('/register')
                    }}
                    className="flex-1 px-4 py-3 bg-teal-500 text-slate-900 rounded-lg text-sm font-semibold"
                  >
                    Registrati
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
