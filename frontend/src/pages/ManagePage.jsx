import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Calendar, Car, MapPin, AlertTriangle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { formatCurrency, formatDateRange } from '../utils/format'
import { useBooking } from '../hooks/useBooking'
import { useToast } from '../hooks/useToast'

export function ManagePage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { bookings, cancelBooking } = useBooking()
  const { showToast } = useToast()
  const [cancelOpen, setCancelOpen] = useState(false)

  const booking = bookings.find((b) => b.code === code)

  if (!booking) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-xl font-semibold">Prenotazione non trovata</p>
        <p className="mt-2 text-white/50">Il codice {code} non corrisponde a nessuna prenotazione.</p>
        <Button className="mt-6" onClick={() => navigate('/search')}>
          Nuova prenotazione
        </Button>
      </div>
    )
  }

  const isCancelled = booking.status === 'cancelled'

  function handleCancel() {
    cancelBooking(code)
    setCancelOpen(false)
    showToast({ type: 'danger', title: 'Prenotazione cancellata', description: `Codice: ${code}` })
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">Gestisci prenotazione</h1>
          <Badge variant={isCancelled ? 'danger' : 'success'}>
            {isCancelled ? 'Cancellata' : 'Confermata'}
          </Badge>
        </div>
        <p className="mt-1 text-white/50">Codice: <span className="font-semibold text-white">{code}</span></p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Dettagli parcheggio">
          <div className="space-y-3 text-sm text-white/70">
            <p className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-light" />
              {booking.parking?.name}
            </p>
            <p>{booking.parking?.address}, {booking.parking?.city}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {booking.parking?.amenities?.map((a) => <Badge key={a}>{a}</Badge>)}
            </div>
          </div>
        </Card>

        <Card title="Periodo e veicolo">
          <div className="space-y-3 text-sm text-white/70">
            <p className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{formatDateRange(booking.period?.start, booking.period?.end)}</span>
            </p>
            <p className="flex items-center gap-2">
              <Car className="h-4 w-4 flex-shrink-0" />
              Targa: <span className="font-semibold text-white">{booking.customer?.plate}</span>
            </p>
          </div>
        </Card>

        <Card title="Costo">
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex justify-between">
              <span>Intestato a</span>
              <span className="text-white">{booking.customer?.firstName} {booking.customer?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span>Email</span>
              <span className="text-white">{booking.customer?.email}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <span className="text-white">Totale</span>
              <span className="text-primary-light">{formatCurrency(booking.total)}</span>
            </div>
          </div>
        </Card>

        <Card title="Azioni">
          <div className="flex flex-col gap-3">
            {!isCancelled ? (
              <>
                <div className="flex items-center gap-2 rounded-2xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
                  <CheckCircle className="h-5 w-5" />
                  Prenotazione attiva
                </div>
                <Button
                  variant="danger"
                  leftIcon={<XCircle className="h-4 w-4" />}
                  onClick={() => setCancelOpen(true)}
                >
                  Cancella prenotazione
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
                <XCircle className="h-5 w-5" />
                Prenotazione cancellata
              </div>
            )}
            <Button variant="ghost" onClick={() => navigate('/search')}>
              Nuova prenotazione
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={cancelOpen}
        title="Cancella prenotazione"
        description="Questa azione è irreversibile."
        confirmLabel="Sì, cancella"
        cancelLabel="Annulla"
        variant="danger"
        onConfirm={handleCancel}
        onClose={() => setCancelOpen(false)}
      >
        <div className="flex items-start gap-3 rounded-2xl bg-warning/10 border border-warning/20 p-4 text-sm text-warning">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>Sei sicuro di voler cancellare la prenotazione <strong>{code}</strong>? Non sarà possibile annullare l&apos;operazione.</span>
        </div>
      </Modal>
    </div>
  )
}
