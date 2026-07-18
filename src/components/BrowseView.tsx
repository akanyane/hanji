import { useMemo, useState } from 'react'
import { hangulData } from '../data'
import type { HangulCategory } from '../types/hangul'
import { filterEntries } from '../utils/filter'
import { Card } from './Card/Card'
import { FilterBar } from './FilterBar'

export function BrowseView() {
  const [category, setCategory] = useState<HangulCategory | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => filterEntries(hangulData, { category, query }),
    [category, query],
  )

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        category={category}
        query={query}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
      />
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-slate-500 dark:text-slate-400">
          No characters match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((entry) => (
            <Card key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
