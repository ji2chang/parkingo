import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Parkingo. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-2">Made with React + Vite + Tailwind CSS</p>
      </div>
    </footer>
  )
}
