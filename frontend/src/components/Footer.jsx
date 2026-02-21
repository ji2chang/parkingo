import React from 'react'
import { Link } from 'react-router-dom'
import { ParkingSquare, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f1b3d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <ParkingSquare className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-lg font-bold">Smart Parking</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Il modo più semplice e veloce per trovare e prenotare il tuo posto auto.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Link utili
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/city-map', label: 'Trova Parcheggio' },
                { to: '/about', label: 'Chi siamo' },
                { to: '/contact', label: 'Contatti' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-teal-300 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Legale
            </h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Termini di Servizio', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60 hover:text-teal-300 transition cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Contatti
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                info@smartparking.it
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                +39 02 1234 5678
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                Via Roma 123, 20121 Milano
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Smart Parking. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-white/30">
            Built with React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
