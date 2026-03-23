import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { differenceInHours, parseISO } from 'date-fns'
import { MapPin, Star, Car, Calendar, User } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { getParkingById, getParkingAvailability } from '../services/api'
import { formatCurrency, formatDateRange } from '../utils/format'
import { useBooking } from '../hooks/useBooking'
import { useToast } from '../hooks/useToast'
import { emitBookingEvent, BOOKING_EVENTS } from '../hooks/useBookingRefresh'

export function BookingPage() {
  const { parkingId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { book } = useBooking()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [parking, setParking] = useState(null)
  const [parkingError, setParkingError] = useState(false)
  const [availability, setAvailability] = useState({})
  
  // Time states
  const [startDate, setStartDate] = useState('')
  const [startHour, setStartHour] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endHour, setEndHour] = useState('')
  
  const HOURS = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  )

  // Carica dati parcheggio dall'API
  useEffect(() => {
    getParkingById(parkingId)
      .then((data) => setParking(data))
      .catch(() => setParkingError(true))
  }, [parkingId])

  // Initialize time from SearchPage or set defaults
  useEffect(() => {
    const now = new Date()
    
    // Try to get time from SearchPage state
    const searchState = location.state?.searchFilters
    
    if (searchState?.startDate && searchState?.startHour) {
      setStartDate(searchState.startDate)
      setStartHour(searchState.startHour)
      setEndDate(searchState.endDate)
      setEndHour(searchState.endHour)
    } else {
      // Set defaults: start in 1 hour, end in 2 hours
      const start = new Date(now)
      const end = new Date(now.getTime() + 60 * 60 * 1000)
      
      setStartDate(start.toISOString().slice(0, 10))
      setStartHour(start.toISOString().slice(11, 13) + ':00')
      
      setEndDate(end.toISOString().slice(0, 10))
      setEndHour(end.toISOString().slice(11, 13) + ':00')
    }
  }, [location])

  // Validazione date
  const isDateValid = () => {
    if (!startDate || !startHour || !endDate || !endHour) return false
    const start = new Date(`${startDate}T${startHour}`)
    const end = new Date(`${endDate}T${endHour}`)
    return start < end
  }

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    if (newStartDate && endDate && newStartDate > endDate) {
      setEndDate(newStartDate)
    }
  }

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value
    if (newEndDate && startDate && newEndDate < startDate) {
      showToast({
        type: 'warning',
        title: 'Errore',
        description: 'La data di fine non può essere prima della data di inizio'
      })
      return
    }
    setEndDate(newEndDate)
  }

  // Carica disponibilità
  useEffect(() => {
    if (!parkingId || !startDate || !startHour || !endDate || !endHour) return
    
    getParkingAvailability(parkingId, {
      data_inizio: startDate,
      orario_inizio: startHour,
      data_fine: endDate,
      orario_fine: endHour,
    })
      .then((data) => setAvailability(data ?? {}))
      .catch(() => setAvailability({}))
  }, [parkingId, startDate, startHour, endDate, endHour])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      plate: '',
    },
  })

  const hours = useMemo(() => {
    if (!startDate || !startHour || !endDate || !endHour) return 0
    const start = parseISO(`${startDate}T${startHour}`)
    const end = parseISO(`${endDate}T${endHour}`)
    return Math.max(0, differenceInHours(end, start))
  }, [startDate, startHour, endDate, endHour])

  const pricePerHour = parking?.tariffa_oraria ?? parking?.prezzo_orario ?? parking?.pricePerHour ?? 0
  const pricePerDay = pricePerHour * 24

  const total = useMemo(() => {
    if (!parking) return 0
    return hours >= 24
      ? Math.ceil(hours / 24) * pricePerDay
      : hours * pricePerHour
  }, [hours, parking, pricePerHour, pricePerDay])

  // availability è già caricata via API sopra

  if (parkingError) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-xl font-semibold">Parcheggio non trovato</p>
        <Button className="mt-6" onClick={() => navigate('/search')}>
          Torna alla ricerca
        </Button>
      </div>
    )
  }

  if (!parking) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-white/40 text-lg">Caricamento…</p>
      </div>
    )
  }

  async function onSubmit(data) {
    if (!isDateValid()) {
      showToast({
        type: 'warning',
        title: 'Errore',
        description: 'La data e l\'ora di fine devono essere dopo quelle di inizio'
      })
      return
    }
    
    setLoading(true)
    const body = {
      parcheggio_id: parkingId,
      data_inizio: startDate,
      orario_inizio: startHour,
      data_fine: endDate,
      orario_fine: endHour,
      targa: data.plate,
      nome: data.firstName,
      cognome: data.lastName,
      email: data.email,
      telefono: data.phone ?? '',
      note: data.note ?? '',
    }
    
    try {
      const result = await book(body)
      setLoading(false)
      
      if (result && (result.codice_prenotazione || result.codice)) {
        showToast({ 
          type: 'success', 
          title: 'Prenotazione confermata!', 
          description: `Codice: ${result.codice_prenotazione || result.codice}` 
        })
        // Emit event to trigger refresh on other pages
        emitBookingEvent(BOOKING_EVENTS.CREATED, { 
          parkingId, 
          booking: result,
          startDate,
          startHour,
          endDate,
          endHour,
        })
        navigate(`/confirmation/${result.codice_prenotazione || result.codice}`, { state: { booking: result } })
      } else {
        showToast({ 
          type: 'danger', 
          title: 'Errore', 
          description: 'Impossibile completare la prenotazione. Riprova.' 
        })
      }
    } catch (err) {
      setLoading(false)
      showToast({ 
        type: 'danger', 
        title: 'Errore', 
        description: err.message || 'Errore durante la prenotazione' 
      })
    }
  }

  const availableSpots =
    (parking?.posti_disponibili !== null && parking?.posti_disponibili !== undefined)
      ? parking.posti_disponibili
      : (parking?.availableSpots ?? parking?.posti_totali ?? parking?.totalSpots ?? 0)
  const totalSpots = parking.posti_totali ?? parking.totalSpots ?? 1
  const ratio = totalSpots > 0 ? availableSpots / totalSpots : 0
  const availVariant = ratio > 0.5 ? 'success' : ratio > 0.2 ? 'warning' : 'danger'

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Prenota parcheggio</h1>
        <p className="mt-1 text-white/50">Compila il modulo per completare la prenotazione.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          <Card title="Dati personali">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nome"
                required
                {...register('firstName', { required: 'Campo obbligatorio' })}
                error={errors.firstName?.message}
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Cognome"
                required
                {...register('lastName', { required: 'Campo obbligatorio' })}
                error={errors.lastName?.message}
              />
              <Input
                label="Email"
                type="email"
                required
                className="sm:col-span-2"
                {...register('email', {
                  required: 'Campo obbligatorio',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email non valida' },
                })}
                error={errors.email?.message}
              />
              <Input
                label="Targa"
                placeholder="XX 000 XX"
                required
                {...register('plate', { required: 'Campo obbligatorio' })}
                error={errors.plate?.message}
                leftIcon={<Car className="h-4 w-4" />}
              />
            </div>
          </Card>

          <Card title="Periodo di sosta">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* INIZIO */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Inizio</p>
                <Input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  style={{ colorScheme: 'dark' }}
                  required
                >
                  <option value="" style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>Ora</option>
                  {HOURS.map((h) => (
                    <option key={h} value={h} style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* FINE */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Fine</p>
                <Input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  required
                />
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  style={{ colorScheme: 'dark' }}
                  required
                >
                  <option value="" style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>Ora</option>
                  {HOURS.map((h) => (
                    <option key={h} value={h} style={{ color: '#fff', backgroundColor: '#1a1a1a' }}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {hours > 0 && (
              <p className="mt-3 text-sm text-white/60">
                Durata: <strong className="text-white">{hours} ore</strong> — Totale stimato:{' '}
                <strong className="text-primary-light">{formatCurrency(total)}</strong>
              </p>
            )}
          </Card>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Conferma prenotazione
          </Button>
        </form>

        {/* Parking info sidebar */}
        <div className="space-y-6">
          <Card title={parking.nome ?? parking.name}>
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-sm text-white/60">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {parking.indirizzo ?? parking.address}, {parking.citta ?? parking.city}
              </p>
              {parking.valutazione != null && (
                <div className="flex items-center gap-1.5 text-warning text-sm font-semibold">
                  <Star className="h-4 w-4 fill-warning" />
                  {Number(parking.valutazione ?? parking.rating).toFixed(1)} / 5.0
                </div>
              )}
              <Badge variant={availVariant}>
                <Car className="h-3 w-3 mr-1 inline" />
                {availableSpots} posti liberi
              </Badge>
              <div className="flex flex-wrap gap-2 pt-1">
                {(parking.servizi ?? parking.amenities ?? []).map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Riepilogo costi">
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Tariffa oraria</span>
                <span className="text-white">{formatCurrency(pricePerHour)}/h</span>
              </div>
              <div className="flex justify-between">
                <span>Tariffa giornaliera</span>
                <span className="text-white">{formatCurrency(pricePerDay)}/g</span>
              </div>
              <div className="flex justify-between">
                <span>Periodo</span>
                <span className="text-white">{hours}h</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-base font-semibold">
                <span className="text-white">Totale stimato</span>
                <span className="text-primary-light">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
