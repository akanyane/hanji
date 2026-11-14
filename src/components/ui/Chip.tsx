import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ChipProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

/** Pill-shaped toggle button (filters, category selection). */
export function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-md border px-3 py-1 text-sm font-medium transition-colors',
        selected
          ? 'border-ink-900 bg-ink-900 text-ink-50 dark:border-ink-50 dark:bg-ink-50 dark:text-ink-900'
          : 'border-ink-300 text-ink-700 hover:border-ink-900 hover:text-ink-900 dark:border-ink-600 dark:text-ink-200 dark:hover:border-ink-200 dark:hover:text-ink-50',
      )}
    >
      {children}
    </button>
  )
}
