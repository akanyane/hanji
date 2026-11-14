import { useTranslation } from 'react-i18next'
import { Chip } from '../../components/ui/Chip'
import { CATEGORY_FILTERS, type CategoryFilter } from './filter'

interface CategoryChipsProps {
  category: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
  /** Categories to offer (defaults to all). */
  options?: CategoryFilter[]
}

export function CategoryChips({
  category,
  onCategoryChange,
  options = CATEGORY_FILTERS,
}: CategoryChipsProps) {
  const { t } = useTranslation()
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{t('hangul.categoryLegend')}</legend>
      {options.map((c) => (
        <Chip
          key={c}
          selected={category === c}
          onClick={() => onCategoryChange(c)}
        >
          {t(`hangul.category.${c}`)}
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
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t('hangul.searchPlaceholder')}
        aria-label={t('hangul.search')}
        className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500 sm:max-w-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-400"
      />
      <CategoryChips category={category} onCategoryChange={onCategoryChange} />
    </div>
  )
}
