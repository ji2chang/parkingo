import { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const Input = forwardRef(function Input(
  { label, error, helpText, leftIcon, rightIcon, className = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white/80">
          {label}
          {props.required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 text-white/40">{leftIcon}</span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${
            error
              ? 'border-danger focus:ring-danger/60'
              : 'border-white/10 hover:border-white/20'
          }`}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-4 text-white/40">{rightIcon}</span>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {helpText && !error && <p className="text-xs text-white/40">{helpText}</p>}
    </div>
  )
})

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helpText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  required: PropTypes.bool,
}
