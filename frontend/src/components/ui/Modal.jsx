import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({
  open,
  title,
  description,
  children,
  confirmLabel = 'Conferma',
  cancelLabel = 'Annulla',
  onConfirm,
  onClose,
  variant = 'default',
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
                  {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-6">{children}</div>
              <div className="flex justify-end gap-3">
                {cancelLabel && (
                  <Button variant="ghost" onClick={onClose}>
                    {cancelLabel}
                  </Button>
                )}
                {confirmLabel && onConfirm && (
                  <Button
                    variant={variant === 'danger' ? 'danger' : 'primary'}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.string,
}
