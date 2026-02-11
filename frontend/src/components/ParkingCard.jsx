import React from 'react'

export default function ParkingCard({ parking }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{parking.name}</h3>
      <p className="text-gray-600 mb-4">
        <span className="font-medium">Spaces:</span> {parking.spaces}
      </p>
      {parking.location && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Location:</span> {parking.location}
        </p>
      )}
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        View Details
      </button>
    </div>
  )
}
