import React, { useState, useEffect } from 'react'
import ParkingCard from '../components/ParkingCard'
import parkingService from '../services/parkingService'

export default function ParkingList() {
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchParkings()
  }, [])

  const fetchParkings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await parkingService.getAllParkings()
      setParkings(data)
    } catch (err) {
      console.error('Failed to fetch parkings:', err)
      setError('Failed to load parkings. Using mock data.')
      // Fallback to mock data on error
      setParkings([
        { id: 1, name: 'Central Parking', spaces: 120, location: 'Downtown' },
        { id: 2, name: 'North Lot', spaces: 45, location: 'North District' },
        { id: 3, name: 'South Plaza', spaces: 80, location: 'South Avenue' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-gray-600">Loading parkings...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Parking Locations</h2>

      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkings.map((p) => (
          <ParkingCard key={p.id} parking={p} />
        ))}
      </div>
    </div>
  )
}
