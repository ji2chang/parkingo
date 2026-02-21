import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { addHours, differenceInHours } from 'date-fns'
import { MapPin, Star, Car, Calendar, User } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { HeatmapCalendar } from '../components/HeatmapCalendar'
import { getParkingById } from '../utils/parkings'
import { formatCurrency, formatDateRange, generateCode } from '../utils/format'
import { useBooking } from '../hooks/useBooking'
import { useToast } from '../hooks/useToast'

function buildMockAvailability(parking) {
  const avail = {}
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const d = addHours(today, i * 24)
    const key = d.toISOString().slice(0, 10)
    const random = Math.random()
    avail[key] = {
      available: Math.floor(random * parking.totalSpots),
      total: parking.totalSpots,
    }
  }
  return avail
}

export function BookingPage() {
  const { parkingId } = useParams()
  const navigate = useNavigate()
  const { saveBooking } = useBooking()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const parking = getParkingById(parkingId)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      plate: '',
      start: new Date(Date.now() + 3600_000).toISOString().slice(0, 16),
      end: new Date(Date.now() + 7200_000).toISOString().slice(0, 16),
    },
  })

  const [start, end] = watch(['start', 'end'])

  const hours = useMemo(() => {
    if (!start || !end) return 0
    return Math.max(0, differenceInHours(new Date(end), new Date(start)))
  }, [start, end])

  const total = useMemo(() => {
    if (!parking) return 0
    return hours >= 24
      ? Math.ceil(hours / 24) * parking.pricePerDay
      : hours * parking.pricePerHour
  }, [hours, parking])

  const availability = useMemo(() => (parking ? buildMockAvailability(parking) : {}), [parking])

  if (!parking) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-xl font-semibold">Parcheggio non trovato</p>
        <Button className="mt-6" onClick={() => navigate('/search')}>
          Torna alla ricerca
        </Button>
      </div>
    )
  }

  async function onSubmit(data) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const code = generateCode()
    const booking = {
      code,
      parking,
      customer: data,
      period: { start: data.start, end: data.end },
      total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    saveBooking(booking)
    showToast({ type: 'success', title: 'Prenotazione confermata!', description: `Codice: ${code}` })
    navigate(`/confirmation/${code}`, { state: { booking } })
  }

  const ratio = parking.availableSpots / parking.totalSpots
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
              <Input
                label="Inizio"
                type="datetime-local"
                required
                {...register('start', { required: 'Campo obbligatorio' })}
                error={errors.start?.message}
                leftIcon={<Calendar className="h-4 w-4" />}
              />
              <Input
                label="Fine"
                type="datetime-local"
                required
                {...register('end', {
                  required: 'Campo obbligatorio',
                  validate: (v) =>
                    new Date(v) > new Date(start) || 'La fine deve essere dopo l\'inizio',
                })}
                error={errors.end?.message}
                leftIcon={<Calendar className="h-4 w-4" />}
              />
            </div>
            {hours > 0 && (
              <p className="mt-3 text-sm text-white/60">
                Durata: <strong className="text-white">{hours} ore</strong> — Totale stimato:{' '}
                <strong className="text-primary-light">{formatCurrency(total)}</strong>
              </p>
            )}
          </Card>

          <HeatmapCalendar month={new Date()} availability={availability} />

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Conferma prenotazione
          </Button>
        </form>

        {/* Parking info sidebar */}
        <div className="space-y-6">
          <Card title={parking.name}>
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-sm text-white/60">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {parking.address}, {parking.city}
              </p>
              <div className="flex items-center gap-1.5 text-warning text-sm font-semibold">
                <Star className="h-4 w-4 fill-warning" />
                {parking.rating.toFixed(1)} / 5.0
              </div>
              <Badge variant={availVariant}>
                <Car className="h-3 w-3 mr-1 inline" />
                {parking.availableSpots} posti liberi
              </Badge>
              <div className="flex flex-wrap gap-2 pt-1">
                {parking.amenities.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Riepilogo costi">
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Tariffa oraria</span>
                <span className="text-white">{formatCurrency(parking.pricePerHour)}/h</span>
              </div>
              <div className="flex justify-between">
                <span>Tariffa giornaliera</span>
                <span className="text-white">{formatCurrency(parking.pricePerDay)}/g</span>
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
