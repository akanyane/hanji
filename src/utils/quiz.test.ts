import { describe, expect, it } from 'vitest'
import type { HangulEntry } from '../types/hangul'
import { generateQuiz, scoreAnswer } from './quiz'

const vowels: HangulEntry[] = Array.from({ length: 6 }, (_, i) => ({
  id: `vowel-${i}`,
  hangul: `v${i}`,
  romanization: `V${i}`,
  category: 'vowel',
}))

const consonants: HangulEntry[] = Array.from({ length: 2 }, (_, i) => ({
  id: `cons-${i}`,
  hangul: `c${i}`,
  romanization: `C${i}`,
  category: 'consonant',
}))

const entries = [...vowels, ...consonants]

// Deterministic sequence generator so tests don't depend on Math.random.
function seededRng(seed: number) {
  let value = seed
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648
    return value / 2147483648
  }
}

describe('generateQuiz', () => {
  it('produces the requested number of questions', () => {
    const questions = generateQuiz(entries, 4, 4, seededRng(1))
    expect(questions).toHaveLength(4)
  })

  it('caps question count at the number of available entries', () => {
    const questions = generateQuiz(entries, 100, 4, seededRng(1))
    expect(questions).toHaveLength(entries.length)
  })

  it('gives each question the requested number of unique choices, including the correct answer', () => {
    const questions = generateQuiz(entries, 5, 4, seededRng(2))

    for (const question of questions) {
      expect(question.choices).toHaveLength(4)
      expect(new Set(question.choices.map((c) => c.id)).size).toBe(4)
      expect(question.choices.some((c) => c.id === question.entry.id)).toBe(
        true,
      )
    }
  })

  it('falls back to other categories when a category has too few distractors', () => {
    const questions = generateQuiz(entries, entries.length, 4, seededRng(3))
    const consonantQuestion = questions.find(
      (q) => q.entry.category === 'consonant',
    )

    expect(consonantQuestion?.choices).toHaveLength(4)
  })
})

describe('scoreAnswer', () => {
  it('returns true when the chosen id matches the question entry', () => {
    const [question] = generateQuiz(entries, 1, 4, seededRng(4))
    expect(scoreAnswer(question, question.entry.id)).toBe(true)
  })

  it('returns false when the chosen id does not match', () => {
    const [question] = generateQuiz(entries, 1, 4, seededRng(4))
    expect(scoreAnswer(question, 'not-a-real-id')).toBe(false)
  })
})
