import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { PageHeader } from '../../components/ui/PageHeader'
import { TOOLS } from '../../features/tools/tools'

export const Route = createFileRoute('/tools')({
  component: ToolsLayout,
})

const tabClass =
  'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition dark:text-slate-300'
const activeTabClass =
  'bg-white text-slate-900 shadow dark:bg-slate-600 dark:text-slate-50'

function ToolsLayout() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ferramentas"
        description="Utilitários para consultar a qualquer momento. Tudo roda no seu navegador."
      />
      <nav
        aria-label="Ferramentas"
        className="flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-slate-200 p-1 dark:bg-slate-800"
      >
        {TOOLS.map((tool) => (
          <Link
            key={tool.title}
            to={tool.to}
            activeOptions={{ includeSearch: false }}
            className={tabClass}
            activeProps={{ className: activeTabClass }}
          >
            {tool.title}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
