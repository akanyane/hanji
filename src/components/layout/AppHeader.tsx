import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'

const linkClass =
  'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
const activeClass =
  'bg-white text-slate-900 shadow hover:bg-white dark:bg-slate-700 dark:text-slate-50 dark:hover:bg-slate-700'

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-8">
        <Link
          to="/"
          className="shrink-0 text-lg font-bold sm:text-xl"
          aria-label="Aprenda Coreano: página inicial"
        >
          <span lang="ko">한국어</span>
          <span className="ml-2 hidden font-semibold text-slate-500 sm:inline dark:text-slate-400">
            Aprenda Coreano
          </span>
        </Link>
        {/* On small screens the nav scrolls horizontally instead of wrapping. */}
        <nav
          aria-label="Navegação principal"
          className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1"
        >
          <Link
            to="/"
            className={linkClass}
            activeProps={{ className: activeClass }}
            activeOptions={{ exact: true }}
          >
            Início
          </Link>
          <Link
            to="/hangul"
            className={linkClass}
            activeProps={{ className: activeClass }}
          >
            Hangul
          </Link>
          <Link
            to="/tools"
            className={linkClass}
            activeProps={{ className: activeClass }}
          >
            Ferramentas
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
