import { describe, expect, it } from 'vitest'
import { getWord, VOCABULARY } from '../../content/vocabulary'
import type { DeckRecord } from '../../db/types'
import { seededRng } from '../../test/rng'
import {
  builtInDecks,
  checkAnswer,
  deckCounts,
  meaningChoices,
  normalizeAnswer,
  resolveDeck,
} from './logic'

const NOW = new Date('2026-03-10T12:00:00')

describe('decks', () => {
  it('builds an "all" deck, one per level and one per theme', () => {
    const decks = builtInDecks()
    expect(decks[0]).toMatchObject({ id: 'all', kind: 'all' })
    expect(decks[0].itemIds).toHaveLength(VOCABULARY.length)
    expect(
      decks.find((d) => d.id === 'level-1')?.itemIds.length,
    ).toBeGreaterThan(100)
    expect(decks.find((d) => d.id === 'theme-food')?.itemIds).toContain('water')
  })

  it('resolves built-in and custom decks', () => {
    const custom: DeckRecord = {
      id: 'abc',
      name: 'Trip',
      itemIds: ['bus'],
      createdAt: 0,
      updatedAt: 0,
      deletedAt: null,
    }
    expect(resolveDeck('theme-food', [])?.kind).toBe('theme')
    expect(resolveDeck('abc', [custom])).toMatchObject({
      kind: 'custom',
      name: 'Trip',
      itemIds: ['bus'],
    })
    expect(resolveDeck('nope', [custom])).toBeUndefined()
  })

  it('counts due and new cards', () => {
    const dueDates = new Map([
      ['a', new Date('2026-03-01')],
      ['b', new Date('2026-04-01')],
    ])
    expect(deckCounts(['a', 'b', 'c', 'd'], dueDates, NOW)).toEqual({
      total: 4,
      due: 1,
      fresh: 2,
    })
  })
})

describe('checkAnswer', () => {
  it('accepts Hangul or Revised Romanization, ignoring spacing and case', () => {
    expect(checkAnswer('물', '물').correct).toBe(true)
    expect(checkAnswer(' Mul ', '물').correct).toBe(true)
    expect(checkAnswer('안녕 하세요!', '안녕하세요').correct).toBe(true)
    expect(checkAnswer('annyeong-haseyo', '안녕하세요').correct).toBe(true)
    // Romanization follows pronunciation: 같이 is "gachi".
    expect(checkAnswer('gachi', '같이').correct).toBe(true)
  })

  it('rejects wrong or empty answers', () => {
    expect(checkAnswer('', '물').correct).toBe(false)
    expect(checkAnswer('불', '물').correct).toBe(false)
  })

  it('returns a jamo comparison for Hangul input only', () => {
    expect(
      checkAnswer('갓어요', '갔어요').similarity?.syllables[0].status,
    ).toBe('partial')
    expect(checkAnswer('mul', '물').similarity).toBeNull()
  })

  it('normalizes punctuation and spaces', () => {
    expect(normalizeAnswer('Ab-c d.!')).toBe('abcd')
  })
})

describe('meaningChoices', () => {
  it('includes the answer and distinct distractors, preferring the same part of speech', () => {
    const target = getWord('eat')
    if (!target) throw new Error('missing word')
    for (let seed = 0; seed < 10; seed++) {
      const choices = meaningChoices(target, 'en', 4, seededRng(seed))
      expect(choices).toHaveLength(4)
      expect(choices).toContain(target)
      expect(new Set(choices.map((c) => c.meaning.en)).size).toBe(4)
      expect(choices.every((c) => c.pos === 'verb')).toBe(true)
    }
  })
})
