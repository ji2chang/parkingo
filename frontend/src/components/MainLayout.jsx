import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e1a]">
      <Navbar />
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center py-6 text-white/30 text-xs">
      </footer>
    </div>
  )
}
