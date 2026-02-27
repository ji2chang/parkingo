import { format, formatDistance } from 'date-fns'
import { it } from 'date-fns/locale'

/**
 * Format a number as Euro currency.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a date range as a human-readable string.
 * @param {string|Date} start
 * @param {string|Date} end
 * @returns {string}
 */
export function formatDateRange(start, end) {
  if (!start || !end) return '—'
  const s = new Date(start)
  const e = new Date(end)
  return `${format(s, 'd MMM yyyy HH:mm', { locale: it })} → ${format(e, 'd MMM yyyy HH:mm', { locale: it })}`
}

/**
 * Format a date as a short string.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '—'
  return format(new Date(date), 'd MMM yyyy', { locale: it })
}

/**
 * Format a relative time string.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelative(date) {
  if (!date) return '—'
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: it })
}

/**
 * Generate a random booking confirmation code.
 * @returns {string}
 */
export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
