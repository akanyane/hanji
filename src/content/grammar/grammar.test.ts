import { describe, expect, it } from 'vitest'
import { LOCALES } from '../../i18n/locales'
import { conjugate } from '../../lib/conjugation/conjugate'
import { hasFinalConsonant } from '../../lib/hangul'
import { particleFor } from '../../lib/particles/particles'
import { type ExerciseCheck, GRAMMAR_LESSONS, getLesson } from './index'
import { LEXICAL_VOICE } from './lessons/intermediate'

/** What the engines say the right answer is. */
function expectedAnswer(check: ExerciseCheck): string | undefined {
  switch (check.kind) {
    case 'particle':
      return particleFor(check.noun, check.type) ?? undefined
    case 'form':
      return conjugate(check.verb)?.forms[check.form]
    case 'copula':
      return hasFinalConsonant(check.noun) ? '이에요' : '예요'
  }
}

describe('grammar curriculum', () => {
  it('has at least 20 lessons with unique ids', () => {
    expect(GRAMMAR_LESSONS.length).toBeGreaterThanOrEqual(20)
    const ids = GRAMMAR_LESSONS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has every text in every language', () => {
    for (const lesson of GRAMMAR_LESSONS) {
      const texts = [
        lesson.title,
        lesson.summary,
        ...lesson.explanation,
        ...lesson.mistakes,
        ...lesson.formation.map((f) => f.when),
        ...lesson.examples.map((e) => e.translation),
        ...lesson.exercises.map((e) => e.translation),
      ]
      for (const text of texts) {
        for (const locale of LOCALES)
          expect(text[locale].trim(), `${lesson.id} ${locale}`).not.toBe('')
      }
    }
  })

  it('gives every lesson examples, mistakes and at least 3 exercises', () => {
    for (const lesson of GRAMMAR_LESSONS) {
      expect(lesson.examples.length, lesson.id).toBeGreaterThanOrEqual(3)
      expect(lesson.mistakes.length, lesson.id).toBeGreaterThanOrEqual(1)
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(3)
    }
  })

  it('has valid exercises: a gap, distinct choices and an answer in range', () => {
    for (const lesson of GRAMMAR_LESSONS) {
      for (const ex of lesson.exercises) {
        expect(ex.prompt, lesson.id).toContain('___')
        expect(new Set(ex.choices).size, `${lesson.id}: ${ex.prompt}`).toBe(
          ex.choices.length,
        )
        expect(ex.answer).toBeGreaterThanOrEqual(0)
        expect(ex.answer).toBeLessThan(ex.choices.length)
      }
    }
  })

  it('has answer keys that agree with the conjugation and particle engines', () => {
    let checked = 0
    for (const lesson of GRAMMAR_LESSONS) {
      for (const ex of lesson.exercises) {
        if (!ex.check) continue
        checked++
        expect(ex.choices[ex.answer], `${lesson.id}: ${ex.prompt}`).toBe(
          expectedAnswer(ex.check),
        )
      }
    }
    // Most exercises are machine-checked; keep it that way as the curriculum grows.
    expect(checked).toBeGreaterThanOrEqual(45)
  })

  it('only lists verbs the engine can conjugate in conjugation tables', () => {
    for (const lesson of GRAMMAR_LESSONS) {
      for (const verb of lesson.conjugationTable?.verbs ?? []) {
        const result = conjugate(verb)
        expect(result, `${lesson.id}: ${verb}`).not.toBeNull()
        for (const form of lesson.conjugationTable?.forms ?? []) {
          // Adjectives may lack verb-only forms, but every listed verb must have them.
          if (result?.info.kind === 'verb')
            expect(
              result.forms[form],
              `${lesson.id}: ${verb} ${form}`,
            ).toBeTruthy()
        }
      }
    }
  })

  it('ties passive and causative exercises to the lexical voice table', () => {
    const voices = new Set(
      Object.values(LEXICAL_VOICE).flatMap((v) =>
        [v.passive, v.causative].filter(Boolean),
      ),
    )
    for (const id of ['passive-voice', 'causative-voice']) {
      const lesson = getLesson(id)
      expect(lesson, id).toBeDefined()
      for (const ex of lesson?.exercises ?? []) {
        expect(ex.check?.kind, ex.prompt).toBe('form')
        if (ex.check?.kind !== 'form') continue
        expect(voices.has(ex.check.verb), ex.check.verb).toBe(true)
        // The base verb named in the hint maps to the checked verb.
        const base = /\(([가-힣]+다) →/.exec(ex.prompt)?.[1] ?? ''
        const entry = LEXICAL_VOICE[base]
        const kind = id === 'passive-voice' ? 'passive' : 'causative'
        expect(entry?.[kind], `${base} ${kind}`).toBe(ex.check.verb)
      }
    }
  })
})
