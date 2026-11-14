import { Link, type LinkProps, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { spring } from '../motion/presets'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

type NavKey =
  | 'home'
  | 'hangul'
  | 'pronunciation'
  | 'vocabulary'
  | 'grammar'
  | 'numbers'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'dialogues'
  | 'culture'
  | 'tools'
  | 'progress'

interface NavItem {
  key: NavKey
  to: LinkProps['to']
  icon: string
}

const LEARN: NavItem[] = [
  { key: 'hangul', to: '/hangul', icon: '한' },
  { key: 'pronunciation', to: '/pronunciation', icon: '🗣️' },
  { key: 'vocabulary', to: '/vocabulary', icon: '📚' },
  { key: 'grammar', to: '/grammar', icon: '🧩' },
  { key: 'numbers', to: '/numbers', icon: '🔢' },
]
const PRACTICE: NavItem[] = [
  { key: 'reading', to: '/reading', icon: '📖' },
  { key: 'listening', to: '/listening', icon: '🎧' },
  { key: 'speaking', to: '/speaking', icon: '🎤' },
  { key: 'writing', to: '/writing', icon: '✍️' },
  { key: 'dialogues', to: '/dialogues', icon: '💬' },
]
const SINGLE: NavItem[] = [
  { key: 'culture', to: '/culture', icon: '🏮' },
  { key: 'tools', to: '/tools', icon: '🛠️' },
  { key: 'progress', to: '/progress', icon: '📈' },
]

const pillClass =
  'relative shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50'

function Pill() {
  return (
    <motion.span
      layoutId="main-nav-pill"
      transition={spring}
      className="absolute inset-0 rounded-full bg-white shadow dark:bg-slate-700"
    />
  )
}

function NavLink({ item, exact }: { item: NavItem; exact?: boolean }) {
  const { t } = useTranslation()
  return (
    <Link
      to={item.to}
      activeOptions={{ exact, includeSearch: false }}
      className={cn(
        pillClass,
        'data-[status=active]:text-slate-900 dark:data-[status=active]:text-slate-50',
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && <Pill />}
          <span className="relative">{t(`nav.${item.key}`)}</span>
        </>
      )}
    </Link>
  )
}

/** Dropdown menu of links; closes on Escape, outside click or navigation. */
function NavMenu({
  label,
  items,
  className,
}: {
  label: string
  items: NavItem[]
  className?: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const pathname = useLocation({ select: (l) => l.pathname })
  const active = items.some(
    (item) => item.to !== '/' && pathname.startsWith(String(item.to)),
  )

  // Navigating closes the menu.
  // biome-ignore lint/correctness/useExhaustiveDependencies: react to path changes only
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={cn(pillClass, active && 'text-slate-900 dark:text-slate-50')}
      >
        {active && <Pill />}
        <span className="relative">
          {label}{' '}
          <motion.span
            aria-hidden="true"
            className="inline-block"
            animate={{ rotate: open ? 180 : 0 }}
          >
            ▾
          </motion.span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-40 mt-2 flex min-w-52 origin-top-left flex-col gap-0.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"
          >
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-100 data-[status=active]:bg-sky-50 data-[status=active]:text-sky-800 dark:hover:bg-slate-700 dark:data-[status=active]:bg-sky-950 dark:data-[status=active]:text-sky-200"
                >
                  <span
                    aria-hidden="true"
                    lang="ko"
                    className="w-6 text-center"
                  >
                    {item.icon}
                  </span>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AppHeader() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-8">
        <Link
          to="/"
          className="shrink-0 text-lg font-bold sm:text-xl"
          aria-label={t('nav.homeLabel')}
        >
          <motion.span
            lang="ko"
            className="inline-block bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.08, rotate: -3 }}
            transition={spring}
          >
            한국어
          </motion.span>
        </Link>
        <nav
          aria-label={t('nav.main')}
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {/* Desktop: grouped menus. Mobile: everything in one menu. */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLink item={{ key: 'home', to: '/', icon: '' }} exact />
            <NavMenu label={t('nav.learn')} items={LEARN} />
            <NavMenu label={t('nav.practice')} items={PRACTICE} />
            {SINGLE.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </div>
          <NavMenu
            label="☰ Menu"
            items={[
              { key: 'home', to: '/', icon: '🏠' },
              ...LEARN,
              ...PRACTICE,
              ...SINGLE,
            ]}
            className="md:hidden"
          />
        </nav>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
