import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { SearchPage } from './SearchPage'
import { MapPage } from './MapPage'

export function BookingStartPage() {
  const [mode, setMode] = useState('search')

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Prenotare</h1>
        <p className="mt-1 text-white/50">Scegli come trovare il parcheggio. Per impostazione predefinita usiamo la ricerca.</p>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          variant={mode === 'search' ? 'primary' : 'secondary'}
          leftIcon={<Search className="h-4 w-4" />}
          onClick={() => setMode('search')}
        >
          Cerca
        </Button>
        <Button
          size="lg"
          variant={mode === 'map' ? 'primary' : 'secondary'}
          leftIcon={<MapPin className="h-4 w-4" />}
          onClick={() => setMode('map')}
        >
          Mappa
        </Button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#080b16] p-0">
        {mode === 'search' ? <SearchPage /> : <MapPage />}
      </div>
    </div>
  )
}
