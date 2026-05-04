import { NavLink, useNavigate } from 'react-router-dom'
import { MapPin, ParkingSquare, Menu, X, Car, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const LINKS = [
  { to: '/', label: 'Home', icon: <ParkingSquare className="h-4 w-4" />, end: true },
  { to: '/booking', label: 'Prenotare', icon: <Car className="h-4 w-4" /> },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [user, setUser] = useState(() => {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('user') || 'null')
      }
      return null
    })
  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/10">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-xl text-white hover:text-primary-light transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
            P
          </span>
          parkingo
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {LINKS.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary-light'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 bg-teal-500 hover:bg-teal-400 transition"
              >
                <User className="h-4 w-4" />
                {user || 'Profilo'}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 bg-teal-500 hover:bg-teal-400 transition"
              >
                Signin
              </button>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {LINKS.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary-light'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/profile')
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-900 bg-teal-500 hover:bg-teal-400 transition"
                >
                  <User className="h-4 w-4" />
                  {user?.nome || user?.firstName || 'Profilo'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/login')
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/signin')
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-900 bg-teal-500 hover:bg-teal-400 transition"
                >
                  Signin
                </button>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
