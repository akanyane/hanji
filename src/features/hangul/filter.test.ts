import { describe, expect, it } from 'vitest'
import type { HangulEntry } from '../../content/hangul'
import { filterEntries, parseCategory } from './filter'

const entries: HangulEntry[] = [
  { id: 'vowel-a', hangul: 'ㅏ', romanization: 'a', category: 'vowel' },
  { id: 'cons-g', hangul: 'ㄱ', romanization: 'g/k', category: 'consonant' },
  { id: 'syll-ga', hangul: '가', romanization: 'ga', category: 'syllable' },
]

describe('filterEntries', () => {
  it('returns all entries when query is empty and category is "all"', () => {
    expect(filterEntries(entries, { category: 'all', query: '' })).toHaveLength(
      3,
    )
  })

  it('filters by category', () => {
    const result = filterEntries(entries, { category: 'vowel', query: '' })
    expect(result).toEqual([entries[0]])
  })

  it('matches romanization case-insensitively', () => {
    const result = filterEntries(entries, { category: 'all', query: 'GA' })
    expect(result).toEqual([entries[2]])
  })

  it('matches the hangul character itself', () => {
    const result = filterEntries(entries, { category: 'all', query: '가' })
    expect(result).toEqual([entries[2]])
  })

  it('combines category and query filters', () => {
    const result = filterEntries(entries, { category: 'consonant', query: 'g' })
    expect(result).toEqual([entries[1]])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterEntries(entries, { category: 'all', query: 'zzz' })).toEqual(
      [],
    )
  })
})

describe('parseCategory', () => {
  it('accepts known categories and rejects anything else', () => {
    expect(parseCategory('vowel')).toBe('vowel')
    expect(parseCategory('all')).toBeUndefined()
    expect(parseCategory('banana')).toBeUndefined()
    expect(parseCategory(42)).toBeUndefined()
  })
})
