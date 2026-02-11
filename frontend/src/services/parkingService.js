import api from './api'

// Parking service functions
export const parkingService = {
  // Get all parkings
  getAllParkings: async () => {
    const response = await api.get('/parkings')
    return response.data
  },

  // Get single parking by ID
  getParkingById: async (id) => {
    const response = await api.get(`/parkings/${id}`)
    return response.data
  },

  // Create new parking
  createParking: async (parkingData) => {
    const response = await api.post('/parkings', parkingData)
    return response.data
  },

  // Update parking
  updateParking: async (id, parkingData) => {
    const response = await api.put(`/parkings/${id}`, parkingData)
    return response.data
  },

  // Delete parking
  deleteParking: async (id) => {
    const response = await api.delete(`/parkings/${id}`)
    return response.data
  },
}

export default parkingService
