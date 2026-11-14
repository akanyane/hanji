import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  Link,
  Outlet,
} from '@tanstack/react-router'
import { lazy, Suspense, useEffect } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
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

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

function RootLayout() {
  const theme = useSettings((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-sky-700 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-5xl px-4 py-6 outline-none sm:px-8"
      >
        <Outlet />
      </main>
      <Suspense>
        <Devtools />
      </Suspense>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p lang="ko" className="text-5xl font-bold">
        404
      </p>
      <p>Página não encontrada.</p>
      <Link
        to="/"
        className="font-medium text-sky-700 underline dark:text-sky-400"
      >
        Voltar ao início
      </Link>
    </div>
  )
}

function RouteError({ error, reset }: ErrorComponentProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 py-16 text-center"
    >
      <p className="text-xl font-semibold">Algo deu errado.</p>
      <pre className="max-w-full overflow-x-auto text-sm text-slate-500">
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="font-medium text-sky-700 underline dark:text-sky-400"
      >
        Tentar de novo
      </button>
    </div>
  )
}
