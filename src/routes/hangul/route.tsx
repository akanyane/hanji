import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { PageHeader } from '../../components/ui/PageHeader'

export const Route = createFileRoute('/hangul')({
  component: HangulLayout,
})

const tabClass =
  'rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition dark:text-slate-300'
const activeTabClass =
  'bg-white text-slate-900 shadow dark:bg-slate-600 dark:text-slate-50'

function HangulLayout() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Hangul"
          description="O alfabeto coreano: toque num cartão para ver a romanização."
        />
        <nav
          aria-label="Seções do Hangul"
          className="flex self-start rounded-full bg-slate-200 p-1 dark:bg-slate-800"
        >
          <Link
            to="/hangul"
            activeOptions={{ exact: true, includeSearch: false }}
            className={tabClass}
            activeProps={{ className: activeTabClass }}
          >
            Explorar
          </Link>
          <Link
            to="/hangul/quiz"
            activeOptions={{ includeSearch: false }}
            className={tabClass}
            activeProps={{ className: activeTabClass }}
          >
            Quiz
          </Link>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
