import { useMemo } from 'react'
import { hangulData } from '../../content/hangul'
import { Card } from './Card'
import { FilterBar } from './FilterBar'
import { type CategoryFilter, filterEntries } from './filter'

interface BrowseViewProps {
  category: CategoryFilter
  query: string
  onCategoryChange: (category: CategoryFilter) => void
  onQueryChange: (query: string) => void
}

export function BrowseView({
  category,
  query,
  onCategoryChange,
  onQueryChange,
}: BrowseViewProps) {
  const filtered = useMemo(
    () => filterEntries(hangulData, { category, query }),
    [category, query],
  )

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        category={category}
        query={query}
        onCategoryChange={onCategoryChange}
        onQueryChange={onQueryChange}
      />
      <p className="sr-only" aria-live="polite">
        {filtered.length} resultado(s)
      </p>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-slate-500 dark:text-slate-400">
          Nenhum caractere corresponde à sua busca.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((entry) => (
            <li key={entry.id}>
              <Card entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
