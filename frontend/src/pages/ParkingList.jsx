import React from 'react'
import ParkingCard from '../components/ParkingCard'

export default function ParkingList() {
  // placeholder static list for now
  const parkings = [
    { id: 1, name: 'Central Parking', spaces: 120, location: 'Downtown' },
    { id: 2, name: 'North Lot', spaces: 45, location: 'North District' },
    { id: 3, name: 'South Plaza', spaces: 80, location: 'South Avenue' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Parking Locations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkings.map((p) => (
          <ParkingCard key={p.id} parking={p} />
        ))}
      </div>
    </div>
  )
}
