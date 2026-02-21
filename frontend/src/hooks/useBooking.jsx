import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [bookingDetails, setBookingDetails] = useState(null)
  const [bookings, setBookings] = useState([])

  const saveBooking = useCallback((booking) => {
    setBookingDetails(booking)
    setBookings((prev) => {
      const exists = prev.find((b) => b.code === booking.code)
      if (exists) return prev.map((b) => (b.code === booking.code ? booking : b))
      return [booking, ...prev]
    })
  }, [])

  const cancelBooking = useCallback((code) => {
    setBookings((prev) =>
      prev.map((b) => (b.code === code ? { ...b, status: 'cancelled' } : b))
    )
  }, [])

  return (
    <BookingContext.Provider value={{ bookingDetails, bookings, saveBooking, cancelBooking }}>
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
