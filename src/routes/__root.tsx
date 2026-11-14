import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { MotionConfig, motion } from 'motion/react'
import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '../components/layout/AppHeader'
import { Toaster } from '../components/layout/Toaster'
import { PageTransition } from '../components/motion/PageTransition'
import { AchievementWatcher } from '../features/progress/AchievementWatcher'
import { useStudyTimer } from '../hooks/useStudyTimer'
import { useSettings } from '../stores/settings'

export interface RouterContext {
  queryClient: QueryClient
}

// Devtools only in development (and not in tests); lazy-loaded so they never
// end up in the production bundle.
const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== 'test'
const Devtools = showDevtools
  ? lazy(() => import('../components/layout/Devtools'))
  : () => null

// Tests drive time themselves; a background timer would only add noise.
const countStudyTime = import.meta.env.MODE !== 'test'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

function RootLayout() {
  const { t } = useTranslation()
  const theme = useSettings((s) => s.theme)
  // Animate between top-level sections only; nested layouts animate their own content.
  const section = useLocation({ select: (l) => l.pathname.split('/')[1] ?? '' })
  useStudyTimer(countStudyTime)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    // reducedMotion="user": transform/layout animations are disabled when the
    // OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-sky-700 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          {t('nav.skipToContent')}
        </a>
        <AppHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-5xl px-4 py-6 outline-none sm:px-8"
        >
          <PageTransition transitionKey={section}>
            <Outlet />
          </PageTransition>
        </main>
        <Toaster />
        <AchievementWatcher />
        <Suspense>
          <Devtools />
        </Suspense>
      </div>
    </MotionConfig>
  )
}

function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <motion.p
        lang="ko"
        className="text-6xl font-bold"
        initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      >
        404
      </motion.p>
      <p>{t('errors.notFound')}</p>
      <Link
        to="/"
        className="font-medium text-sky-700 underline dark:text-sky-400"
      >
        {t('errors.backHome')}
      </Link>
    </div>
  )
}

function RouteError({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation()
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 py-16 text-center"
    >
      <p className="text-xl font-semibold">{t('errors.generic')}</p>
      <pre className="max-w-full overflow-x-auto text-sm text-slate-500">
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="font-medium text-sky-700 underline dark:text-sky-400"
      >
        {t('errors.tryAgain')}
      </button>
    </div>
  )
}
