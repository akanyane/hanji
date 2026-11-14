import { DIALOGUES, type Dialogue } from '../../content/listening/dialogues'
import { shuffle } from '../../lib/quiz/quiz'

export interface CompletionStep {
  /** Index of the line the learner must choose. */
  lineIndex: number
  choices: string[]
  answer: string
}

/**
 * Turns a dialogue into a "complete the lines" exercise: every line of the
 * second speaker becomes a choice between the real line and lines from
 * other dialogues.
 */
export function buildCompletion(
  dialogue: Dialogue,
  rng: () => number = Math.random,
  choiceCount = 3,
): CompletionStep[] {
  const pool = DIALOGUES.filter((d) => d.id !== dialogue.id).flatMap((d) =>
    d.lines.map((l) => l.ko),
  )
  return dialogue.lines.flatMap((line, lineIndex) => {
    if (line.speaker !== 1) return []
    const distractors = shuffle(
      pool.filter((ko) => ko !== line.ko),
      rng,
    ).slice(0, choiceCount - 1)
    return [
      {
        lineIndex,
        answer: line.ko,
        choices: shuffle([line.ko, ...distractors], rng),
      },
    ]
  })
}
