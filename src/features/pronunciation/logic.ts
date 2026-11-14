import { pronounce } from '../../lib/pronunciation/pronounce'
import { shuffle } from '../../lib/quiz/quiz'

/**
 * Every intermediate form between the spelling and the final pronunciation
 * (읽는 → 익는 → 잉는). They make realistic wrong answers: each is a
 * mistake a learner makes by stopping one rule short.
 */
export function pronunciationStages(word: string): string[] {
  const { steps, pronunciation } = pronounce(word)
  const stages = [word]
  let current = word
  for (const step of steps) {
    // Steps are recorded in order, on the evolving text, so `before` is
    // exactly what sits at `index` right now.
    current =
      current.slice(0, step.index) +
      step.after +
      current.slice(step.index + step.before.length)
    stages.push(current)
  }
  // Guard against drift: the last stage must be the engine's answer.
  stages[stages.length - 1] = pronunciation
  return [...new Set(stages)]
}

/** Up to `count` choices: the real pronunciation plus realistic wrong ones. */
export function pronunciationChoices(
  word: string,
  count = 4,
  rng: () => number = Math.random,
): string[] {
  const correct = pronounce(word).pronunciation
  const wrong = new Set(pronunciationStages(word).filter((s) => s !== correct))
  // Add the version without tensification, a very common learner mistake.
  const untensed = pronounce(word, { tensification: false }).pronunciation
  if (untensed !== correct) wrong.add(untensed)
  return shuffle(
    [correct, ...shuffle([...wrong], rng).slice(0, count - 1)],
    rng,
  )
}
