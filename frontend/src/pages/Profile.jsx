import { useState, useEffect } from 'react'

export function ProfilePage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(u)
    if (u) setEmail(u.email || '')
  }, [])

  const save = () => {
    const updated = { ...user, email }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    alert('Profilo aggiornato')
  }

  if (!user) return <div className="py-12 max-w-xl mx-auto">Devi effettuare il login per vedere il profilo.</div>

  return (
    <div className="py-12 max-w-xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Profilo</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-white/80 block mb-1">Email</label>
            <input className="w-full p-2 rounded bg-white/5" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-white/80 block mb-1">Ruolo</label>
            <div className="p-2 rounded bg-white/5">{user.role}</div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="px-4 py-2 bg-teal-500 rounded text-gray-900 font-semibold">Salva</button>
            <button onClick={() => { localStorage.removeItem('user'); window.location.reload() }} className="px-3 py-2 bg-white/6 rounded">Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
