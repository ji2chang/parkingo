import { useEffect, useState, useCallback } from 'react'
import {
    getParkings, createParking, updateParking, deleteParking,
    listBookings, cancelBooking, getAnalytics,
} from '../services/api'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(amount) {
    return `€ ${Number(amount ?? 0).toFixed(2)}`
}

function fmtDate(str) {
    if (!str) return '—'
    return new Date(str).toLocaleString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
    return (
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
            <span className="text-2xl font-semibold text-white">{value}</span>
            {sub && <span className="text-xs text-white/40">{sub}</span>}
        </div>
    )
}

function Badge({ stato }) {
    const map = {
        attiva:     'bg-teal-500/20 text-teal-300',
        completata: 'bg-blue-500/20 text-blue-300',
        annullata:  'bg-red-500/20  text-red-300',
        scaduta:    'bg-yellow-500/20 text-yellow-300',
    }
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${map[stato] ?? 'bg-white/10 text-white/60'}`}>
      {stato}
    </span>
    )
}

// ─── TABS ───────────────────────────────────────────────────────────────────

const TABS = ['Analytics', 'Prenotazioni', 'Parcheggi']

// ─── Analytics Tab ───────────────────────────────────────────────────────────

function AnalyticsTab() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAnalytics()
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-white/40 text-sm py-8 text-center">Caricamento…</p>
    if (!data) return <p className="text-white/40 text-sm py-8 text-center">Dati non disponibili</p>

    const stats = data.stats ?? {}
    const top = data.parcheggi_top ?? []
    const recent = data.prenotazioni ?? []

    return (
        <div className="space-y-6">
            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Totale prenotazioni" value={stats.totale ?? 0} />
                <StatCard label="Attive" value={stats.attive ?? 0} />
                <StatCard label="Cancellate" value={stats.cancellate ?? 0} />
                <StatCard label="Incasso totale" value={fmt(stats.spesa_totale)} sub={`media ${fmt(stats.costo_medio)}`} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Top parcheggi */}
                <div className="glass-panel rounded-2xl p-5">
                    <h3 className="font-semibold mb-4 text-sm text-white/70 uppercase tracking-wider">Top parcheggi</h3>
                    <div className="space-y-3">
                        {top.length === 0 && <p className="text-white/30 text-sm">Nessun dato</p>}
                        {top.map((p, i) => {
                            const max = top[0]?.prenotazioni || 1
                            const pct = Math.round((p.prenotazioni / max) * 100)
                            return (
                                <div key={p.id} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/80">{i + 1}. {p.nome}</span>
                                        <span className="text-white/40">{p.prenotazioni} prenotazioni</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Prenotazioni recenti */}
                <div className="glass-panel rounded-2xl p-5">
                    <h3 className="font-semibold mb-4 text-sm text-white/70 uppercase tracking-wider">Prenotazioni recenti</h3>
                    <div className="space-y-2">
                        {recent.length === 0 && <p className="text-white/30 text-sm">Nessun dato</p>}
                        {recent.map((b) => (
                            <div key={b.codice} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <div>
                                    <p className="text-sm font-mono text-white/80">{b.codice}</p>
                                    <p className="text-xs text-white/40">{b.parcheggio?.nome ?? '—'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-teal-300">{fmt(b.importo)}</p>
                                    <Badge stato={b.stato} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Prenotazioni Tab ────────────────────────────────────────────────────────

function PrenotazioniTab() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [statoFilter, setStatoFilter] = useState('tutti')

    const load = useCallback(() => {
        setLoading(true)
        listBookings()
            .then((res) => setBookings(Array.isArray(res) ? res : []))
            .catch(() => setBookings([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    async function handleCancel(code) {
        if (!confirm(`Cancellare la prenotazione ${code}?`)) return
        try {
            await cancelBooking(code)
            setBookings((prev) =>
                prev.map((b) => b.codice === code ? { ...b, stato: 'annullata' } : b)
            )
        } catch (e) {
            alert('Errore: ' + e.message)
        }
    }

    const filtered = bookings.filter((b) => {
        const q = filter.toLowerCase()
        const matchQ = !q || b.codice?.toLowerCase().includes(q)
            || b.nome?.toLowerCase().includes(q)
            || b.cognome?.toLowerCase().includes(q)
            || b.targa?.toLowerCase().includes(q)
        const matchS = statoFilter === 'tutti' || b.stato === statoFilter
        return matchQ && matchS
    })

    return (
        <div className="space-y-4">
            {/* Filtri */}
            <div className="flex gap-3 flex-wrap">
                <input
                    placeholder="Cerca codice, nome, targa…"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="flex-1 min-w-48 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50"
                />
                <select
                    value={statoFilter}
                    onChange={(e) => setStatoFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-500/50"
                >
                    <option value="tutti">Tutti gli stati</option>
                    <option value="attiva">Attiva</option>
                    <option value="completata">Completata</option>
                    <option value="annullata">Annullata</option>
                    <option value="scaduta">Scaduta</option>
                </select>
                <button
                    onClick={load}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white transition-colors"
                >
                    ↻ Aggiorna
                </button>
            </div>

            {/* Tabella */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                {loading ? (
                    <p className="text-white/40 text-sm py-10 text-center">Caricamento…</p>
                ) : filtered.length === 0 ? (
                    <p className="text-white/40 text-sm py-10 text-center">Nessuna prenotazione trovata</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                                <th className="px-4 py-3 text-left">Codice</th>
                                <th className="px-4 py-3 text-left">Cliente</th>
                                <th className="px-4 py-3 text-left">Targa</th>
                                <th className="px-4 py-3 text-left">Parcheggio</th>
                                <th className="px-4 py-3 text-left">Dal</th>
                                <th className="px-4 py-3 text-left">Al</th>
                                <th className="px-4 py-3 text-right">Importo</th>
                                <th className="px-4 py-3 text-left">Stato</th>
                                <th className="px-4 py-3 text-left">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((b) => (
                                <tr key={b.codice} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 font-mono text-white/70 text-xs">{b.codice}</td>
                                    <td className="px-4 py-3 text-white">{b.nome} {b.cognome}</td>
                                    <td className="px-4 py-3 text-white/60 font-mono">{b.targa ?? '—'}</td>
                                    <td className="px-4 py-3 text-white/60">{b.parcheggio?.nome ?? '—'}</td>
                                    <td className="px-4 py-3 text-white/60 text-xs">{fmtDate(b.data_inizio)}</td>
                                    <td className="px-4 py-3 text-white/60 text-xs">{fmtDate(b.data_fine)}</td>
                                    <td className="px-4 py-3 text-right text-teal-300">{fmt(b.importo_totale)}</td>
                                    <td className="px-4 py-3"><Badge stato={b.stato} /></td>
                                    <td className="px-4 py-3">
                                        {b.stato === 'attiva' && (
                                            <button
                                                onClick={() => handleCancel(b.codice)}
                                                className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors"
                                            >
                                                Cancella
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-white/30 text-right">{filtered.length} risultati</p>
        </div>
    )
}

// ─── Parcheggi Tab ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
    nome: '', indirizzo: '', citta: '', cap: '',
    lat: '', lng: '', raggio: 500,
    posti_totali: 10, tariffa_oraria: '',
    orario_apertura: '08:00', orario_chiusura: '20:00',
    aperto_24h: false, descrizione: '',
}

function ParcheggioForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState(initial ?? EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    function set(field, value) {
        setForm((f) => ({ ...f, [field]: value }))
    }

    async function handleSubmit() {
        if (!form.nome || !form.citta || !form.lat || !form.lng) {
            alert('Nome, città, lat e lng sono obbligatori')
            return
        }
        setSaving(true)
        try {
            await onSave(form)
        } finally {
            setSaving(false)
        }
    }

    const inp = 'w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50'

    return (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">{initial ? 'Modifica parcheggio' : 'Nuovo parcheggio'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Nome *</label>
                    <input className={inp} placeholder="es. Parcheggio Centrale" value={form.nome} onChange={(e) => set('nome', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Città *</label>
                    <input className={inp} placeholder="es. Milano" value={form.citta} onChange={(e) => set('citta', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Indirizzo</label>
                    <input className={inp} placeholder="Via Roma 1" value={form.indirizzo} onChange={(e) => set('indirizzo', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">CAP</label>
                    <input className={inp} placeholder="20100" value={form.cap} onChange={(e) => set('cap', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Latitudine *</label>
                    <input className={inp} type="number" step="any" placeholder="45.4654" value={form.lat} onChange={(e) => set('lat', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Longitudine *</label>
                    <input className={inp} type="number" step="any" placeholder="9.1859" value={form.lng} onChange={(e) => set('lng', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Posti totali</label>
                    <input className={inp} type="number" min="1" value={form.posti_totali} onChange={(e) => set('posti_totali', Number(e.target.value))} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Tariffa oraria (€)</label>
                    <input className={inp} type="number" step="0.5" min="0" placeholder="2.50" value={form.tariffa_oraria} onChange={(e) => set('tariffa_oraria', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Apertura</label>
                    <input className={inp} type="time" value={form.orario_apertura} onChange={(e) => set('orario_apertura', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-white/40 mb-1 block">Chiusura</label>
                    <input className={inp} type="time" value={form.orario_chiusura} onChange={(e) => set('orario_chiusura', e.target.value)} />
                </div>
            </div>

            <div>
                <label className="text-xs text-white/40 mb-1 block">Descrizione</label>
                <textarea
                    className={`${inp} resize-none h-20`}
                    placeholder="Descrizione opzionale…"
                    value={form.descrizione}
                    onChange={(e) => set('descrizione', e.target.value)}
                />
            </div>

            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <input
                    type="checkbox"
                    checked={form.aperto_24h}
                    onChange={(e) => set('aperto_24h', e.target.checked)}
                    className="accent-teal-500"
                />
                Aperto 24h
            </label>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-teal-500 text-gray-900 font-semibold text-sm hover:bg-teal-400 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Salvataggio…' : 'Salva'}
                </button>
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:text-white hover:bg-white/10 transition-colors"
                >
                    Annulla
                </button>
            </div>
        </div>
    )
}

function ParcheggioTab() {
    const [parkings, setParkings] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null) // { idx, parking }
    const [filter, setFilter] = useState('')

    const load = useCallback(() => {
        setLoading(true)
        getParkings()
            .then((res) => setParkings(Array.isArray(res) ? res : []))
            .catch(() => setParkings([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    async function handleCreate(form) {
        try {
            const created = await createParking(form)
            setParkings((p) => [created, ...p])
            setShowForm(false)
        } catch (e) {
            alert('Errore creazione: ' + e.message)
        }
    }

    async function handleUpdate(form) {
        try {
            const updated = await updateParking(editing.parking.id, form)
            setParkings((p) => p.map((x) => x.id === editing.parking.id ? (updated ?? { ...x, ...form }) : x))
            setEditing(null)
        } catch (e) {
            alert('Errore aggiornamento: ' + e.message)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Eliminare questo parcheggio?')) return
        try {
            await deleteParking(id)
            setParkings((p) => p.filter((x) => x.id !== id))
        } catch (e) {
            alert('Errore eliminazione: ' + e.message)
        }
    }

    const filtered = parkings.filter((p) => {
        const q = filter.toLowerCase()
        return !q || p.nome?.toLowerCase().includes(q) || p.citta?.toLowerCase().includes(q)
    })

    return (
        <div className="space-y-4">
            {/* Form nuovo / modifica */}
            {showForm && !editing && (
                <ParcheggioForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
            )}
            {editing && (
                <ParcheggioForm
                    initial={editing.parking}
                    onSave={handleUpdate}
                    onCancel={() => setEditing(null)}
                />
            )}

            {/* Toolbar */}
            {!showForm && !editing && (
                <div className="flex gap-3 flex-wrap">
                    <input
                        placeholder="Cerca nome o città…"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="flex-1 min-w-48 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50"
                    />
                    <button
                        onClick={load}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        ↻ Aggiorna
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 rounded-xl bg-teal-500 text-gray-900 font-semibold text-sm hover:bg-teal-400 transition-colors"
                    >
                        + Nuovo parcheggio
                    </button>
                </div>
            )}

            {/* Tabella */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                {loading ? (
                    <p className="text-white/40 text-sm py-10 text-center">Caricamento…</p>
                ) : filtered.length === 0 ? (
                    <p className="text-white/40 text-sm py-10 text-center">Nessun parcheggio trovato</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Nome</th>
                                <th className="px-4 py-3 text-left">Città</th>
                                <th className="px-4 py-3 text-left">Indirizzo</th>
                                <th className="px-4 py-3 text-right">Posti</th>
                                <th className="px-4 py-3 text-right">Tariffa/h</th>
                                <th className="px-4 py-3 text-left">Orari</th>
                                <th className="px-4 py-3 text-left">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-white/40 text-xs">{p.id}</td>
                                    <td className="px-4 py-3 text-white font-medium">{p.nome}</td>
                                    <td className="px-4 py-3 text-white/60">{p.citta}</td>
                                    <td className="px-4 py-3 text-white/50 text-xs">{p.indirizzo ?? '—'}</td>
                                    <td className="px-4 py-3 text-right text-white/70">{p.posti_totali ?? '—'}</td>
                                    <td className="px-4 py-3 text-right text-teal-300">{p.tariffa_oraria != null ? `€ ${Number(p.tariffa_oraria).toFixed(2)}` : '—'}</td>
                                    <td className="px-4 py-3 text-white/50 text-xs">
                                        {p.aperto_24h ? '24h' : `${p.orario_apertura ?? ''}–${p.orario_chiusura ?? ''}`}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setShowForm(false); setEditing({ parking: p }) }}
                                                className="px-3 py-1 rounded-lg bg-white/8 text-white/60 text-xs hover:text-white hover:bg-white/15 transition-colors"
                                            >
                                                Modifica
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors"
                                            >
                                                Elimina
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-white/30 text-right">{filtered.length} parcheggi</p>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Analytics')

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user || user.ruolo !== 'Admin') {
            window.location.href = '/login'
        }
    }, [])

    return (
        <div className="py-10">
            <div className="max-w-7xl mx-auto space-y-6 px-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
                        <p className="text-sm text-white/40 mt-0.5">Gestione prenotazioni e parcheggi</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/8">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? 'bg-teal-500 text-gray-900'
                                    : 'text-white/50 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'Analytics'    && <AnalyticsTab />}
                {activeTab === 'Prenotazioni' && <PrenotazioniTab />}
                {activeTab === 'Parcheggi'    && <ParcheggioTab />}
            </div>
        </div>
    )
}

export default AdminDashboard