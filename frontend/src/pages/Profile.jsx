import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { getUserProfile, updateUserProfile, getUserCars, createUserCar, updateUserCar, deleteUserCar, listBookings, cancelBooking, updateBooking } from '../services/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Card } from '../components/ui/Card'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { Car, Plus, Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Car modal state
  const [carModalOpen, setCarModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [carForm, setCarForm] = useState({ targa: '' })

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [bookingForm, setBookingForm] = useState({ data_inizio: '', orario_inizio: '', data_fine: '', orario_fine: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [profileData, carsData, bookingsData] = await Promise.all([
        getUserProfile(),
        getUserCars(),
        listBookings()
      ])
      setProfile(profileData)
      setCars(carsData.filter(Boolean))
      setBookings(bookingsData.filter(Boolean))
    } catch (error) {
      showToast({ type: 'danger', title: 'Errore', description: 'Impossibile caricare i dati del profilo' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({ nome: profile.nome, cognome: profile.cognome })
      window.location.reload()

      showToast({ type: 'success', title: 'Successo', description: 'Profilo aggiornato' })
      
    } catch (error) {
      showToast({ type: 'danger', title: 'Errore', description: 'Impossibile aggiornare il profilo' })
    }
  }

  const handleAddCar = () => {
    setEditingCar(null)
    setCarForm({ targa: '' })
    setCarModalOpen(true)
  }

  const handleEditCar = (car) => {
    setEditingCar(car)
    setCarForm({ targa: car.targa })
    setCarModalOpen(true)
  }

  const handleDeleteCar = async (carId) => {
    if (!confirm('Sei sicuro di voler eliminare questa auto?')) return
    try {
      await deleteUserCar(carId)
      setCars(cars.filter(car => car.id !== carId))
      showToast({ type: 'success', title: 'Successo', description: 'Auto eliminata' })
    } catch (error) {
      showToast({ type: 'danger', title: 'Errore', description: 'Impossibile eliminare l\'auto' })
    }
  }

  const handleSaveCar = async () => {
    try {
      let newCar = null;
      if (editingCar) {
        await updateUserCar(editingCar.id, carForm)
        setCars(cars.map(car => car.id === editingCar.id ? { ...car, ...carForm } : car))
        showToast({ type: 'success', title: 'Successo', description: 'Auto aggiornata' })
      } else {
        newCar = await createUserCar(carForm)
        if (!newCar || !newCar.id) {
          showToast({ type: 'danger', title: 'Errore', description: 'Impossibile salvare l\'auto' })
          return
        }
        setCars([...cars, newCar])
        showToast({ type: 'success', title: 'Successo', description: 'Auto aggiunta' })
      }
      setCarModalOpen(false)
    } catch (error) {
      showToast({ type: 'danger', title: 'Errore', description: 'Impossibile salvare l\'auto' })
    }
  }

  const handleCancelBooking = async (bookingCode) => {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return
    try {
      await cancelBooking(bookingCode)
      setBookings(bookings.filter(b => b.codice !== bookingCode))
      showToast({ type: 'success', title: 'Successo', description: 'Prenotazione cancellata' })
    } catch (error) {
      showToast({ type: 'danger', title: 'Errore', description: 'Impossibile cancellare la prenotazione' })
    }
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking)
    const start = new Date(booking.data_inizio)
    const end = new Date(booking.data_fine)
    setBookingForm({
      data_inizio: start.toISOString().split('T')[0],
      orario_inizio: start.toTimeString().slice(0, 5),
      data_fine: end.toISOString().split('T')[0],
      orario_fine: end.toTimeString().slice(0, 5)
    })
    setBookingModalOpen(true)
  }

  const handleSaveBooking = async () => {
    try {
      const dataInizio = `${bookingForm.data_inizio}T${bookingForm.orario_inizio}:00`
      const dataFine = `${bookingForm.data_fine}T${bookingForm.orario_fine}:00`
      await updateBooking(editingBooking.codice, { data_inizio: dataInizio, data_fine: dataFine })
      setBookings(bookings.map(b => b.codice === editingBooking.codice ? { ...b, data_inizio: dataInizio, data_fine: dataFine } : b))
      showToast({ type: 'success', title: 'Successo', description: 'Prenotazione aggiornata' })
      setBookingModalOpen(false)
    } catch (error) {
      showToast({ type: 'danger', title: 'Errore', description: 'Impossibile aggiornare la prenotazione' })
    }
  }

  const canModifyBooking = (booking) => {
    const now = new Date()
    const start = new Date(booking.data_inizio)
    return start > now
  }

  if (loading) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="text-center">Caricamento...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="text-center">Devi effettuare il login per vedere il profilo.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 max-w-4xl mx-auto space-y-8">
      {/* Profile Info */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Informazioni Profilo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            value={profile.email}
            readOnly
            className="opacity-60"
          />
          <Input
            label="Nome"
            value={profile.nome}
            onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
          />
          <Input
            label="Cognome"
            value={profile.cognome}
            onChange={(e) => setProfile({ ...profile, cognome: e.target.value })}
          />
          <Input
            label="Nome Utente"
            value={profile.nome_utente}
            readOnly
            className="opacity-60"
          />
          <Input
            label="Data Registrazione"
            value={new Date(profile.data_registrazione).toLocaleDateString('it-IT')}
            readOnly
            className="opacity-60"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleUpdateProfile}>Salva Modifiche</Button>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </Card>

      {/* Cars Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Car className="w-6 h-6" />
            Le Mie Auto
          </h2>
          <Button onClick={handleAddCar} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Auto
          </Button>
        </div>
        <div className="space-y-3">
          {cars.length === 0 ? (
            <p className="text-white/60 text-center py-8">Nessuna auto registrata</p>
          ) : (
            cars.map((car) => (
              <div key={car.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="font-medium">{car.targa}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCar(car)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteCar(car.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Bookings Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6" />
          Le Mie Prenotazioni
        </h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-white/60 text-center py-8">Nessuna prenotazione</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.codice} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{booking.parcheggio?.nome || 'Parcheggio'}</span>
                      <span className="text-sm text-white/60">({booking.codice})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(booking.data_inizio).toLocaleString('it-IT')} - {new Date(booking.data_fine).toLocaleString('it-IT')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Auto: </span>
                      <span>{booking.targa}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Totale: </span>
                      <span>€{booking.importo_totale}</span>
                    </div>
                  </div>
                  {canModifyBooking(booking) && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate('/manage/' + booking.codice)}>
                        Modifica
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Car Modal */}
      <Modal
        open={carModalOpen}
        title={editingCar ? 'Modifica Auto' : 'Aggiungi Auto'}
        onClose={() => setCarModalOpen(false)}
        onConfirm={handleSaveCar}
        confirmLabel="Salva"
      >
        <Input
          label="Targa"
          value={carForm.targa}
          onChange={(e) => setCarForm({ ...carForm, targa: e.target.value.toUpperCase() })}
          placeholder="AA000AA"
        />
      </Modal>

      {/* Booking Modal */}
      <Modal
        open={bookingModalOpen}
        title="Modifica Prenotazione"
        onClose={() => setBookingModalOpen(false)}
        onConfirm={handleSaveBooking}
        confirmLabel="Salva"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Inizio"
              type="date"
              value={bookingForm.data_inizio}
              onChange={(e) => setBookingForm({ ...bookingForm, data_inizio: e.target.value })}
            />
            <Input
              label="Ora Inizio"
              type="time"
              value={bookingForm.orario_inizio}
              onChange={(e) => setBookingForm({ ...bookingForm, orario_inizio: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Fine"
              type="date"
              value={bookingForm.data_fine}
              onChange={(e) => setBookingForm({ ...bookingForm, data_fine: e.target.value })}
            />
            <Input
              label="Ora Fine"
              type="time"
              value={bookingForm.orario_fine}
              onChange={(e) => setBookingForm({ ...bookingForm, orario_fine: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfilePage
