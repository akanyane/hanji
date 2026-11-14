import { describe, expect, it } from 'vitest'
import { LOCALES } from '../../i18n/locales'
import { isSyllable } from '../../lib/hangul'
import { getWord, THEMES, type ThemeId, VOCABULARY } from './index'

const CJK = /\p{Script=Han}/u

describe('vocabulary bank', () => {
  it('has at least 200 words with unique ids', () => {
    expect(VOCABULARY.length).toBeGreaterThanOrEqual(200)
    const ids = VOCABULARY.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(getWord('water')?.word).toBe('물')
  })

  it('writes every word in Hangul', () => {
    for (const w of VOCABULARY) {
      for (const char of w.word.replace(/ /g, ''))
        expect(isSyllable(char), w.id).toBe(true)
    }
  })

  it('uses the dictionary form (…다) for verbs and adjectives', () => {
    for (const w of VOCABULARY.filter(
      (w) => w.pos === 'verb' || w.pos === 'adjective',
    )) {
      expect(w.word.endsWith('다'), w.id).toBe(true)
    }
  })

  it('uses the word itself in examples of words that do not conjugate', () => {
    for (const w of VOCABULARY.filter(
      (w) => w.pos !== 'verb' && w.pos !== 'adjective',
    )) {
      expect(w.example.ko, w.id).toContain(w.word)
    }
  })

  it('writes examples as full sentences', () => {
    for (const w of VOCABULARY) {
      expect(w.example.ko, w.id).toMatch(/[.!?]$/)
      for (const locale of LOCALES)
        expect(w.example.translation[locale], `${w.id} ${locale}`).toMatch(
          /[.!?)]$/,
        )
    }
  })

  it('has every meaning and translation in every language', () => {
    for (const w of VOCABULARY) {
      for (const locale of LOCALES) {
        expect(w.meaning[locale].trim(), `${w.id} ${locale}`).not.toBe('')
        expect(
          w.example.translation[locale].trim(),
          `${w.id} ${locale}`,
        ).not.toBe('')
      }
    }
  })

  it('aligns Hanja with the word character by character', () => {
    for (const w of VOCABULARY.filter((w) => w.hanja)) {
      const hanja = [...(w.hanja ?? '')]
      const hangul = [...w.word]
      expect(hanja, w.id).toHaveLength(hangul.length)
      expect(
        hanja.some((c) => CJK.test(c)),
        w.id,
      ).toBe(true)
      hanja.forEach((c, i) => {
        if (!CJK.test(c)) expect(c, `${w.id} position ${i}`).toBe(hangul[i])
      })
    }
  })

  it('has a decent number of words in every theme', () => {
    for (const theme of Object.keys(THEMES) as ThemeId[]) {
      expect(
        VOCABULARY.filter((w) => w.themes.includes(theme)).length,
        theme,
      ).toBeGreaterThanOrEqual(5)
    }
  })
})
