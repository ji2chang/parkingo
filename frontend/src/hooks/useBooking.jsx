import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { createBooking, getBooking, cancelBooking as apiCancelBooking, updateBooking } from '../services/api'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [bookingDetails, setBookingDetails] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ── Crea prenotazione via API ─────────────────────────────────────────────
  /**
   * @param {Object} body  { parcheggio_id, data_inizio, data_fine, targa, nome, cognome, email, telefono, note }
   * @returns {Promise<Object|null>}
   */
  const book = useCallback(async (body) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createBooking(body)
      setBookingDetails(result)
      setBookings((prev) => {
        const exists = prev.find((b) => b.codice === result.codice)
        if (exists) return prev.map((b) => (b.codice === result.codice ? result : b))
        return [result, ...prev]
      })
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Recupera prenotazione per codice via API ──────────────────────────────
  /**
   * @param {string} code
   * @returns {Promise<Object|null>}
   */
  const fetchBooking = useCallback(async (code) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getBooking(code)
      setBookingDetails(result)
      setBookings((prev) => {
        const exists = prev.find((b) => b.codice === result.codice)
        if (exists) return prev.map((b) => (b.codice === result.codice ? result : b))
        return [result, ...prev]
      })
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Cancella prenotazione via API ─────────────────────────────────────────
  /**
   * @param {string} code
   * @returns {Promise<boolean>}
   */
  const removeBooking = useCallback(async (code) => {
    setLoading(true)
    setError(null)
    try {
      await apiCancelBooking(code)
      setBookings((prev) =>
        prev.map((b) => (b.codice === code ? { ...b, stato: 'cancellata' } : b))
      )
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Modifica prenotazione via API ─────────────────────────────────────────
  /**
   * @param {string} code
   * @param {{ data_inizio: string, data_fine: string }} body
   * @returns {Promise<Object|null>}
   */
  const editBooking = useCallback(async (code, body) => {
    setLoading(true)
    setError(null)
    try {
      const result = await updateBooking(code, body)
      setBookings((prev) =>
        prev.map((b) => (b.codice === code ? { ...b, ...result } : b))
      )
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <BookingContext.Provider
      value={{ bookingDetails, bookings, loading, error, book, fetchBooking, removeBooking, editBooking }}
    >
      {children}
    </BookingContext.Provider>
  )
}

BookingProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
