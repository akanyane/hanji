import { Link, type LinkProps, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { Seal } from '../brand/Seal'
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
  { key: 'hangul', to: '/hangul', icon: '한글' },
  { key: 'pronunciation', to: '/pronunciation', icon: '발음' },
  { key: 'vocabulary', to: '/vocabulary', icon: '어휘' },
  { key: 'grammar', to: '/grammar', icon: '문법' },
  { key: 'numbers', to: '/numbers', icon: '숫자' },
]
const PRACTICE: NavItem[] = [
  { key: 'reading', to: '/reading', icon: '읽기' },
  { key: 'listening', to: '/listening', icon: '듣기' },
  { key: 'speaking', to: '/speaking', icon: '말하기' },
  { key: 'writing', to: '/writing', icon: '쓰기' },
  { key: 'dialogues', to: '/dialogues', icon: '대화' },
]
const SINGLE: NavItem[] = [
  { key: 'culture', to: '/culture', icon: '문화' },
  { key: 'tools', to: '/tools', icon: '도구' },
  { key: 'progress', to: '/progress', icon: '진도' },
]

const pillClass =
  'relative shrink-0 px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50'

/** Vermilion brush underline that glides to the active section. */
function Pill() {
  return (
    <motion.span
      layoutId="main-nav-pill"
      transition={spring}
      className="absolute inset-x-2 -bottom-0.5 h-[3px] rounded-full bg-seal-500"
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
        'data-[status=active]:text-ink-900 dark:data-[status=active]:text-ink-50',
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
        className={cn(pillClass, active && 'text-ink-900 dark:text-ink-50')}
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
            // Unrolls like a scroll.
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="hanji absolute top-full left-0 z-40 mt-3 flex min-w-56 flex-col gap-0.5 rounded-lg border border-ink-300 bg-ink-50 p-2 shadow-lift dark:border-ink-700 dark:bg-ink-900"
          >
            {items.map((item, i) => (
              <motion.li
                key={item.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.25 }}
              >
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-ink-900/5 data-[status=active]:text-seal-700 dark:hover:bg-ink-50/10 dark:data-[status=active]:text-seal-300"
                >
                  <span
                    aria-hidden="true"
                    lang="ko"
                    className="w-12 font-serif text-xs text-ink-400 transition-colors group-hover:text-seal-600 group-data-[status=active]:text-seal-600 dark:text-ink-500"
                  >
                    {item.icon}
                  </span>
                  {t(`nav.${item.key}`)}
                </Link>
              </motion.li>
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
    <header className="sticky top-0 z-30 border-b-[3px] border-double border-ink-900/25 bg-ink-50/85 backdrop-blur-md dark:border-ink-50/15 dark:bg-ink-950/85">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-8">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2"
          aria-label={t('nav.homeLabel')}
        >
          <motion.span
            className="inline-flex"
            whileHover={{ rotate: -10, scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={spring}
          >
            <Seal text="한" size="sm" />
          </motion.span>
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="font-serif text-lg font-bold tracking-tight">
              Hanji
            </span>
            <span
              lang="ko"
              aria-hidden="true"
              className="font-serif text-xs text-seal-600 dark:text-seal-400"
            >
              한지
            </span>
          </span>
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
              { key: 'home', to: '/', icon: '홈' },
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
