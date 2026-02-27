import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Car } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { formatCurrency } from '../utils/format'

export function ParkingCard({ parking, index = 0 }) {
  const navigate = useNavigate()
  const ratio = parking.availableSpots / parking.totalSpots

  const availVariant =
    ratio > 0.5 ? 'success' : ratio > 0.2 ? 'warning' : ratio > 0 ? 'danger' : 'danger'

  return (
    <motion.div
      className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{parking.name}</h3>
          <p className="flex items-center gap-1 text-sm text-white/60 mt-1">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            {parking.address}, {parking.city}
          </p>
        </div>
        <div className="flex items-center gap-1 text-warning text-sm font-semibold flex-shrink-0">
          <Star className="h-4 w-4 fill-warning" />
          {parking.rating.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {parking.amenities.map((a) => (
          <Badge key={a} variant="default">{a}</Badge>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-white">{formatCurrency(parking.pricePerHour)}<span className="text-sm font-normal text-white/50">/ora</span></p>
          <p className="text-sm text-white/50">{formatCurrency(parking.pricePerDay)}/giorno</p>
        </div>
        <div className="text-right">
          <Badge variant={availVariant}>
            <Car className="h-3 w-3 mr-1 inline" />
            {parking.availableSpots} / {parking.totalSpots}
          </Badge>
        </div>
      </div>

      <Button onClick={() => navigate(`/booking/${parking.id}`)} className="w-full">
        Prenota ora
      </Button>
    </motion.div>
  )
}

ParkingCard.propTypes = {
  parking: PropTypes.object.isRequired,
  index: PropTypes.number,
}
