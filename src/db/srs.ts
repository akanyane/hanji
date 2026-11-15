import {
  createCard,
  previewNextDue,
  reviewCard,
  type SrsGrade,
} from '../lib/srs/scheduler'
import { db } from './db'
import type { ReviewLogRecord, ReviewMode, SrsCardRecord } from './types'

// Spaced-repetition repository. Components never touch Dexie directly.

export type SrsItemType = SrsCardRecord['itemType']

/** Deterministic ids (`vocab:<wordId>`, `grammar:<lessonId>`): see SrsCardRecord. */
export const cardId = (type: SrsItemType, itemId: string) => `${type}:${itemId}`
export const vocabCardId = (wordId: string) => cardId('vocab', wordId)
export const grammarCardId = (lessonId: string) => cardId('grammar', lessonId)

const alive = <T extends { deletedAt: number | null }>(
  r: T | undefined,
): r is T => r !== undefined && r.deletedAt === null

/** Cards of one item type (vocabulary by default). */
export async function getAllCards(
  type: SrsItemType = 'vocab',
): Promise<SrsCardRecord[]> {
  return (await db.srsCards.where('itemType').equals(type).toArray()).filter(
    alive,
  )
}

export async function getCard(
  itemId: string,
  type: SrsItemType = 'vocab',
): Promise<SrsCardRecord | undefined> {
  const record = await db.srsCards.get(cardId(type, itemId))
  return alive(record) ? record : undefined
}

/** Interval previews per grade for an item (a new card if never studied). */
export async function previewItem(itemId: string, now: Date) {
  const record = await getCard(itemId)
  const card = record?.card ?? (await createCard(now))
  return previewNextDue(card, now)
}

export interface ReviewInput {
  itemId: string
  /** Defaults to vocabulary. */
  itemType?: SrsItemType
  grade: SrsGrade
  mode: ReviewMode
  now?: Date
}

/**
 * Applies a review: schedules the card with FSRS and stores both the new
 * card state and a log entry. The scheduler runs *before* the transaction,
 * because Dexie transactions can't wait on non-IndexedDB promises.
 */
export async function recordReview({
  itemId,
  itemType = 'vocab',
  grade,
  mode,
  now = new Date(),
}: ReviewInput): Promise<SrsCardRecord> {
  const existing = await getCard(itemId, itemType)
  const card = existing?.card ?? (await createCard(now))
  const result = await reviewCard(card, grade, now)
  const id = cardId(itemType, itemId)
  const stamp = now.getTime()

  const record: SrsCardRecord = {
    id,
    updatedAt: stamp,
    deletedAt: null,
    itemType,
    itemId,
    dueAt: result.card.dueAt,
    card: result.card,
  }
  const log: ReviewLogRecord = {
    id: crypto.randomUUID(),
    updatedAt: stamp,
    deletedAt: null,
    cardId: id,
    itemId,
    grade,
    mode,
    reviewedAt: now,
    wasNew: !existing,
    revlog: result.revlog,
  }

  await db.transaction('rw', db.srsCards, db.reviewLogs, async () => {
    await db.srsCards.put(record)
    await db.reviewLogs.add(log)
  })
  return record
}

/** Review logs since a date, of one item type (vocabulary by default). */
export async function getReviewLogs(
  since: Date,
  type: SrsItemType = 'vocab',
): Promise<ReviewLogRecord[]> {
  return (
    await db.reviewLogs.where('reviewedAt').aboveOrEqual(since).toArray()
  ).filter((log) => alive(log) && log.cardId.startsWith(`${type}:`))
}

// --- Grammar ---------------------------------------------------------------

/**
 * FSRS grade from a share of right answers on a lesson's exercises:
 * all right → good, at least half → hard, less → again.
 */
export function gradeFromScore(correct: number, total: number): SrsGrade {
  if (total <= 0) return 'again'
  if (correct >= total) return 'good'
  return correct / total >= 0.5 ? 'hard' : 'again'
}

/** Share of right answers a lesson quiz needs to enter the reviews. */
export const LESSON_ENROLL_RATIO = 0.7

/**
 * Records a lesson quiz or grammar review result. A lesson enters spaced
 * repetition the first time it is passed; after that, every result
 * reschedules it. Returns null when a never-passed lesson was failed.
 */
export async function recordLessonResult(
  lessonId: string,
  correct: number,
  total: number,
  now = new Date(),
): Promise<SrsCardRecord | null> {
  const existing = await getCard(lessonId, 'grammar')
  if (!existing && (total <= 0 || correct / total < LESSON_ENROLL_RATIO))
    return null
  return recordReview({
    itemId: lessonId,
    itemType: 'grammar',
    grade: gradeFromScore(correct, total),
    mode: 'grammar',
    now,
  })
}

/**
 * Adds a word to spaced repetition without reviewing it: it shows up as a
 * new card in the next session. Does nothing if the word is already there.
 */
export async function addToSrs(
  itemId: string,
  now = new Date(),
): Promise<boolean> {
  if (await getCard(itemId)) return false
  const card = await createCard(now)
  await db.srsCards.put({
    id: vocabCardId(itemId),
    updatedAt: now.getTime(),
    deletedAt: null,
    itemType: 'vocab',
    itemId,
    dueAt: card.dueAt,
    card,
  })
  return true
}
