import { createStore, useSelector } from '@tanstack/react-store'
import type { TFunction } from 'i18next'

// App-wide notifications (achievements unlocked, offline ready, updates).
// Texts are functions of `t` so a toast follows a language switch.

export interface Toast {
  /** Same id = same toast: pushing it again replaces the old one. */
  id: string
  /** One to four Hangul/Hanja characters, shown as a red seal. */
  icon: string
  title: (t: TFunction) => string
  description?: (t: TFunction) => string
  action?: { label: (t: TFunction) => string; run: () => void }
  /** Auto-dismiss delay; 0 keeps the toast until closed. */
  durationMs?: number
}

export const DEFAULT_TOAST_MS = 6000

export const toastStore = createStore<Toast[]>([])

export const toastActions = {
  push(toast: Toast) {
    toastStore.setState((list) => [
      ...list.filter((t) => t.id !== toast.id),
      toast,
    ])
  },
  dismiss(id: string) {
    toastStore.setState((list) => list.filter((t) => t.id !== id))
  },
  clear() {
    toastStore.setState(() => [])
  },
}

export function useToasts(): Toast[] {
  return useSelector(toastStore, (list) => list)
}
