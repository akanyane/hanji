import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { spring } from '../../components/motion/presets'
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
  const { t } = useTranslation()
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
        {t('hangul.results', { count: filtered.length })}
      </p>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-ink-500 dark:text-ink-400">
          {t('hangul.noResults')}
        </p>
      ) : (
        // `layout` makes the remaining cards glide into place when filters change.
        <motion.ul
          layout
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((entry, i) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { ...spring, delay: Math.min(i * 0.015, 0.3) },
                }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card entry={entry} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}
