import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext, type ToastVariant } from './toastContext'
import styles from './Toast.module.css'

type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
}

const AUTO_DISMISS_MS = 4000

function createToastId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `toast-${Date.now()}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = createToastId()
      setToasts((current) => [...current, { id, message, variant }])

      window.setTimeout(() => {
        dismissToast(id)
      }, AUTO_DISMISS_MS)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[styles.toast, styles[toast.variant]].join(' ')}
            role="status"
          >
            <p className={styles.message}>{toast.message}</p>
            <button
              type="button"
              className={styles.dismiss}
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
