import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { createBooking, getBooking, cancelBooking as apiCancelBooking, updateBooking } from '../services/api'
import { getParkingById } from '../services/api'
import { emitBookingEvent, BOOKING_EVENTS } from './useBookingRefresh'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const STORAGE_KEY = 'parkly_bookings'

  const loadFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch (e) {
      return []
    }
  }

  const saveToStorage = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch (e) {
      // ignore
    }
  }

  const [bookingDetails, setBookingDetails] = useState(null)
  const [bookings, setBookings] = useState(() => loadFromStorage())
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
      
      // 验证返回的数据包含有效的 codice
      if (!result || (!result.codice_prenotazione && !result.codice)) {
        throw new Error('Errore: risposta del server non valida')
      }
      
      const codice = result.codice_prenotazione || result.codice
      setBookingDetails(result)
      setBookings((prev) => {
        const exists = prev.find((b) => b.codice_prenotazione === codice || b.codice === codice)
        const next = exists ? prev.map((b) => (b.codice_prenotazione === codice || b.codice === codice ? result : b)) : [result, ...prev]
        saveToStorage(next)
        return next
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
      if (result && result.success === false) {
        setError(result.message || 'Prenotazione non trovata')
        setBookingDetails(null)
        return null
      }
      // Ensure booking contains parking details; if not, fetch them
      if ((!result.parking && !result.parcheggio) && (result.parcheggio_id || result.parcheggioId || result.parking_id)) {
        const pid = result.parcheggio_id ?? result.parcheggioId ?? result.parking_id
        try {
          const p = await getParkingById(pid)
          if (p) {
            // attach under both keys for compatibility
            result.parking = p
            result.parcheggio = p
          }
        } catch (e) {
          // ignore parking fetch error
        }
      }

      setBookingDetails(result)
      setBookings((prev) => {
        const exists = prev.find((b) => b.codice === result.codice)
        const next = exists ? prev.map((b) => (b.codice === result.codice ? result : b)) : [result, ...prev]
        saveToStorage(next)
        return next
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
      setBookings((prev) => {
        const next = prev.map((b) => (b.codice === code ? { ...b, stato: 'cancellata' } : b))
        saveToStorage(next)
        return next
      })
      // Emit cancellation event to trigger refresh
      emitBookingEvent(BOOKING_EVENTS.CANCELLED, { code })
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
      setBookings((prev) => {
        const next = prev.map((b) => (b.codice === code ? { ...b, ...result } : b))
        saveToStorage(next)
        return next
      })
      // Emit update event to trigger refresh
      emitBookingEvent(BOOKING_EVENTS.UPDATED, { code, booking: result })
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
