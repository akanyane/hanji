import type { HangulCategory, HangulEntry } from '../types/hangul'

export interface FilterOptions {
  category: HangulCategory | 'all'
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
