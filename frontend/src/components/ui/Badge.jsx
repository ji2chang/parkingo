import PropTypes from 'prop-types'

const VARIANTS = {
  default: 'bg-white/10 text-white',
  primary: 'bg-primary/20 text-primary-light',
  success: 'bg-success/20 text-success',
  danger: 'bg-danger/20 text-danger',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
}

export function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${VARIANTS[variant] ?? VARIANTS.default} ${className}`}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
}
