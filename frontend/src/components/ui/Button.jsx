import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-40 disabled:cursor-not-allowed select-none'

const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-lg shadow-primary/30',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 active:scale-95 border border-white/10',
  ghost:
    'bg-transparent text-white/80 hover:bg-white/10 active:scale-95',
  outline:
    'bg-transparent text-white border border-white/20 hover:bg-white/10 active:scale-95',
  danger:
    'bg-danger text-white hover:bg-danger/80 active:scale-95 shadow-lg shadow-danger/30',
  success:
    'bg-success text-white hover:bg-success/80 active:scale-95 shadow-lg shadow-success/30',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  as: Component = 'button',
  className = '',
  children,
  ...props
}) {
  const cls = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
      <Component className={cls} disabled={loading || props.disabled} {...props}>
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </Component>
    </motion.div>
  )
}

Button.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  loading: PropTypes.bool,
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
}
