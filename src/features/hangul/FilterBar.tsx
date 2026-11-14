import { Chip } from '../../components/ui/Chip'
import { CATEGORY_LABELS } from '../../content/hangul'
import { CATEGORY_FILTERS, type CategoryFilter } from './filter'

interface CategoryChipsProps {
  category: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
}

export function CategoryChips({
  category,
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">Categoria</legend>
      {CATEGORY_FILTERS.map((c) => (
        <Chip
          key={c}
          selected={category === c}
          onClick={() => onCategoryChange(c)}
        >
          {c === 'all' ? 'Todas' : CATEGORY_LABELS[c]}
        </Chip>
      ))}
    </fieldset>
  )
}

interface FilterBarProps extends CategoryChipsProps {
  query: string
  onQueryChange: (query: string) => void
}

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
        placeholder="Buscar por hangul ou romanização..."
        aria-label="Buscar"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 sm:max-w-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-400"
      />
      <CategoryChips category={category} onCategoryChange={onCategoryChange} />
    </div>
  )
}
