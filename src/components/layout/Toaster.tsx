import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_TOAST_MS,
  type Toast,
  toastActions,
  useToasts,
} from '../../stores/toasts'
import { spring } from '../motion/presets'

function ToastItem({ toast }: { toast: Toast }) {
  const { t } = useTranslation()
  const duration = toast.durationMs ?? DEFAULT_TOAST_MS

  useEffect(() => {
    if (duration <= 0) return
    const timer = window.setTimeout(
      () => toastActions.dismiss(toast.id),
      duration,
    )
    return () => window.clearTimeout(timer)
  }, [toast.id, duration])

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
      transition={spring}
      className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
    >
      <motion.span
        aria-hidden="true"
        className="text-2xl"
        initial={{ rotate: -30, scale: 0.4 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {toast.icon}
      </motion.span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-semibold">{toast.title(t)}</p>
        {toast.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {toast.description(t)}
          </p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.run()
              toastActions.dismiss(toast.id)
            }}
            className="self-start rounded-full bg-sky-600 px-3 py-1 text-sm font-medium text-white hover:bg-sky-700"
          >
            {toast.action.label(t)}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => toastActions.dismiss(toast.id)}
        aria-label={t('common.close')}
        className="rounded-full px-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100"
      >
        ×
      </button>
    </motion.li>
  )
}

/** Stack of notifications in the bottom corner. */
export function Toaster() {
  const toasts = useToasts()
  return (
    <ol
      aria-live="polite"
      className="pointer-events-none fixed right-0 bottom-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
