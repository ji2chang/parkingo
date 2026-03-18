import { useEffect, useState } from 'react'
import * as api from '../services/api'

export function AdminDashboard() {
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', citta: '', indirizzo: '', posti_totali: 10, lat: '', lng: '' })

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null')
    if (!u || u.role !== 'admin') {
      window.location.href = '/login'
      return
    }
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const list = await api.getParkings()
      setParkings(Array.isArray(list) ? list : [])
    } catch (err) {
      // fallback to localStorage-managed parkings
      const stored = JSON.parse(localStorage.getItem('parkingo_admin_parkings') || '[]')
      setParkings(stored)
    } finally {
      setLoading(false)
    }
  }

  async function create() {
    const payload = { ...form }
    try {
      const created = await api.createParking(payload)
      setParkings((p) => [created, ...p])
      setForm({ nome: '', citta: '', indirizzo: '', posti_totali: 10, lat: '', lng: '' })
    } catch (err) {
      // fallback: store locally
      const stored = JSON.parse(localStorage.getItem('parkingo_admin_parkings') || '[]')
      const id = Date.now()
      const created = { id, ...payload }
      stored.unshift(created)
      localStorage.setItem('parkingo_admin_parkings', JSON.stringify(stored))
      setParkings(stored)
    }
  }

  async function remove(id) {
    if (!confirm('Eliminare questo parcheggio?')) return
    try {
      await api.deleteParking(id)
      setParkings((p) => p.filter((x) => x.id !== id && x.parcheggio_id !== id))
    } catch (err) {
      // fallback local
      const stored = JSON.parse(localStorage.getItem('parkingo_admin_parkings') || '[]')
      const updated = stored.filter((x) => x.id !== id)
      localStorage.setItem('parkingo_admin_parkings', JSON.stringify(updated))
      setParkings(updated)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="text-sm text-white/60">Gestione parcheggi</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="font-semibold mb-3">Crea nuovo parcheggio</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="p-2 rounded bg-white/5" />
            <input placeholder="Città" value={form.citta} onChange={(e) => setForm({ ...form, citta: e.target.value })} className="p-2 rounded bg-white/5" />
            <input placeholder="Indirizzo" value={form.indirizzo} onChange={(e) => setForm({ ...form, indirizzo: e.target.value })} className="p-2 rounded bg-white/5" />
            <input placeholder="Posti totali" type="number" value={form.posti_totali} onChange={(e) => setForm({ ...form, posti_totali: Number(e.target.value || 0) })} className="p-2 rounded bg-white/5" />
          </div>
          <div className="mt-3 flex gap-3">
            <input placeholder="Lat" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="p-2 rounded bg-white/5" />
            <input placeholder="Lng" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="p-2 rounded bg-white/5" />
            <button onClick={create} className="px-4 py-2 bg-teal-500 rounded text-gray-900 font-semibold">Crea</button>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="font-semibold mb-3">Elenco parcheggi</h2>
          {loading ? (
            <div>Caricamento...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-white/60">
                    <th className="p-2">ID</th>
                    <th className="p-2">Nome</th>
                    <th className="p-2">Città</th>
                    <th className="p-2">Posti</th>
                    <th className="p-2">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {parkings.map((p) => (
                    <tr key={p.id || p.parcheggio_id} className="border-t border-white/6">
                      <td className="p-2">{p.id ?? p.parcheggio_id}</td>
                      <td className="p-2">{p.nome || p.name || p.titolo || '-'}</td>
                      <td className="p-2">{p.citta || '-'}</td>
                      <td className="p-2">{p.posti_totali ?? p.posti_disponibili ?? '-'}</td>
                      <td className="p-2">
                        <button onClick={() => remove(p.id ?? p.parcheggio_id)} className="px-3 py-1 bg-red-600 rounded text-sm">Elimina</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
