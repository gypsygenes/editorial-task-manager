import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToast, type ToastType } from '../context/ToastContext'

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors: Record<ToastType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  warning: 'text-amber-400',
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto bg-secondary border border-border-subtle rounded-xl shadow-editorial-lg px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-[400px]"
            >
              <Icon size={18} className={colors[toast.type]} />
              <span className="text-sm text-text-secondary flex-1">{toast.message}</span>
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="text-xs font-medium text-accent hover:text-accent-hover whitespace-nowrap"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => dismiss(toast.id)}
                className="p-0.5 text-text-ghost hover:text-text-muted transition-colors"
              >
                <X size={14} />
              </button>
              {/* Progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-0.5 bg-accent/30 rounded-b-xl"
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
