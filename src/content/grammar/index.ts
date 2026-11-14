import { basics } from './lessons/basics'
import { connectives } from './lessons/connectives'
import { verbs } from './lessons/verbs'
import type { GrammarLesson } from './types'

/** Lessons in study order. */
export const GRAMMAR_LESSONS: GrammarLesson[] = [
  ...basics,
  ...verbs,
  ...connectives,
]

const BY_ID = new Map(GRAMMAR_LESSONS.map((l) => [l.id, l]))

export function getLesson(id: string): GrammarLesson | undefined {
  return BY_ID.get(id)
}

export * from './types'
