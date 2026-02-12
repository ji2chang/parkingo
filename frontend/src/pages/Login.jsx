import React, { useState } from 'react'
import { Eye, EyeOff, User, Lock, ParkingSquare, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!email.trim()) errs.email = 'Email obbligatoria'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email non valida'
    if (!password) errs.password = 'Password obbligatoria'
    else if (password.length < 6) errs.password = 'Minimo 6 caratteri'
    return errs
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem('user', JSON.stringify({ email }))
    setLoading(false)
    navigate('/city-map')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1b3d] via-blue-800 to-teal-500 p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <ParkingSquare className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Smart Parking</h1>
          <p className="text-white/50 text-sm">Accedi al tuo account</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30
                    focus:outline-none focus:ring-2 focus:bg-white/10 transition-all text-sm
                    ${errors.email ? 'border-red-400 focus:ring-red-400/50' : 'border-white/15 focus:ring-teal-400/50'}`}
                />
              </div>
              {errors.email && <p className="text-red-300 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30
                    focus:outline-none focus:ring-2 focus:bg-white/10 transition-all text-sm
                    ${errors.password ? 'border-red-400 focus:ring-red-400/50' : 'border-white/15 focus:ring-teal-400/50'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-teal-500 focus:ring-teal-500/50"
                />
                Ricordami
              </label>
              <button
                type="button"
                className="text-teal-300 hover:text-teal-200 transition text-sm"
              >
                Password dimenticata?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50 text-gray-900 font-bold
                rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-400/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                'Accedi'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-white/30 text-xs">oppure</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            {/* Register link */}
            <p className="text-center text-white/50 text-sm">
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-teal-300 hover:text-teal-200 font-semibold transition"
              >
                Registrati
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
