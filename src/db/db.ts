import { Dexie, type EntityTable } from 'dexie'
import type {
  DeckRecord,
  MetaEntry,
  PracticeEvent,
  QuizAttempt,
  ReviewLogRecord,
  SrsCardRecord,
  StudyDay,
  SyncFields,
} from './types'

export const DB_NAME = 'learn-korean'

export type AppDB = Dexie & {
  quizAttempts: EntityTable<QuizAttempt, 'id'>
  meta: EntityTable<MetaEntry, 'key'>
  srsCards: EntityTable<SrsCardRecord, 'id'>
  reviewLogs: EntityTable<ReviewLogRecord, 'id'>
  decks: EntityTable<DeckRecord, 'id'>
  practiceEvents: EntityTable<PracticeEvent, 'id'>
  studyDays: EntityTable<StudyDay, 'id'>
}

export const db = new Dexie(DB_NAME) as AppDB

// When changing the schema, NEVER edit an existing version: add db.version(N + 1)
// with the new tables/indexes (plus an .upgrade() if data must be migrated).
// Only indexed fields are listed here; other fields are stored anyway.
db.version(1).stores({
  quizAttempts: 'id, quizId, completedAt, updatedAt',
  meta: 'key',
})

// v2: spaced repetition (vocabulary) and custom decks.
db.version(2).stores({
  srsCards: 'id, itemType, itemId, dueAt, updatedAt',
  reviewLogs: 'id, cardId, itemId, reviewedAt, updatedAt',
  decks: 'id, updatedAt',
})

// v3: progress tracking (open-ended practice results and study time).
db.version(3).stores({
  practiceEvents: 'id, skill, at, updatedAt',
  studyDays: 'id, updatedAt',
})

/** Creates the sync fields for a new record. */
export function newSyncFields(now = Date.now()): SyncFields {
  return { id: crypto.randomUUID(), updatedAt: now, deletedAt: null }
}
