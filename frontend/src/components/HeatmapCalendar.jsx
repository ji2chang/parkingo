import PropTypes from 'prop-types'
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { it } from 'date-fns/locale'

/**
 * Displays a monthly calendar heatmap of availability.
 * availability: { [dateStr]: { available: number, total: number } }
 */
export function HeatmapCalendar({ month = new Date(), availability = {}, onDayClick }) {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const days = eachDayOfInterval({ start, end })

  // Pad days to start on Monday
  const startDow = (start.getDay() + 6) % 7
  const padded = [...Array(startDow).fill(null), ...days]

  function getColor(day) {
    if (!day) return ''
    const key = format(day, 'yyyy-MM-dd')
    const info = availability[key]
    if (!info) return 'bg-white/5'
    const ratio = info.available / info.total
    if (ratio > 0.5) return 'bg-success/40 hover:bg-success/60'
    if (ratio > 0.2) return 'bg-warning/40 hover:bg-warning/60'
    if (ratio > 0) return 'bg-danger/30 hover:bg-danger/50'
    return 'bg-danger/60 hover:bg-danger/80'
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-white/70 capitalize">
        {format(month, 'MMMM yyyy', { locale: it })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/40">
        {['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {padded.map((day, i) =>
          day ? (
            <button
              key={i}
              title={format(day, 'd MMM', { locale: it })}
              onClick={() => onDayClick?.(day)}
              className={`rounded-lg py-1.5 text-xs font-medium text-white transition-colors ${getColor(day)}`}
            >
              {format(day, 'd')}
            </button>
          ) : (
            <span key={i} />
          )
        )}
      </div>
      <div className="flex gap-3 text-xs text-white/50 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-success/40" /> Disponibile
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-warning/40" /> Pochi posti
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-danger/60" /> Esaurito
        </span>
      </div>
    </div>
  )
}

HeatmapCalendar.propTypes = {
  month: PropTypes.instanceOf(Date),
  availability: PropTypes.object,
  onDayClick: PropTypes.func,
}
