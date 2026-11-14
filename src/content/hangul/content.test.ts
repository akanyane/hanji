import { describe, expect, it } from 'vitest'
import { LOCALES } from '../../i18n/locales'
import { decompose, isSyllable, splitCompound, toJamo } from '../../lib/hangul'
import { romanize } from '../../lib/romanization/romanize'
import { consonants, vowels } from './index'
import { JAMO_DETAILS } from './jamoDetails'
import { READING_WORDS } from './readingWords'
import { STROKES, strokeStart } from './strokes'

const jamoEntries = [...consonants, ...vowels]

describe('stroke order content', () => {
  it('has strokes for every consonant and vowel', () => {
    for (const entry of jamoEntries) {
      expect(STROKES[entry.hangul], entry.hangul).toBeDefined()
    }
  })

  it('only uses valid path data inside the 100×100 grid', () => {
    for (const [jamo, strokes] of Object.entries(STROKES)) {
      for (const path of strokes) {
        expect(path, jamo).toMatch(/^M[\d .A-Z-]+$/)
        for (const n of path.match(/-?\d+(\.\d+)?/g) ?? []) {
          expect(Number(n), `${jamo}: ${path}`).toBeGreaterThanOrEqual(0)
          expect(Number(n), `${jamo}: ${path}`).toBeLessThanOrEqual(100)
        }
      }
    }
  })

  it('draws double consonants as two copies of the basic stroke count', () => {
    for (const [double, basic] of [
      ['ㄲ', 'ㄱ'],
      ['ㄸ', 'ㄷ'],
      ['ㅃ', 'ㅂ'],
      ['ㅆ', 'ㅅ'],
      ['ㅉ', 'ㅈ'],
    ]) {
      expect(STROKES[double]).toHaveLength(STROKES[basic].length * 2)
    }
  })

  it('draws compound vowels with the strokes of their parts', () => {
    for (const vowel of ['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']) {
      const parts = splitCompound(vowel)
      const expected = parts.reduce((sum, p) => sum + STROKES[p].length, 0)
      expect(STROKES[vowel], vowel).toHaveLength(expected)
    }
  })

  it('reads the start point of a stroke', () => {
    expect(strokeStart('M22 25 H75')).toEqual([22, 25])
  })
})

describe('jamo details', () => {
  it('has details for every consonant and vowel', () => {
    for (const entry of jamoEntries) {
      expect(JAMO_DETAILS[entry.id], entry.id).toBeDefined()
    }
  })

  it('uses example words that actually contain the letter', () => {
    for (const entry of jamoEntries) {
      const { word } = JAMO_DETAILS[entry.id].example
      expect([...word].every(isSyllable), word).toBe(true)
      expect(toJamo(word), `${entry.hangul} in ${word}`).toContain(entry.hangul)
    }
  })

  it('has non-empty text in every language', () => {
    for (const [id, detail] of Object.entries(JAMO_DETAILS)) {
      for (const locale of LOCALES) {
        expect(detail.origin[locale].trim(), `${id} origin ${locale}`).not.toBe(
          '',
        )
        expect(detail.tip[locale].trim(), `${id} tip ${locale}`).not.toBe('')
        expect(
          detail.example.meaning[locale].trim(),
          `${id} meaning ${locale}`,
        ).not.toBe('')
      }
    }
  })

  it('uses ㅇ examples where ㅇ is the silent initial', () => {
    const { word } = JAMO_DETAILS['cons-ng'].example
    expect(decompose(word[0])?.initial).toBe('ㅇ')
  })
})

describe('reading words', () => {
  it('are unique Hangul words with a meaning', () => {
    const words = READING_WORDS.map((w) => w.word)
    expect(new Set(words).size).toBe(words.length)
    for (const { word, meaning } of READING_WORDS) {
      expect([...word].every(isSyllable), word).toBe(true)
      for (const locale of LOCALES)
        expect(meaning[locale].length, `${word} ${locale}`).toBeGreaterThan(0)
    }
  })

  it('have distinct romanizations, so quiz choices are never ambiguous', () => {
    const romanized = READING_WORDS.map((w) => romanize(w.word))
    expect(new Set(romanized).size).toBe(romanized.length)
  })

  it('romanize as expected for a few spot checks', () => {
    const lookup = (w: string) => romanize(w)
    expect(lookup('학교')).toBe('hakgyo')
    expect(lookup('한국')).toBe('hanguk')
    expect(lookup('꽃')).toBe('kkot')
    expect(lookup('의자')).toBe('uija')
  })
})
