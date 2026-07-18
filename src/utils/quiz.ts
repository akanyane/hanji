import type { HangulEntry } from '../types/hangul'

export interface QuizQuestion {
  entry: HangulEntry
  choices: HangulEntry[]
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateQuiz(
  entries: HangulEntry[],
  questionCount: number,
  choiceCount: number,
  rng: () => number = Math.random,
): QuizQuestion[] {
  const questionEntries = shuffle(entries, rng).slice(
    0,
    Math.min(questionCount, entries.length),
  )

  return questionEntries.map((entry) => {
    const sameCategory = entries.filter(
      (e) => e.category === entry.category && e.id !== entry.id,
    )
    const otherCategory = entries.filter(
      (e) => e.category !== entry.category && e.id !== entry.id,
    )
    const distractorPool =
      sameCategory.length >= choiceCount - 1
        ? sameCategory
        : [...sameCategory, ...otherCategory]
    const distractors = shuffle(distractorPool, rng).slice(0, choiceCount - 1)
    const choices = shuffle([entry, ...distractors], rng)
    return { entry, choices }
  })
}

export function scoreAnswer(question: QuizQuestion, chosenId: string): boolean {
  return question.entry.id === chosenId
}
