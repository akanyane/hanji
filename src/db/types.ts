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

/** How a review happened: a vocabulary study mode, or a lesson's exercises. */
export type ReviewMode = StudyMode | 'grammar'

/**
 * Spaced-repetition state of one study item.
 *
 * The id is deterministic (`vocab:<wordId>`), not a random UUID: the same
 * word gets the same id on every device, so a future sync merges progress
 * instead of creating duplicates.
 */
export interface SrsCardRecord extends SyncFields {
  /** A vocabulary word, or a grammar lesson reviewed through its exercises. */
  itemType: 'vocab' | 'grammar'
  itemId: string
  /** Copy of card.dueAt, indexed for "what is due" queries. */
  dueAt: Date
  card: import('../lib/srs/scheduler').SrsCard
}

export interface ReviewLogRecord extends SyncFields {
  cardId: string
  itemId: string
  grade: import('../lib/srs/scheduler').SrsGrade
  mode: ReviewMode
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

/** Skills tracked on the progress dashboard. */
export type Skill =
  | 'hangul'
  | 'vocabulary'
  | 'grammar'
  | 'pronunciation'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'numbers'

/**
 * Result of an open-ended practice that is not a finished quiz (e.g. one
 * answer in the endless number drill, or a keyboard trainer session).
 */
export interface PracticeEvent extends SyncFields {
  skill: Skill
  /** Which exercise produced it, e.g. "numbers:practice". */
  source: string
  correct: number
  total: number
  at: number
}

/**
 * Active study time of one local calendar day.
 *
 * The id is the day itself (`YYYY-MM-DD`), so each device keeps one record
 * per day and a future sync can merge by id.
 */
export interface StudyDay {
  id: string
  ms: number
  updatedAt: number
  deletedAt: number | null
}
