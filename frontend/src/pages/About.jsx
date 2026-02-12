import React from 'react'
import { ShieldCheck, Zap, Users, Target } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Sicurezza',
    desc: 'Ogni prenotazione è protetta e garantita. Dati crittografati e pagamenti sicuri.',
  },
  {
    icon: Zap,
    title: 'Innovazione',
    desc: "Tecnologie all'avanguardia per un'esperienza di parcheggio smart e intuitiva.",
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Migliaia di utenti si affidano a noi ogni giorno per trovare il posto perfetto.',
  },
  {
    icon: Target,
    title: 'Precisione',
    desc: 'Disponibilità in tempo reale e dati accurati per una scelta sempre informata.',
  },
]

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f1b3d] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Chi siamo</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Smart Parking nasce con l'obiettivo di trasformare l'esperienza di parcheggio urbano,
            rendendola semplice, veloce e sostenibile.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">La nostra missione</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Crediamo che trovare un parcheggio non debba essere una fonte di stress. La nostra
                piattaforma connette gli automobilisti con i parcheggi disponibili in tempo reale,
                riducendo traffico, emissioni e tempo sprecato.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Dalla ricerca alla prenotazione, ogni passaggio è progettato per essere intuitivo e
                veloce. Con zone dedicate — Standard, Elettriche e Premium — offriamo la soluzione
                giusta per ogni esigenza.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-extrabold text-teal-600">50+</p>
                  <p className="text-sm text-gray-500 mt-1">Parcheggi</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-teal-600">10k+</p>
                  <p className="text-sm text-gray-500 mt-1">Utenti attivi</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-teal-600">99%</p>
                  <p className="text-sm text-gray-500 mt-1">Soddisfazione</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-teal-600">24/7</p>
                  <p className="text-sm text-gray-500 mt-1">Supporto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-12">
            I nostri valori
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
