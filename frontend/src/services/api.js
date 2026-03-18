import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_URL ?? ''

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})


client.interceptors.response.use(
  
  (res) => res.data?.data ?? res.data,
  (err) => {
   
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Errore di rete'
    return Promise.reject(new Error(message))
  }
)

/**
 * GET /api/parkings
 * @param {Object} params
 * @param {string}  [params.citta]
 * @param {number}  [params.lat]
 * @param {number}  [params.lng]
 * @param {number}  [params.raggio]          - raggio in km
 * @param {string}  [params.data]            - ISO date string
 * @param {string}  [params.orario_apertura] - "HH:MM"
 * @param {string}  [params.orario_chiusura] - "HH:MM"
 * @param {boolean} [params.al_chiuso]
 * @param {boolean} [params.elettrico]
 * @param {boolean} [params.disabili]
 * @returns {Promise<Array>}
 */
export function getParkings(params = {}) {
  return client.get('/api/parkings', { params })
}

/**
 * GET /api/parkings/:id
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export function getParkingById(id) {
  return client.get(`/api/parkings/${id}`)
}

/**
 * GET /api/parkings/:id/availability
 * @param {string|number} id
 * @param {Object} params
 * @param {string}  params.data            - ISO date string
 * @param {string}  [params.orario_apertura] - "HH:MM"
 * @param {string}  [params.orario_chiusura] - "HH:MM"
 * @returns {Promise<Object>}
 */
export function getParkingAvailability(id, params = {}) {
  return client.get(`/api/parkings/${id}/availability`, { params })
}



/**
 * POST /api/bookings
 * @param {Object} body
 * @param {string|number} body.parcheggio_id
 * @param {string}        body.data_inizio  - ISO datetime
 * @param {string}        body.data_fine    - ISO datetime
 * @param {string}        body.targa
 * @param {string}        body.nome
 * @param {string}        body.cognome
 * @param {string}        body.email
 * @param {string}        body.telefono
 * @param {string}        [body.note]
 * @returns {Promise<Object>}  { codice, ... }
 */
export function createBooking(body) {
  return client.post('/api/bookings', body)
}

/**
 * GET /api/bookings/:code
 * @param {string} code
 * @returns {Promise<Object>}
 */
export function getBooking(code) {
  return client.get(`/api/bookings/${code}`)
}

/**
 * DELETE /api/bookings/:code
 * @param {string} code
 * @returns {Promise<Object>}
 */
export function cancelBooking(code) {
  return client.delete(`/api/bookings/${code}`)
}

/**
 * PATCH /api/bookings/:code
 * @param {string} code
 * @param {Object} body
 * @param {string} body.data_inizio - ISO datetime
 * @param {string} body.data_fine   - ISO datetime
 * @returns {Promise<Object>}
 */
export function updateBooking(code, body) {
  return client.patch(`/api/bookings/${code}`, body)
}

/**
 * GET /api/analytics
 * @returns {Promise<Object>}
 */
export function getAnalytics() {
  return client.get('/api/analytics')
}

/**
 * GET /api/analytics/heatmap
 * @returns {Promise<Object>}
 */
export function getHeatmap() {
  return client.get('/api/analytics/heatmap')
}

/**
 * POST /api/parkings
 * @param {Object} body
 * @returns {Promise<Object>} - created parking
 */
export function createParking(body) {
  return client.post('/api/parkings', body)
}

/**
 * PATCH /api/parkings/:id
 * @param {string|number} id
 * @param {Object} body
 * @returns {Promise<Object>} - updated parking
 */
export function updateParking(id, body) {
  return client.patch(`/api/parkings/${id}`, body)
}

/**
 * DELETE /api/parkings/:id
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export function deleteParking(id) {
  return client.delete(`/api/parkings/${id}`)
}

/**
 * GET /api/bookings
 * @returns {Promise<Array>} - list of bookings (admin)
 */
export function listBookings(params = {}) {
  return client.get('/api/bookings', { params })
}

export default {
  getParkings,
  getParkingById,
  getParkingAvailability,
  createBooking,
  getBooking,
  cancelBooking,
  updateBooking,
  getAnalytics,
  getHeatmap,
  createParking,
  updateParking,
  deleteParking,
  listBookings,
}
