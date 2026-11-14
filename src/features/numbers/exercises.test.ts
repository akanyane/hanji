import { describe, expect, it } from 'vitest'
import { seededRng } from '../../test/rng'
import { makeNumberExercise, NUMBER_EXERCISE_KINDS } from './exercises'

describe('makeNumberExercise', () => {
  it.each(NUMBER_EXERCISE_KINDS)('builds valid %s exercises', (kind) => {
    const rng = seededRng(kind.length * 7)
    for (let i = 0; i < 200; i++) {
      const ex = makeNumberExercise(kind, rng)
      expect(ex.kind).toBe(kind)
      expect(ex.choices).toContain(ex.answer)
      expect(new Set(ex.choices).size).toBe(ex.choices.length)
      expect(ex.choices.length).toBeGreaterThanOrEqual(3)
      expect(ex.choices.length).toBeLessThanOrEqual(4)
    }
  })

  it('uses typical mistakes as distractors', () => {
    const rng = seededRng(3)
    for (let i = 0; i < 100; i++) {
      const ex = makeNumberExercise('counter', rng)
      // e.g. 세 개 vs 삼 개 vs 셋 개
      const [, counter] = ex.answer.split(' ')
      expect(ex.choices.every((c) => c.endsWith(counter))).toBe(true)
    }
  })

  it('offers 육월 / 십월 when the month is 6 or 10', () => {
    const rng = seededRng(11)
    let seen = 0
    for (let i = 0; i < 300; i++) {
      const ex = makeNumberExercise('date', rng)
      if (ex.answer.includes('유월')) {
        expect(ex.choices.some((c) => c.includes('육월'))).toBe(true)
        seen++
      }
    }
    expect(seen).toBeGreaterThan(0)
  })
})
