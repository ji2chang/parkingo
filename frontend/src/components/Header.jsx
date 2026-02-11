import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-blue-200 transition">
            Parkingo
          </Link>
        </h1>
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <Link to="/parkings" className="hover:text-blue-200 transition">
            Parkings
          </Link>
        </nav>
      </div>
    </header>
  )
}
