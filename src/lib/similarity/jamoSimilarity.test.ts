import { describe, expect, it } from 'vitest'
import { compareJamo } from './jamoSimilarity'

const statuses = (expected: string, actual: string) =>
  compareJamo(expected, actual).syllables.map((s) => s.status)

describe('compareJamo', () => {
  it('scores identical text as 1', () => {
    expect(compareJamo('안녕하세요', '안녕하세요')).toMatchObject({
      score: 1,
      distance: 0,
    })
  })

  it('ignores spaces and punctuation', () => {
    expect(compareJamo('안녕하세요.', '안녕 하세요').score).toBe(1)
  })

  it('counts differences per jamo, not per syllable', () => {
    // 갔 → 갓: only the final ㅆ/ㅅ differs (1 of 9 jamo).
    const result = compareJamo('갔어요', '갓어요')
    expect(result.distance).toBe(1)
    expect(result.score).toBeCloseTo(1 - 1 / 7)
    expect(statuses('갔어요', '갓어요')).toEqual([
      'partial',
      'correct',
      'correct',
    ])
  })

  it('splits compound vowels, so 와 vs 오 is a partial match', () => {
    expect(compareJamo('와', '오').distance).toBe(1)
    expect(statuses('와', '오')).toEqual(['partial'])
  })

  it('marks missing syllables as wrong', () => {
    expect(statuses('감사합니다', '감사니다')).toEqual([
      'correct',
      'correct',
      'wrong',
      'correct',
      'correct',
    ])
  })

  it('marks spaces and punctuation in the expected text as ignored', () => {
    expect(statuses('네, 좋아요', '네 좋아요')).toEqual([
      'correct',
      'ignored',
      'ignored',
      'correct',
      'correct',
      'correct',
    ])
  })

  it('scores completely different text near 0', () => {
    expect(compareJamo('사과', '포도').score).toBeLessThan(0.5)
    expect(compareJamo('사과', '').score).toBe(0)
  })

  it('treats two empty strings as identical', () => {
    expect(compareJamo('', '').score).toBe(1)
  })
})
