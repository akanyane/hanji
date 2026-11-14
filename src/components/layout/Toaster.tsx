import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_TOAST_MS,
  type Toast,
  toastActions,
  useToasts,
} from '../../stores/toasts'
import { Seal } from '../brand/Seal'
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
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transitionEnd: { filter: 'none' },
      }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
      transition={spring}
      className="hanji pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-ink-300 bg-ink-50 p-4 shadow-lift dark:border-ink-700 dark:bg-ink-900"
    >
      <Seal text={toast.icon} size="md" animate="stamp" delay={0.15} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-serif font-bold">{toast.title(t)}</p>
        {toast.description && (
          <p className="text-sm text-ink-600 dark:text-ink-300">
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
            className="mt-1 self-start rounded-md bg-ink-900 px-3 py-1 text-sm font-medium text-ink-50 hover:bg-ink-700 dark:bg-ink-50 dark:text-ink-900"
          >
            {toast.action.label(t)}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => toastActions.dismiss(toast.id)}
        aria-label={t('common.close')}
        className="rounded-full px-2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
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
