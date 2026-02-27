import PropTypes from 'prop-types'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from './ui/Button'

const AMENITY_OPTIONS = ['Coperto', 'Scoperto', 'Videosorveglianza', 'Accesso H24', 'Colonnine EV', 'Valet']

export function MapFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false)

  function toggleAmenity(a) {
    const cur = filters.amenities ?? []
    const next = cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]
    onChange({ ...filters, amenities: next })
  }

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        onClick={() => setOpen((v) => !v)}
      >
        Filtri
        {(filters.amenities?.length || filters.maxPrice) ? (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs">
            {(filters.amenities?.length ?? 0) + (filters.maxPrice ? 1 : 0)}
          </span>
        ) : null}
      </Button>

      {open && (
        <div className="absolute left-0 top-12 z-50 glass-panel w-72 rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
              Prezzo max / ora (€)
            </p>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={filters.maxPrice ?? 10}
              onChange={(e) => onChange({ ...filters, maxPrice: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
            <p className="text-right text-sm text-white/70 mt-1">
              {filters.maxPrice ? `€ ${filters.maxPrice.toFixed(2)}` : 'Qualsiasi'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
              Servizi
            </p>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    filters.amenities?.includes(a)
                      ? 'border-primary bg-primary/20 text-primary-light'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onChange({ amenities: [], maxPrice: null })}
          >
            Azzera filtri
          </Button>
        </div>
      )}
    </div>
  )
}

MapFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
