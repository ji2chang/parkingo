import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  // Auto-fill username from registration
  useEffect(() => {
    const registeredUsername = searchParams.get('username')
    if (registeredUsername) {
      setUsername(registeredUsername)
    }
  }, [searchParams])

  const submit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Nome utente e password sono obbligatori')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await api.loginUser({ username, password })
      
      if (result && result.token && result.user) {
        login(result.token, result.user)
        navigate(redirectTo)
      } else {
        setError('Errore durante il login')
      }
    } catch (err) {
      setError(err.message || 'Errore di connessione. Verifica i dati.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Accedi</h2>
          <p className="text-sm text-white/60 mt-1">Usa il tuo nome utente per entrare nell'account.</p>
        </div>

        {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">Nome utente</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
              placeholder="nome_utente"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-600 disabled:cursor-not-allowed rounded-2xl text-gray-900 font-semibold transition"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-sm text-white/60">
          Non hai un account?{' '}
          <Link to="/signin" className="text-white underline">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
