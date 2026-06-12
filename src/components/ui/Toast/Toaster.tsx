import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useToastStore, type ToastType } from '../../../store/toastStore'
import styles from './Toaster.module.scss'

const icons: Record<ToastType, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return createPortal(
    <div className={styles.region} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`} role="status">
            <Icon size={18} className={styles.icon} />
            <span className={styles.message}>{t.message}</span>
            <button
              type="button"
              className={styles.dismiss}
              aria-label="Dismiss notification"
              onClick={() => removeToast(t.id)}
            >
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>,
    document.body
  )
}
