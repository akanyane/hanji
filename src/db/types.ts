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
