import { dayKey } from '../lib/progress/dates'
import { db, newSyncFields } from './db'
import type {
  PracticeEvent,
  QuizAttempt,
  ReviewLogRecord,
  Skill,
  SrsCardRecord,
  StudyDay,
} from './types'

// Progress repository: practice results, study time, app meta values and
// the raw data the progress dashboard is computed from.

export interface NewPracticeEvent {
  skill: Skill
  source: string
  correct: number
  total: number
}

export async function recordPractice(
  input: NewPracticeEvent,
  now = Date.now(),
): Promise<PracticeEvent> {
  const event: PracticeEvent = { ...newSyncFields(now), at: now, ...input }
  await db.practiceEvents.add(event)
  return event
}

/** Adds active study time to the record of the (local) day of `now`. */
export async function addStudyTime(ms: number, now = Date.now()) {
  const id = dayKey(now)
  await db.transaction('rw', db.studyDays, async () => {
    const day = await db.studyDays.get(id)
    await db.studyDays.put({
      id,
      ms: (day?.ms ?? 0) + ms,
      updatedAt: now,
      deletedAt: null,
    })
  })
}

export interface ProgressData {
  attempts: QuizAttempt[]
  logs: ReviewLogRecord[]
  cards: SrsCardRecord[]
  practice: PracticeEvent[]
  studyDays: StudyDay[]
}

export async function loadProgressData(): Promise<ProgressData> {
  const alive = <T extends { deletedAt: number | null }>(rows: T[]) =>
    rows.filter((r) => r.deletedAt === null)
  const [attempts, logs, cards, practice, studyDays] = await Promise.all([
    db.quizAttempts.toArray(),
    db.reviewLogs.toArray(),
    db.srsCards.toArray(),
    db.practiceEvents.toArray(),
    db.studyDays.toArray(),
  ])
  return {
    attempts: alive(attempts),
    logs: alive(logs),
    cards: alive(cards),
    practice: alive(practice),
    studyDays: alive(studyDays),
  }
}

// --- Meta values -------------------------------------------------------------

/** Meta keys (stored in the database: never rename). */
export const META_KEYS = {
  seenAchievements: 'achievements:seen',
  placement: 'placement:result',
} as const

export async function getMeta<T>(key: string): Promise<T | undefined> {
  return (await db.meta.get(key))?.value as T | undefined
}

export async function setMeta(key: string, value: unknown) {
  await db.meta.put({ key, value })
}
