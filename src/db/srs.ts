import {
  createCard,
  previewNextDue,
  reviewCard,
  type SrsGrade,
} from '../lib/srs/scheduler'
import { db } from './db'
import type { ReviewLogRecord, SrsCardRecord, StudyMode } from './types'

// Spaced-repetition repository. Components never touch Dexie directly.

export const vocabCardId = (wordId: string) => `vocab:${wordId}`

const alive = <T extends { deletedAt: number | null }>(
  r: T | undefined,
): r is T => r !== undefined && r.deletedAt === null

export async function getAllCards(): Promise<SrsCardRecord[]> {
  return (await db.srsCards.toArray()).filter(alive)
}

export async function getCard(
  itemId: string,
): Promise<SrsCardRecord | undefined> {
  const record = await db.srsCards.get(vocabCardId(itemId))
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
  grade: SrsGrade
  mode: StudyMode
  now?: Date
}

/**
 * Applies a review: schedules the card with FSRS and stores both the new
 * card state and a log entry. The scheduler runs *before* the transaction,
 * because Dexie transactions can't wait on non-IndexedDB promises.
 */
export async function recordReview({
  itemId,
  grade,
  mode,
  now = new Date(),
}: ReviewInput): Promise<SrsCardRecord> {
  const existing = await getCard(itemId)
  const card = existing?.card ?? (await createCard(now))
  const result = await reviewCard(card, grade, now)
  const id = vocabCardId(itemId)
  const stamp = now.getTime()

  const record: SrsCardRecord = {
    id,
    updatedAt: stamp,
    deletedAt: null,
    itemType: 'vocab',
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

export async function getReviewLogs(since: Date): Promise<ReviewLogRecord[]> {
  return (
    await db.reviewLogs.where('reviewedAt').aboveOrEqual(since).toArray()
  ).filter(alive)
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
