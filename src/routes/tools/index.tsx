import { createFileRoute, Link } from '@tanstack/react-router'
import { TOOLS } from '../../features/tools/tools'

export const Route = createFileRoute('/tools/')({
  component: ToolsIndex,
})

function ToolsIndex() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) => (
        <li key={tool.title}>
          <Link
            to={tool.to}
            className="flex h-full flex-col gap-1 rounded-lg border border-slate-300 bg-white p-4 shadow-sm transition hover:border-sky-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-400"
          >
            <span className="font-semibold">{tool.title}</span>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {tool.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
