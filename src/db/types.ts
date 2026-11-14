/**
 * Fields present in every syncable table.
 *
 * Designed for a future backend sync (e.g. Supabase):
 * - `id` is a client-generated UUID, so records created offline on
 *   different devices never collide;
 * - `updatedAt` allows "last write wins" conflict resolution;
 * - `deletedAt` is a soft delete ("tombstone"): the record keeps existing
 *   so the deletion itself can be synced.
 */
export interface SyncFields {
  id: string
  updatedAt: number
  deletedAt: number | null
}

export interface QuizAttempt extends SyncFields {
  /** Which quiz was taken, e.g. "hangul-basic". */
  quizId: string
  /** Filter used in the quiz (e.g. category "vowel" or "all"). */
  filter: string
  score: number
  total: number
  completedAt: number
  /**
   * How many attempts this record stands for. Only differs from 1 on the
   * record imported from the old app version, which only stored an attempt
   * counter and the best score.
   */
  countsAs?: number
}

/** Internal app key/value pairs (e.g. migrations already run). Not synced. */
export interface MetaEntry {
  key: string
  value: unknown
}

/** How an item was practiced (the SRS grade comes from the mode's result). */
export type StudyMode = 'flashcards' | 'choice' | 'typing' | 'listening'

/**
 * Spaced-repetition state of one study item.
 *
 * The id is deterministic (`vocab:<wordId>`), not a random UUID: the same
 * word gets the same id on every device, so a future sync merges progress
 * instead of creating duplicates.
 */
export interface SrsCardRecord extends SyncFields {
  itemType: 'vocab'
  itemId: string
  /** Copy of card.dueAt, indexed for "what is due" queries. */
  dueAt: Date
  card: import('../lib/srs/scheduler').SrsCard
}

export interface ReviewLogRecord extends SyncFields {
  cardId: string
  itemId: string
  grade: import('../lib/srs/scheduler').SrsGrade
  mode: StudyMode
  reviewedAt: Date
  /** True when this was the first time the item was seen. */
  wasNew: boolean
  revlog: import('../lib/srs/scheduler').SrsRevlog
}

/** A deck the learner built themselves. */
export interface DeckRecord extends SyncFields {
  name: string
  itemIds: string[]
  createdAt: number
}
