import { describe, expect, it } from 'vitest'
import { consonants, finals, hangulData, syllables, vowels } from './index'

describe('hangulData', () => {
  it('has unique ids across all entries', () => {
    const ids = hangulData.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has the expected number of entries per category', () => {
    expect(vowels).toHaveLength(21)
    expect(consonants).toHaveLength(19)
    expect(finals).toHaveLength(7)
    expect(syllables).toHaveLength(14)
    expect(hangulData).toHaveLength(61)
  })

  it('never has an empty hangul field', () => {
    expect(hangulData.every((e) => e.hangul.length > 0)).toBe(true)
  })

  it('only has an empty romanization for the silent ㅇ initial consonant', () => {
    const emptyRomanization = hangulData.filter((e) => e.romanization === '')
    expect(emptyRomanization).toHaveLength(1)
    expect(emptyRomanization[0].id).toBe('cons-ng')
  })

  it('uses the Hangul Compatibility Jamo codepoint for single-jamo entries', () => {
    for (const entry of [...vowels, ...consonants]) {
      const codePoint = entry.hangul.codePointAt(0) ?? 0
      expect(codePoint).toBeGreaterThanOrEqual(0x3131)
      expect(codePoint).toBeLessThanOrEqual(0x318e)
    }
  })
})
