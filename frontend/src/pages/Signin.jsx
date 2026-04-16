import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export function SigninPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setError('Compila tutti i campi')
      return
    }
    if (password !== confirmPassword) {
      setError('Le password non corrispondono')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await api.signinUser({ firstName, lastName, username, email, password })
      
      if (result && result.success) {
        navigate('/login?username=' + encodeURIComponent(username))
      } else {
        setError(result?.message || 'Errore durante la registrazione')
      }
    } catch (err) {
      setError(err.message || 'Errore di connessione. Riprova più tardi.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="glass-panel p-8 rounded-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Registrati</h2>
          <p className="text-sm text-white/60 mt-1">Crea un account per iniziare a prenotare.</p>
        </div>

        {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-1">Nome</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
                placeholder="Mario"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Cognome</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
                placeholder="Rossi"
                disabled={loading}
              />
            </div>
          </div>

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
            <label className="block text-sm text-white/80 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
              placeholder="esempio@parko.local"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm text-white/80 mb-1">Conferma password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-600 disabled:cursor-not-allowed rounded-2xl text-gray-900 font-semibold transition"
          >
            {loading ? 'Creazione in corso...' : 'Crea account'}
          </button>
        </form>

        <div className="text-center text-sm text-white/60">
          Hai già un account?{' '}
          <button type="button" onClick={() => navigate('/login')} className="text-white underline">
            Accedi
          </button>
        </div>
      </div>
    </div>
  )
}

export default SigninPage
