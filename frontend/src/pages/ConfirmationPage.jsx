import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { formatCurrency, formatDateRange } from '../utils/format'
import { Check, Mail, Printer } from 'lucide-react'
import { useToast } from '../hooks/useToast'
import { useBooking } from '../hooks/useBooking'

export function ConfirmationPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { bookingDetails, error, loading, fetchBooking } = useBooking()
  const [previewOpen, setPreviewOpen] = useState(false)
  
  // Effettua la fetch solo qui, in modo sicuro
  useEffect(() => {
    if (code) fetchBooking(code)
  }, [code])

  

  // Gestione caricamento
  if (loading) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-xl font-semibold text-white/80">Caricamento in corso...</p>
      </div>
    )
  }

  // Gestione errore generico
  if (error) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-xl font-semibold text-red-400">{error}</p>
        <Button className="mt-6" onClick={() => navigate('/search')}>
          Torna alla ricerca
        </Button>
      </div>
    )
  }
  // Gestione caso: utente non ha permesso di visualizzare la prenotazione o dati non disponibili
  const booking = bookingDetails
  if (!booking) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
        <p className="text-xl font-semibold text-red-400">Non hai il permesso di visualizzare questa prenotazione.</p>
        <Button className="mt-6" onClick={() => navigate('/search')}>
          Torna alla ricerca
        </Button>
      </div>
    )
  }

  // Esempio di gestione errore cancellazione (da usare dove serve, es: in una funzione handleCancel)
  // async function handleCancel() {
  //   const ok = await removeBooking(code)
  //   if (!ok) {
  //     showToast({ type: 'danger', title: 'Errore', description: 'Impossibile cancellare la prenotazione.' })
  //   }
  // }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    showToast({ type: 'success', title: 'Codice copiato' })
  }

  const emailPreview = {
      subject: `Conferma prenotazione ${booking.codice}`,
      body: `Ciao ${booking.customer?.firstName},\n\nLa tua prenotazione presso ${booking.parking?.name} è confermata.\nCheck-in: ${formatDateRange(booking.period?.start, booking.period?.end)}\nTotale stimato: ${formatCurrency(booking.total)}\n\nMostra questo codice all'arrivo: ${booking.codice}.\n\nGrazie da Parkingo!`,
  }

  const handlePrint = () => {
    const receiptHtml = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Riepilogo prenotazione ${code}</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; padding: 48px; color: #0f172a; }
      h1 { font-size: 24px; margin-bottom: 16px; }
      .section { margin-bottom: 24px; }
      .label { text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; color: #64748b; }
      .value { font-size: 16px; font-weight: 600; margin-top: 4px; }
      .card { border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-top: 16px; background: #f8fafc; }
    </style>
  </head>
  <body>
    <h1>Riepilogo prenotazione</h1>
    <div class="section">
      <div class="label">Codice</div>
      <div class="value">${code}</div>
    </div>
    <div class="card">
      <div class="label">Parcheggio</div>
      <div class="value">${booking.parking?.name}</div>
      <div>${booking.parking?.address} · ${booking.parking?.city}</div>
      <div class="label" style="margin-top:16px;">Periodo</div>
      <div class="value">${formatDateRange(booking.period?.start, booking.period?.end)}</div>
      <div class="label" style="margin-top:16px;">Totale stimato</div>
      <div class="value">${formatCurrency(booking.total)}</div>
      <div class="label" style="margin-top:16px;">Targa</div>
      <div class="value">${booking.customer?.plate}</div>
    </div>
    <p style="margin-top:32px; color:#475569;">Mostra questo documento all'arrivo o salvalo come PDF dalla finestra di stampa.</p>
  </body>
</html>`

    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) {
      showToast({ type: 'danger', title: 'Popup bloccato', description: 'Consenti i popup per stampare.' })
      return
    }
    w.document.write(receiptHtml)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-semibold">Prenotazione confermata!</h1>
        <p className="text-white/70">
          Ti abbiamo inviato una email con tutti i dettagli. Puoi gestire la prenotazione in autonomia.
        </p>
        <div className="rounded-3xl border border-dashed border-white/30 px-6 py-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Codice</p>
          <p className="text-4xl font-semibold">{code}</p>
          <Button variant="ghost" className="mt-3" onClick={copyCode}>
            Copia codice
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Riepilogo">
          <p className="text-lg font-semibold text-white">{booking.parking?.name}</p>
          <p className="text-white/70">{booking.parking?.address}</p>
          <Badge variant="info" className="mt-2">{booking.parking?.city}</Badge>
          <p className="mt-4 text-white/60">{formatDateRange(booking.period?.start, booking.period?.end)}</p>
          <p className="text-2xl font-semibold text-white mt-1">{formatCurrency(booking.total)}</p>
        </Card>
        <Card title="Prossime azioni">
          <div className="flex flex-col gap-3">
            <Button as={Link} to={`/manage/${code}`} variant="secondary">
              Gestisci prenotazione
            </Button>
            <Button as={Link} to="/search" variant="ghost">
              Nuova prenotazione
            </Button>
            <Button variant="outline" onClick={handlePrint} leftIcon={<Printer className="h-4 w-4" />}>
              Stampa / PDF
            </Button>
            <Button variant="ghost" leftIcon={<Mail className="h-4 w-4" />} onClick={() => setPreviewOpen(true)}>
              Anteprima email
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={previewOpen}
        title={emailPreview.subject}
        description={booking.parking?.name}
        confirmLabel="Chiudi"
        cancelLabel=""
        onConfirm={() => setPreviewOpen(false)}
        onClose={() => setPreviewOpen(false)}
      >
        <div className="space-y-4 text-sm text-white/80">
          {emailPreview.body.split('\n').map((line, index) => (
            <p key={index}>{line || '\u00A0'}</p>
          ))}
        </div>
      </Modal>
    </div>
  )
}
