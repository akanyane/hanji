// Spaced repetition on top of ts-fsrs (FSRS, the algorithm used by Anki).
//
// ts-fsrs does the memory modelling; this module adds what the app needs
// around it: a cached scheduler, string grades, interval previews,
// forecasts, retention and session planning. Everything except the
// scheduler calls is synchronous and pure, so it is easy to test.

import { DefaultScheduler, type Grade, Rating, State } from 'ts-fsrs'

type Scheduler = Awaited<ReturnType<typeof DefaultScheduler>>

/**
 * Card state as produced by ts-fsrs' default (FSRS-7) scheduler.
 *
 * Declared here instead of using the library's inferred types: in ts-fsrs
 * 6.0 those types are inconsistent (e.g. `newCard()` declares no
 * `stabilityFast`, while `review()` requires it, and both exist at runtime).
 * Calls into the library cast at this boundary only; the tests review
 * freshly created and IndexedDB-cloned cards, so a shape mismatch would fail.
 */
export interface SrsCard {
  cardId: string | number
  stability: number
  stabilityFast: number
  difficulty: number
  state: State
  scheduleStatus: string
  dueAt: Date
  lastReviewAt: Date | null
  reps: number
  lapses: number
  scheduledDays: number
  learningStep: number
}

/** Review log entry returned by the scheduler (kept as-is for future analysis). */
export type SrsRevlog = Record<string, unknown> & {
  rating: number
  reviewTime: Date
}

export { State as SrsState }

export type SrsGrade = 'again' | 'hard' | 'good' | 'easy'
export const SRS_GRADES: SrsGrade[] = ['again', 'hard', 'good', 'easy']

const RATING: Record<SrsGrade, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
}
const GRADE_BY_RATING = new Map<number, SrsGrade>(
  SRS_GRADES.map((g) => [RATING[g], g]),
)

let schedulerPromise: Promise<Scheduler> | null = null

/** The scheduler is created once (its setup is async) and reused. */
export function getScheduler(): Promise<Scheduler> {
  schedulerPromise ??= DefaultScheduler()
  return schedulerPromise
}

export async function createCard(now: Date): Promise<SrsCard> {
  return (await getScheduler()).newCard({ now }) as unknown as SrsCard
}

export async function reviewCard(card: SrsCard, grade: SrsGrade, now: Date) {
  const scheduler = await getScheduler()
  const result = scheduler.review({
    card: card as never,
    grade: RATING[grade],
    now,
  })
  return {
    card: result.card as unknown as SrsCard,
    revlog: result.revlog as unknown as SrsRevlog,
  }
}

/** When the card would be due next for each possible grade (for button labels). */
export async function previewNextDue(
  card: SrsCard,
  now: Date,
): Promise<Record<SrsGrade, Date>> {
  const scheduler = await getScheduler()
  const result = {} as Record<SrsGrade, Date>
  for (const item of scheduler.preview({ card: card as never, now })) {
    const grade = GRADE_BY_RATING.get(item.grade)
    if (grade) result[grade] = item.card.dueAt
  }
  return result
}

// ---------------------------------------------------------------------------
// Pure helpers

export const MINUTE_MS = 60_000
export const DAY_MS = 86_400_000

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Whole local days between two dates (calendar days, not 24h blocks). */
export function daysBetween(from: Date, to: Date): number {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS,
  )
}

export function isDue(dueAt: Date, now: Date): boolean {
  return dueAt.getTime() <= now.getTime()
}

/**
 * How many cards come due on each of the next `days` days. Index 0 is
 * today and includes anything overdue.
 */
export function dueForecast(
  dueDates: Date[],
  now: Date,
  days: number,
): number[] {
  const counts = new Array<number>(days).fill(0)
  for (const due of dueDates) {
    const offset = Math.max(0, daysBetween(now, due))
    if (offset < days) counts[offset]++
  }
  return counts
}

/** Reviews done on each of the last `days` days, oldest first (last item = today). */
export function reviewsPerDay(
  reviewTimes: Date[],
  now: Date,
  days: number,
): number[] {
  const counts = new Array<number>(days).fill(0)
  for (const time of reviewTimes) {
    const ago = daysBetween(time, now)
    if (ago >= 0 && ago < days) counts[days - 1 - ago]++
  }
  return counts
}

/**
 * Share of reviews of already-studied cards that were remembered (any grade
 * but "again"). First-time views of new cards don't count. Null without data.
 */
export function retentionRate(
  reviews: Array<{ grade: SrsGrade; wasNew: boolean }>,
): number | null {
  const relevant = reviews.filter((r) => !r.wasNew)
  if (relevant.length === 0) return null
  return relevant.filter((r) => r.grade !== 'again').length / relevant.length
}

export type IntervalUnit = 'minute' | 'hour' | 'day' | 'month' | 'year'

/** Picks a human-sized unit for the time between two dates. */
export function intervalParts(
  from: Date,
  to: Date,
): { value: number; unit: IntervalUnit } {
  const ms = Math.max(0, to.getTime() - from.getTime())
  const minutes = ms / MINUTE_MS
  if (minutes < 60)
    return { value: Math.max(1, Math.round(minutes)), unit: 'minute' }
  const hours = minutes / 60
  if (hours < 24) return { value: Math.round(hours), unit: 'hour' }
  const days = hours / 24
  if (days < 30) return { value: Math.round(days), unit: 'day' }
  if (days < 365) return { value: Math.round(days / 30), unit: 'month' }
  return { value: Math.round((days / 365) * 10) / 10, unit: 'year' }
}

/** Short localized interval, e.g. "10 min", "3 dias", "2 mo". */
export function formatInterval(from: Date, to: Date, locale: string): string {
  const { value, unit } = intervalParts(from, to)
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'short',
  }).format(value)
}

export interface SessionPlan {
  /** Items already being studied that are due, most overdue first. */
  due: string[]
  /** Items never studied, in deck order, up to the new-card limit. */
  fresh: string[]
}

export function planSession({
  itemIds,
  dueDates,
  now,
  newLimit,
}: {
  itemIds: string[]
  /** Due date of every item that already has a card. */
  dueDates: Map<string, Date>
  now: Date
  newLimit: number
}): SessionPlan {
  const due = itemIds
    .filter((id) => {
      const date = dueDates.get(id)
      return date !== undefined && isDue(date, now)
    })
    .sort(
      (a, b) =>
        (dueDates.get(a)?.getTime() ?? 0) - (dueDates.get(b)?.getTime() ?? 0),
    )
  const fresh = itemIds
    .filter((id) => !dueDates.has(id))
    .slice(0, Math.max(0, newLimit))
  return { due, fresh }
}
