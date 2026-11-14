// Generic multiple-choice question generator.
// Pure logic (no React); the random generator is injected so tests are
// deterministic.

export interface QuizItem {
  id: string
}

export interface QuizQuestion<T extends QuizItem> {
  answer: T
  choices: T[]
}

export interface QuizOptions<T extends QuizItem> {
  questionCount: number
  choiceCount: number
  rng?: () => number
  /**
   * Grouping used to pick distractors similar to the answer (e.g. vowels
   * compete with vowels). If the group is too small, items from other
   * groups fill the remaining slots.
   */
  groupOf?: (item: T) => string
  /**
   * Key of the answer shown to the user. Two items with the same key never
   * appear together as choices, so there are never two "correct" options.
   */
  answerKey?: (item: T) => string
}

export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateQuiz<T extends QuizItem>(
  items: readonly T[],
  {
    questionCount,
    choiceCount,
    rng = Math.random,
    groupOf = () => '',
    answerKey = (item) => item.id,
  }: QuizOptions<T>,
): QuizQuestion<T>[] {
  const answers = shuffle(items, rng).slice(
    0,
    Math.min(questionCount, items.length),
  )

  return answers.map((answer) => {
    const group = groupOf(answer)
    const sameGroup = items.filter(
      (i) => i.id !== answer.id && groupOf(i) === group,
    )
    const otherGroups = items.filter(
      (i) => i.id !== answer.id && groupOf(i) !== group,
    )

    // Same-group distractors come first; other groups only fill gaps.
    const candidates = [
      ...shuffle(sameGroup, rng),
      ...shuffle(otherGroups, rng),
    ]
    const usedKeys = new Set([answerKey(answer)])
    const distractors: T[] = []
    for (const candidate of candidates) {
      if (distractors.length >= choiceCount - 1) break
      const key = answerKey(candidate)
      if (usedKeys.has(key)) continue
      usedKeys.add(key)
      distractors.push(candidate)
    }

    return { answer, choices: shuffle([answer, ...distractors], rng) }
  })
}

export function scoreAnswer<T extends QuizItem>(
  question: QuizQuestion<T>,
  chosenId: string,
): boolean {
  return question.answer.id === chosenId
}
