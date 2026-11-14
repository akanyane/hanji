import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: ReactNode
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && (
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      )}
    </div>
  )
}
