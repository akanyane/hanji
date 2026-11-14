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
        'rounded-full px-3 py-1 text-sm font-medium transition',
        selected
          ? 'bg-sky-700 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
      )}
    >
      {children}
    </button>
  )
}
