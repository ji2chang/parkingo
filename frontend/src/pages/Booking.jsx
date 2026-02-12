import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  CreditCard,
  MapPin,
  CheckCircle2,
  X,
  Zap,
  Star,
} from 'lucide-react'

/* ── Success Modal ── */
const SuccessModal = ({ booking, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-[slideUp_0.35s_ease-out]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Prenotazione confermata!</h2>
      <p className="text-gray-500 text-sm mb-6">
        Il tuo posto è riservato. Riceverai una conferma via email.
      </p>

      <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Parcheggio</span>
          <span className="font-semibold text-gray-900">{booking.parkingName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Zona</span>
          <span className="font-semibold text-gray-900">{booking.zoneName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Data</span>
          <span className="font-semibold text-gray-900">{booking.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Orario</span>
          <span className="font-semibold text-gray-900">
            {booking.entryTime} — {booking.exitTime}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
          <span className="font-bold text-gray-900">Totale</span>
          <span className="font-bold text-teal-600 text-lg">{booking.total}</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-[#0f1b3d] text-white font-bold rounded-xl hover:bg-[#162550] transition"
      >
        Torna alla mappa
      </button>
    </div>
  </div>
)

/* ── Booking Page ── */
const Booking = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { parking, zone } = location.state || {}

  const [formData, setFormData] = useState({
    date: '',
    entryTime: '',
    exitTime: '',
    vehicleType: 'Auto',
    licensePlate: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  /* validation */
  const validate = () => {
    const errs = {}
    if (!formData.date) errs.date = 'Seleziona una data'
    else if (new Date(formData.date) < new Date(new Date().toDateString()))
      errs.date = 'Data non valida'
    if (!formData.entryTime) errs.entryTime = 'Seleziona orario'
    if (!formData.exitTime) errs.exitTime = 'Seleziona orario'
    if (formData.entryTime && formData.exitTime && formData.entryTime >= formData.exitTime)
      errs.exitTime = "Deve essere dopo l'orario di entrata"
    if (!formData.licensePlate.trim()) errs.licensePlate = 'Inserisci la targa'
    else if (!/^[A-Z]{2}\d{3}[A-Z]{2}$/i.test(formData.licensePlate.trim()))
      errs.licensePlate = 'Formato: AA123BB'
    return errs
  }

  const calculateDuration = () => {
    if (!formData.entryTime || !formData.exitTime) return 0
    const entry = new Date(`2000-01-01T${formData.entryTime}`)
    const exit = new Date(`2000-01-01T${formData.exitTime}`)
    const diff = (exit - entry) / (1000 * 60 * 60)
    return diff > 0 ? diff : 0
  }

  const duration = calculateDuration()
  const totalCost = duration * (zone?.pricePerHour || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setShowSuccess(true)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    navigate('/city-map')
  }

  if (!parking || !zone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <MapPin className="w-12 h-12 opacity-30" />
        <p className="font-semibold">Dati mancanti. Seleziona una zona dalla mappa.</p>
        <button
          onClick={() => navigate('/city-map')}
          className="px-6 py-2 bg-[#0f1b3d] text-white rounded-lg font-semibold hover:bg-[#162550] transition"
        >
          Vai alla mappa
        </button>
      </div>
    )
  }

  const inputBase =
    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition text-sm'
  const inputOk = 'border-gray-200 focus:ring-teal-500/40 focus:border-teal-500'
  const inputErr = 'border-red-300 focus:ring-red-400/40 focus:border-red-400'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b-2 border-slate-200/80 sticky top-[72px] z-20 shadow-lg shadow-slate-200/50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
            aria-label="Torna indietro"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Prenota la tua zona</h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">Completa i dettagli per confermare</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── FORM ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Dettagli prenotazione</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Date */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      if (errors.date) setErrors((p) => ({ ...p, date: undefined }))
                    }}
                    className={`${inputBase} ${errors.date ? inputErr : inputOk}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                {/* Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" /> Orario entrata
                    </label>
                    <input
                      type="time"
                      value={formData.entryTime}
                      onChange={(e) => {
                        setFormData({ ...formData, entryTime: e.target.value })
                        if (errors.entryTime) setErrors((p) => ({ ...p, entryTime: undefined }))
                      }}
                      className={`${inputBase} ${errors.entryTime ? inputErr : inputOk}`}
                    />
                    {errors.entryTime && (
                      <p className="text-red-500 text-xs mt-1">{errors.entryTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" /> Orario uscita
                    </label>
                    <input
                      type="time"
                      value={formData.exitTime}
                      onChange={(e) => {
                        setFormData({ ...formData, exitTime: e.target.value })
                        if (errors.exitTime) setErrors((p) => ({ ...p, exitTime: undefined }))
                      }}
                      className={`${inputBase} ${errors.exitTime ? inputErr : inputOk}`}
                    />
                    {errors.exitTime && (
                      <p className="text-red-500 text-xs mt-1">{errors.exitTime}</p>
                    )}
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <Car className="w-4 h-4 text-gray-400" /> Tipo veicolo
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className={`${inputBase} ${inputOk}`}
                  >
                    <option>Auto</option>
                    <option>SUV</option>
                    <option>Moto</option>
                    <option>Furgone</option>
                  </select>
                </div>

                {/* License plate */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-400" /> Targa
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => {
                      setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
                      if (errors.licensePlate) setErrors((p) => ({ ...p, licensePlate: undefined }))
                    }}
                    placeholder="AA123BB"
                    className={`${inputBase} uppercase ${errors.licensePlate ? inputErr : inputOk}`}
                  />
                  {errors.licensePlate && (
                    <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-teal-500/50 disabled:to-teal-600/50 text-white font-black text-base rounded-xl
                    transition-all duration-200 shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-teal-500/40"
                  aria-label="Conferma prenotazione"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Conferma Prenotazione'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── SUMMARY ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-[140px]">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Riepilogo</h3>

              <div className="space-y-4 mb-6">
                {/* Parking */}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Parcheggio</p>
                    <p className="font-semibold text-gray-900 text-sm truncate">{parking.name}</p>
                  </div>
                </div>

                {/* Zone */}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {zone.specialType === 'Elettrica' ? (
                      <Zap className="w-4 h-4 text-blue-600" />
                    ) : zone.specialType === 'Premium' ? (
                      <Star className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Car className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Zona selezionata</p>
                    <p className="font-semibold text-gray-900 text-sm">{zone.name}</p>
                    {zone.isSpecial && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                        {zone.specialType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Durata stimata</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {duration > 0 ? `${duration.toFixed(1)} ore` : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">Tariffa oraria</span>
                  <span className="font-semibold text-gray-800">€{zone.pricePerHour}/h</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Totale</span>
                  <span className="text-2xl font-extrabold text-teal-600">
                    €{totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Il prezzo finale potrebbe variare in base all'orario effettivo di uscita.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          booking={{
            parkingName: parking.name,
            zoneName: zone.name,
            date: formData.date,
            entryTime: formData.entryTime,
            exitTime: formData.exitTime,
            total: `€${totalCost.toFixed(2)}`,
          }}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  )
}

export default Booking
