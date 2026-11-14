import { describe, expect, it } from 'vitest'
import { LOCALES } from '../../i18n/locales'
import { isSyllable } from '../../lib/hangul'
import { pronounce } from '../../lib/pronunciation/pronounce'
import {
  MINIMAL_PAIRS,
  PRACTICE_SENTENCES,
  RULE_EXAMPLES,
  RULE_ORDER,
} from '../pronunciation/practice'
import { PRONUNCIATION_RULES } from '../pronunciation/rules'
import { DIALOGUES } from './dialogues'

describe('dialogues', () => {
  it('have unique ids, valid speakers and translations in every language', () => {
    expect(new Set(DIALOGUES.map((d) => d.id)).size).toBe(DIALOGUES.length)
    for (const d of DIALOGUES) {
      expect(d.lines.length, d.id).toBeGreaterThanOrEqual(4)
      for (const line of d.lines) {
        expect(d.speakers[line.speaker], d.id).toBeDefined()
        for (const locale of LOCALES)
          expect(line.translation[locale].trim(), d.id).not.toBe('')
      }
    }
  })

  it('have answerable comprehension questions', () => {
    for (const d of DIALOGUES) {
      expect(d.questions.length, d.id).toBeGreaterThanOrEqual(2)
      for (const q of d.questions) {
        expect(q.answer).toBeLessThan(q.choices.length)
        for (const locale of LOCALES) {
          const texts = q.choices.map((c) => c[locale])
          expect(new Set(texts).size, `${d.id} ${locale}`).toBe(texts.length)
        }
      }
    }
  })
})

describe('pronunciation practice content', () => {
  it('lists every rule exactly once', () => {
    expect([...RULE_ORDER].sort()).toEqual(
      Object.keys(PRONUNCIATION_RULES).sort(),
    )
  })

  it('uses examples that the engine really applies the rule to', () => {
    for (const [rule, words] of Object.entries(RULE_EXAMPLES)) {
      expect(words.length, rule).toBeGreaterThanOrEqual(3)
      for (const word of words) {
        expect(
          pronounce(word).steps.map((s) => s.rule),
          `${word} should use ${rule}`,
        ).toContain(rule)
      }
    }
  })

  it('has minimal-pair groups of real, distinct Hangul words', () => {
    for (const group of MINIMAL_PAIRS) {
      const words = group.words.map((w) => w.word)
      expect(new Set(words).size, group.id).toBe(words.length)
      expect(words.length, group.id).toBeGreaterThanOrEqual(2)
      for (const w of words) expect([...w].every(isSyllable), w).toBe(true)
    }
  })

  it('has enough practice sentences', () => {
    expect(PRACTICE_SENTENCES.length).toBeGreaterThan(50)
  })
})
