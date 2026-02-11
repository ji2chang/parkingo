import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Parkingo
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          This is the initial frontend skeleton. From here we'll add components, API calls and UI for parking management.
        </p>
        <div className="flex gap-4">
          <Link
            to="/parkings"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Parkings
          </Link>
          <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
