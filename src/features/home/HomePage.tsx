import { Link } from '@tanstack/react-router'
import { PageHeader } from '../../components/ui/PageHeader'
import { PLATFORM_MODULES, type PlatformModule } from './modules'

const cardBase = 'flex h-full flex-col gap-1 rounded-lg border p-4 transition'

function ModuleCard({ module }: { module: PlatformModule }) {
  const content = (
    <>
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{module.title}</span>
        <span lang="ko" className="text-sm text-slate-500 dark:text-slate-400">
          {module.korean}
        </span>
      </span>
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {module.description}
      </span>
      {!module.to && (
        <span className="mt-auto pt-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Em breve
        </span>
      )}
    </>
  )

  if (!module.to) {
    return (
      <div
        className={`${cardBase} border-dashed border-slate-300 bg-slate-100/60 dark:border-slate-700 dark:bg-slate-800/40`}
      >
        {content}
      </div>
    )
  }

  return (
    <Link
      to={module.to}
      className={`${cardBase} border-slate-300 bg-white shadow-sm hover:border-sky-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-400`}
    >
      {content}
    </Link>
  )
}

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Aprenda coreano do zero"
        description="Uma plataforma gratuita, em português, do Hangul ao TOPIK II. Funciona no navegador e guarda seu progresso só no seu aparelho."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM_MODULES.map((module) => (
          <li key={module.id}>
            <ModuleCard module={module} />
          </li>
        ))}
      </ul>
    </div>
  )
}
