import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

export function Card({ title, description, actions, children, className = '', hoverable = false }) {
  const base =
    'glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4'
  const hover = hoverable ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''

  return (
    <motion.div
      className={`${base} ${hover} ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
        </div>
      )}
      <div className="flex-1">{children}</div>
      {actions && <div className="flex gap-3 flex-wrap">{actions}</div>}
    </motion.div>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
}
