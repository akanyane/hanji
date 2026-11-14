import { Dexie, type EntityTable } from 'dexie'
import type { MetaEntry, QuizAttempt, SyncFields } from './types'

export const DB_NAME = 'learn-korean'

export type AppDB = Dexie & {
  quizAttempts: EntityTable<QuizAttempt, 'id'>
  meta: EntityTable<MetaEntry, 'key'>
}

export const db = new Dexie(DB_NAME) as AppDB

// When changing the schema, NEVER edit an existing version: add db.version(N + 1)
// with the new tables/indexes (plus an .upgrade() if data must be migrated).
// Only indexed fields are listed here; other fields are stored anyway.
db.version(1).stores({
  quizAttempts: 'id, quizId, completedAt, updatedAt',
  meta: 'key',
})

/** Creates the sync fields for a new record. */
export function newSyncFields(now = Date.now()): SyncFields {
  return { id: crypto.randomUUID(), updatedAt: now, deletedAt: null }
}
