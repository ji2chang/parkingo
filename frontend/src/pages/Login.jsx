import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    // This app uses a simple local auth shim. Replace with real auth when backend supports it.
    const user = { email, role }
    localStorage.setItem('user', JSON.stringify(user))
    navigate('/')
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4">Accedi</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Ruolo</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 rounded bg-white/5">
              <option value="user">Utente</option>
              <option value="admin">Amministratore</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-teal-500 rounded text-gray-900 font-semibold">Accedi</button>
            <button type="button" onClick={() => { setEmail('demo@parkingo.local'); setPassword('demo'); setRole('user') }} className="px-3 py-2 bg-white/6 rounded">Demo utente</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
