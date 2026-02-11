import React, { useState } from 'react'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login - in produzione collegare all'API
    localStorage.setItem('user', JSON.stringify({ email }))
    navigate('/city-map')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-teal-400 p-4">
      {/* Glassmorphism card */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Smart Parking</h1>
          <h2 className="text-2xl font-semibold text-white/90">Reservation System</h2>
        </div>

        <div
          className="backdrop-blur-lg bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30"
          style={{
            boxShadow:
              '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 100px rgba(255, 255, 255, 0.1)',
          }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username/Email field */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Username/Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username/Email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/30 
                           text-white placeholder-white/50 focus:outline-none focus:ring-2 
                           focus:ring-white/50 backdrop-blur-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/30 
                           text-white placeholder-white/50 focus:outline-none focus:ring-2 
                           focus:ring-white/50 backdrop-blur-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 
                           hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold 
                       rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Log In
            </button>

            {/* Links */}
            <div className="flex justify-between items-center text-sm text-white/90">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="hover:text-white transition underline"
              >
                Register Now
              </button>
              <button type="button" className="hover:text-white transition">
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
