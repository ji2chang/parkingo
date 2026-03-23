import { useEffect } from 'react'

// Global event emitter for booking changes
const bookingEventEmitter = new EventTarget()

export const BOOKING_EVENTS = {
  CREATED: 'booking:created',
  CANCELLED: 'booking:cancelled',
  UPDATED: 'booking:updated',
}

/**
 * Emit a booking event that can be listened to by other components
 * @param {string} eventType - One of BOOKING_EVENTS
 * @param {Object} data - Event data
 */
export function emitBookingEvent(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data })
  bookingEventEmitter.dispatchEvent(event)
}

/**
 * Hook to listen for booking events and trigger a callback
 * @param {string|string[]} eventTypes - Event type(s) to listen for
 * @param {Function} callback - Function to call when event is emitted
 */
export function useBookingRefresh(eventTypes, callback) {
  useEffect(() => {
    const events = Array.isArray(eventTypes) ? eventTypes : [eventTypes]
    
    const handleEvent = () => {
      if (callback) callback()
    }
    
    events.forEach((eventType) => {
      bookingEventEmitter.addEventListener(eventType, handleEvent)
    })
    
    return () => {
      events.forEach((eventType) => {
        bookingEventEmitter.removeEventListener(eventType, handleEvent)
      })
    }
  }, [eventTypes, callback])
}
