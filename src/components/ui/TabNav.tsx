import { Link, type LinkProps } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { cn } from '../../lib/cn'
import { spring } from '../motion/presets'

export interface TabItem {
  to: LinkProps['to']
  label: string
  /** Only active on the exact path (for index tabs). */
  exact?: boolean
}

interface TabNavProps {
  items: TabItem[]
  label: string
  /** Unique per nav, so the sliding pill animates within its own group. */
  layoutId: string
  className?: string
}

/** Pill-style tab links with a highlight that slides to the active tab. */
export function TabNav({ items, label, layoutId, className }: TabNavProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-slate-200 p-1 dark:bg-slate-800',
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          activeOptions={{ exact: item.exact, includeSearch: false }}
          className="relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 data-[status=active]:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 dark:data-[status=active]:text-slate-50"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-white shadow dark:bg-slate-600"
                />
              )}
              <span className="relative">{item.label}</span>
            </>
          )}
        </Link>
      ))}
    </nav>
  )
}
