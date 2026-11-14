import { db, newSyncFields } from './db'
import type { QuizAttempt } from './types'

// Quiz attempt repository. Components never touch Dexie directly: when sync
// is added, only this module changes.

/** Stable quiz ids (stored in the database: never rename). */
export const QUIZ_IDS = {
  hangulBasic: 'hangul-basic',
  hangulListen: 'hangul-listen',
  hangulRead: 'hangul-read',
} as const

export interface NewQuizAttempt {
  quizId: string
  filter: string
  score: number
  total: number
  completedAt?: number
  countsAs?: number
}

export interface QuizSummary {
  bestScore: number
  attempts: number
  lastPlayed: number | null
}

export async function recordQuizAttempt(
  input: NewQuizAttempt,
): Promise<QuizAttempt> {
  const now = Date.now()
  const attempt: QuizAttempt = {
    ...newSyncFields(now),
    completedAt: now,
    ...input,
  }
  await db.quizAttempts.add(attempt)
  return attempt
}

export async function getQuizSummary(quizId: string): Promise<QuizSummary> {
  const attempts = await db.quizAttempts
    .where('quizId')
    .equals(quizId)
    .filter((a) => a.deletedAt === null)
    .toArray()

  return attempts.reduce<QuizSummary>(
    (summary, a) => ({
      bestScore: Math.max(summary.bestScore, a.score),
      attempts: summary.attempts + (a.countsAs ?? 1),
      lastPlayed: Math.max(summary.lastPlayed ?? 0, a.completedAt),
    }),
    { bestScore: 0, attempts: 0, lastPlayed: null },
  )
}

/** Summaries of every quiz whose id starts with `prefix` (e.g. all grammar lessons). */
export async function getQuizSummaries(
  prefix: string,
): Promise<Record<string, QuizSummary>> {
  const attempts = await db.quizAttempts
    .where('quizId')
    .startsWith(prefix)
    .filter((a) => a.deletedAt === null)
    .toArray()
  const result: Record<string, QuizSummary> = {}
  for (const a of attempts) {
    const s = result[a.quizId] ?? {
      bestScore: 0,
      attempts: 0,
      lastPlayed: null,
    }
    result[a.quizId] = {
      bestScore: Math.max(s.bestScore, a.score),
      attempts: s.attempts + (a.countsAs ?? 1),
      lastPlayed: Math.max(s.lastPlayed ?? 0, a.completedAt),
    }
  }
  return result
}
