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
        // overflow-y must stay hidden: with only overflow-x set, the underline
        // would trigger a vertical scrollbar. The scrollbar itself is hidden;
        // the tabs still scroll sideways on small screens.
        'flex max-w-full gap-5 self-start overflow-x-auto overflow-y-hidden border-b border-ink-200 [scrollbar-width:none] dark:border-ink-800 [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          activeOptions={{ exact: item.exact, includeSearch: false }}
          className="relative shrink-0 pt-1 pb-2.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 data-[status=active]:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50 dark:data-[status=active]:text-ink-50"
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive && (
                // Brush underline that glides to the active tab.
                <motion.span
                  layoutId={layoutId}
                  transition={spring}
                  className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-seal-500"
                />
              )}
            </>
          )}
        </Link>
      ))}
    </nav>
  )
}
