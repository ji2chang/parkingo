import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext(null)

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(({ type = 'info', title, description, duration = 4000 }) => {
    const id = ++_id
    setToasts((prev) => [...prev, { id, type, title, description }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function ToastItem({ toast, onClose }) {
  const colors = {
    success: 'border-l-4 border-success bg-success/10',
    danger: 'border-l-4 border-danger bg-danger/10',
    warning: 'border-l-4 border-warning bg-warning/10',
    info: 'border-l-4 border-info bg-info/10',
  }
  return (
    <div
      className={`glass-panel rounded-2xl px-5 py-4 shadow-xl min-w-[280px] max-w-sm ${colors[toast.type] ?? colors.info}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{toast.title}</p>
          {toast.description && <p className="mt-1 text-sm text-white/70">{toast.description}</p>}
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-lg leading-none">
          ×
        </button>
      </div>
    </div>
  )
}

ToastItem.propTypes = {
  toast: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
