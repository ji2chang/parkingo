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
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-lg shadow-slate-200/50'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-18">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 shrink-0 group"
              aria-label="Smart Parking - Pagina Iniziale"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 border-2 border-teal-400/50 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-xl group-hover:shadow-teal-500/40 transition-all duration-200">
                <ParkingSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black leading-tight hidden sm:inline text-slate-900">
                Smart Parking
              </span>
            </Link>

            <nav
              className="hidden md:flex items-center gap-2"
              role="navigation"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                    ${
                      isActive(link.to)
                        ? 'bg-teal-50 text-teal-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:inline-flex p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              aria-label="Notifiche"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-full transition-all duration-200 text-sm shadow-sm"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Menu utente"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-teal-500/30">
                    {(user.email?.charAt(0) || 'U').toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-bold text-slate-900">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white/98 backdrop-blur-lg border-2 border-slate-200 rounded-2xl shadow-xl text-sm py-2"
                    role="menu"
                  >
                    <Link
                      to="/parkings"
                      className="block px-5 py-3 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      Le mie prenotazioni
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-5 py-3 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      Profilo
                    </Link>
                    <div className="border-t border-slate-200 my-2" />
                    <button
                      onClick={() => {
                        localStorage.removeItem('user')
                        setProfileOpen(false)
                        navigate('/')
                      }}
                      className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 font-medium transition-colors"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-all duration-200"
                >
                  Accedi
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-7 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-black rounded-full transition-all duration-200 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
                >
                  Registrati
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-slate-200 bg-white/98 backdrop-blur-lg shadow-xl">
          <div className="px-4 py-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-5 py-3.5 rounded-xl text-base font-bold transition-all duration-200
                  ${
                    isActive(link.to)
                      ? 'bg-teal-50 text-teal-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t-2 border-slate-200 pt-5 mt-5 space-y-3">
              {user ? (
                <>
                  <Link
                    to="/parkings"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-5 py-3.5 bg-slate-100 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-200 transition-all duration-200"
                    role="menuitem"
                  >
                    Le mie prenotazioni
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user')
                      setMobileOpen(false)
                      navigate('/')
                    }}
                    className="w-full text-center px-5 py-3.5 bg-red-50 text-red-500 rounded-xl text-base font-bold hover:bg-red-100 transition-all duration-200"
                    role="menuitem"
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
                    className="flex-1 px-5 py-3.5 bg-slate-100 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-200 transition-all duration-200"
                  >
                    Accedi
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      navigate('/register')
                    }}
                    className="flex-1 px-5 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl text-base font-black shadow-lg shadow-teal-500/30 hover:shadow-xl transition-all duration-200"
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
