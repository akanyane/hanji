import { Link, type LinkProps } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { spring } from '../motion/presets'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

function NavLink({
  to,
  exact,
  label,
}: {
  to: LinkProps['to']
  exact?: boolean
  label: string
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact, includeSearch: false }}
      className="relative shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 data-[status=active]:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 dark:data-[status=active]:text-slate-50"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="main-nav-pill"
              transition={spring}
              className="absolute inset-0 rounded-full bg-white shadow dark:bg-slate-700"
            />
          )}
          <span className="relative">{label}</span>
        </>
      )}
    </Link>
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
          <span className="ml-2 hidden font-semibold text-slate-500 md:inline dark:text-slate-400">
            {t('common.appName')}
          </span>
        </Link>
        {/* On small screens the nav scrolls horizontally instead of wrapping. */}
        <nav
          aria-label={t('nav.main')}
          className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1"
        >
          <NavLink to="/" exact label={t('nav.home')} />
          <NavLink to="/hangul" label={t('nav.hangul')} />
          <NavLink to="/vocabulary" label={t('nav.vocabulary')} />
          <NavLink to="/tools" label={t('nav.tools')} />
        </nav>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
