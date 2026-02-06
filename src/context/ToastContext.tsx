import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: (type: ToastType, message: string, action?: { label: string; onClick: () => void }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback(
    (type: ToastType, message: string, action?: { label: string; onClick: () => void }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const item: ToastItem = { id, type, message, action }

      setToasts(prev => {
        const next = [...prev, item]
        return next.slice(-3) // max 3 visible
      })

      // Auto-dismiss after 5s
      setTimeout(() => dismiss(id), 5000)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
