import { describe, expect, it } from 'vitest'
import { seededRng } from '../../test/rng'
import { generateQuiz, scoreAnswer, shuffle } from './quiz'

interface Item {
  id: string
  group: string
  label: string
}

const vowels: Item[] = Array.from({ length: 6 }, (_, i) => ({
  id: `vowel-${i}`,
  group: 'vowel',
  label: `V${i}`,
}))

const consonants: Item[] = Array.from({ length: 2 }, (_, i) => ({
  id: `cons-${i}`,
  group: 'consonant',
  label: `C${i}`,
}))

const items = [...vowels, ...consonants]
const groupOf = (i: Item) => i.group

describe('shuffle', () => {
  it('keeps every element and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input, seededRng(1))
    expect([...result].sort()).toEqual(input)
    expect(input).toEqual([1, 2, 3, 4, 5])
  })
})

describe('generateQuiz', () => {
  it('produces the requested number of questions', () => {
    const questions = generateQuiz(items, {
      questionCount: 4,
      choiceCount: 4,
      rng: seededRng(1),
    })
    expect(questions).toHaveLength(4)
  })

  it('caps question count at the number of available items', () => {
    const questions = generateQuiz(items, {
      questionCount: 100,
      choiceCount: 4,
      rng: seededRng(1),
    })
    expect(questions).toHaveLength(items.length)
  })

  it('gives each question unique choices that include the answer', () => {
    const questions = generateQuiz(items, {
      questionCount: 5,
      choiceCount: 4,
      rng: seededRng(2),
      groupOf,
    })

    for (const question of questions) {
      expect(question.choices).toHaveLength(4)
      expect(new Set(question.choices.map((c) => c.id)).size).toBe(4)
      expect(question.choices).toContain(question.answer)
    }
  })

  it('prefers distractors from the same group', () => {
    const questions = generateQuiz(items, {
      questionCount: items.length,
      choiceCount: 4,
      rng: seededRng(5),
      groupOf,
    })
    for (const q of questions.filter((q) => q.answer.group === 'vowel')) {
      expect(q.choices.every((c) => c.group === 'vowel')).toBe(true)
    }
  })

  it('falls back to other groups when a group has too few distractors', () => {
    const questions = generateQuiz(items, {
      questionCount: items.length,
      choiceCount: 4,
      rng: seededRng(3),
      groupOf,
    })
    const consonantQuestion = questions.find(
      (q) => q.answer.group === 'consonant',
    )
    expect(consonantQuestion?.choices).toHaveLength(4)
  })

  it('never shows two choices with the same answer key', () => {
    const duplicated: Item[] = [
      { id: 'a', group: 'x', label: 'k' },
      { id: 'b', group: 'x', label: 'k' },
      { id: 'c', group: 'x', label: 'n' },
      { id: 'd', group: 'x', label: 'm' },
      { id: 'e', group: 'x', label: 'p' },
    ]
    for (let seed = 0; seed < 20; seed++) {
      const questions = generateQuiz(duplicated, {
        questionCount: 5,
        choiceCount: 4,
        rng: seededRng(seed),
        answerKey: (i) => i.label,
      })
      for (const q of questions) {
        const labels = q.choices.map((c) => c.label)
        expect(new Set(labels).size).toBe(labels.length)
        expect(q.choices).toContain(q.answer)
      }
    }
  })
})

describe('scoreAnswer', () => {
  const [question] = generateQuiz(items, {
    questionCount: 1,
    choiceCount: 4,
    rng: seededRng(4),
  })

  it('returns true when the chosen id matches the answer', () => {
    expect(scoreAnswer(question, question.answer.id)).toBe(true)
  })

  it('returns false when the chosen id does not match', () => {
    expect(scoreAnswer(question, 'not-a-real-id')).toBe(false)
  })
})
