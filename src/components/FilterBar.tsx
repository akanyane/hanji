import type { HangulCategory } from '../types/hangul'
import { CATEGORY_LABELS } from '../types/hangul'

interface FilterBarProps {
  category: HangulCategory | 'all'
  query: string
  onCategoryChange: (category: HangulCategory | 'all') => void
  onQueryChange: (query: string) => void
}

const CATEGORIES: (HangulCategory | 'all')[] = [
  'all',
  'vowel',
  'consonant',
  'final',
  'syllable',
]

export function FilterBar({
  category,
  query,
  onCategoryChange,
  onQueryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by hangul or romanization..."
        aria-label="Search"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:max-w-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
      />
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c)}
            aria-pressed={category === c}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              category === c
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
    </div>
  )
}
