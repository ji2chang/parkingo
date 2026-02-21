import { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const Select = forwardRef(function Select(
  { label, error, options = [], className = '', ...props },
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
      <select
        ref={ref}
        className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 ${
          error ? 'border-danger' : 'border-white/10 hover:border-white/20'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1e293b] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
})

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
  className: PropTypes.string,
  required: PropTypes.bool,
}
