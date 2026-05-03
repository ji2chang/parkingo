import { useEffect, useState } from 'react'
import * as api from '../services/api'

export function AdminDashboard() {
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', citta: '', indirizzo: '', posti_totali: '', lat: '', lng: '' })

  useEffect(() => {
    const roleValidate = async () => {
      const res = await api.getUserProfile();

      const ruolo = res.ruolo;
      
      
      if (ruolo !== "Admin") {
        window.location.href = '/login'
      }
     load();

    };
    roleValidate();
  }, []);
  
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
