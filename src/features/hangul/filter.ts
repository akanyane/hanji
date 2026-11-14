import type { HangulCategory, HangulEntry } from '../../content/hangul'

export type CategoryFilter = HangulCategory | 'all'

export const CATEGORY_FILTERS: CategoryFilter[] = [
  'all',
  'vowel',
  'consonant',
  'final',
  'syllable',
]

export interface FilterOptions {
  category: CategoryFilter
  query: string
}

export function filterEntries(
  entries: HangulEntry[],
  { category, query }: FilterOptions,
): HangulEntry[] {
  const normalizedQuery = query.trim().toLowerCase()

  return entries.filter((entry) => {
    const matchesCategory = category === 'all' || entry.category === category
    if (!matchesCategory) return false

    if (normalizedQuery === '') return true

    return (
      entry.hangul.toLowerCase().includes(normalizedQuery) ||
      entry.romanization.toLowerCase().includes(normalizedQuery)
    )
  })
}

/** Validates the `category` URL param, discarding unknown values. */
export function parseCategory(value: unknown): HangulCategory | undefined {
  return CATEGORY_FILTERS.includes(value as CategoryFilter) && value !== 'all'
    ? (value as HangulCategory)
    : undefined
}
