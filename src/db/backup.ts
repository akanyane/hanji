import { loadSettings, SETTINGS_KEY, type Settings } from '../stores/settings'
import { db } from './db'

// Progress backup: everything the learner produced, as one JSON file.
// Used to move progress between browsers/devices until sync exists.

export const BACKUP_APP = 'learn-korean'
export const BACKUP_VERSION = 1

/** Tables included in a backup (all of them, in a stable order). */
export const BACKUP_TABLES = [
  'quizAttempts',
  'srsCards',
  'reviewLogs',
  'decks',
  'practiceEvents',
  'studyDays',
  'meta',
] as const
export type BackupTable = (typeof BACKUP_TABLES)[number]

const DRAFT_PREFIX = 'learn-korean:writing:'

export interface Backup {
  app: typeof BACKUP_APP
  version: number
  exportedAt: string
  settings: Settings
  tables: Record<BackupTable, unknown[]>
  /** Free-writing drafts (kept in localStorage, not IndexedDB). */
  drafts: Record<string, string>
}

export class BackupError extends Error {
  constructor(
    /** i18n key under `progress.data.errors`. */
    readonly reason: 'notJson' | 'notBackup' | 'newerVersion' | 'invalid',
  ) {
    super(`Invalid backup: ${reason}`)
    this.name = 'BackupError'
  }
}

function readDrafts(storage: Storage | null): Record<string, string> {
  const drafts: Record<string, string> = {}
  if (!storage) return drafts
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key?.startsWith(DRAFT_PREFIX))
      drafts[key.slice(DRAFT_PREFIX.length)] = storage.getItem(key) ?? ''
  }
  return drafts
}

function safeStorage(): Storage | null {
  try {
    return localStorage
  } catch {
    return null
  }
}

export async function createBackup(
  settings: Settings,
  now = new Date(),
): Promise<Backup> {
  const rows = await Promise.all(BACKUP_TABLES.map((t) => db[t].toArray()))
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    settings,
    tables: Object.fromEntries(
      BACKUP_TABLES.map((t, i) => [t, rows[i]]),
    ) as Backup['tables'],
    drafts: readDrafts(safeStorage()),
  }
}

export function serializeBackup(backup: Backup): string {
  return JSON.stringify(backup, null, 2)
}

export function backupFileName(now = new Date()): string {
  return `learn-korean-backup-${now.toISOString().slice(0, 10)}.json`
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/

/**
 * JSON turns Dates (SRS due dates, review times) into ISO strings; this turns
 * them back, at any depth, so imported records match freshly created ones.
 */
export function reviveDates(value: unknown): unknown {
  if (typeof value === 'string')
    return ISO_DATE.test(value) ? new Date(value) : value
  if (Array.isArray(value)) return value.map(reviveDates)
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, reviveDates(v)]),
    )
  return value
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/** Parses and validates a backup file. Throws BackupError. */
export function parseBackup(text: string, prefersDark = false): Backup {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new BackupError('notJson')
  }
  if (!isObject(raw) || raw.app !== BACKUP_APP)
    throw new BackupError('notBackup')
  if (typeof raw.version !== 'number') throw new BackupError('invalid')
  if (raw.version > BACKUP_VERSION) throw new BackupError('newerVersion')
  if (!isObject(raw.tables)) throw new BackupError('invalid')

  const tables = {} as Backup['tables']
  for (const table of BACKUP_TABLES) {
    const rows = raw.tables[table] ?? []
    const key = table === 'meta' ? 'key' : 'id'
    if (
      !Array.isArray(rows) ||
      !rows.every((r) => isObject(r) && typeof r[key] === 'string')
    )
      throw new BackupError('invalid')
    tables[table] = rows.map(reviveDates) as unknown[]
  }

  // Settings go through the same validation as saved settings.
  const settingsJson = JSON.stringify(raw.settings ?? null)
  const settings = loadSettings(
    {
      getItem: (k) => (k === SETTINGS_KEY ? settingsJson : null),
      setItem: () => {},
    },
    prefersDark,
  )

  const drafts: Record<string, string> = {}
  if (isObject(raw.drafts))
    for (const [k, v] of Object.entries(raw.drafts))
      if (typeof v === 'string') drafts[k] = v

  return {
    app: BACKUP_APP,
    version: raw.version,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : '',
    settings,
    tables,
    drafts,
  }
}

/** Counts shown before importing, so the learner knows what they restore. */
export function backupSummary(backup: Backup) {
  return {
    quizzes: backup.tables.quizAttempts.length,
    words: backup.tables.srsCards.length,
    reviews: backup.tables.reviewLogs.length,
  }
}

/** Replaces all local progress with the backup's content (atomically). */
export async function restoreBackup(backup: Backup): Promise<void> {
  const tables = BACKUP_TABLES.map((t) => db[t])
  await db.transaction('rw', tables, async () => {
    // One-time migrations already ran on this device: keep their markers so
    // they never run again over the restored data.
    const migrations = await db.meta
      .filter((m) => m.key.startsWith('migration:'))
      .toArray()
    for (const table of BACKUP_TABLES) {
      // The union of table types has incompatible bulkPut signatures; the
      // rows were validated in parseBackup, so treat the table generically.
      const target = db.table(table)
      await target.clear()
      await target.bulkPut(backup.tables[table])
    }
    await db.meta.bulkPut(migrations)
  })
  const storage = safeStorage()
  if (storage) {
    for (const key of Object.keys(readDrafts(storage)))
      storage.removeItem(DRAFT_PREFIX + key)
    for (const [key, text] of Object.entries(backup.drafts)) {
      try {
        storage.setItem(DRAFT_PREFIX + key, text)
      } catch {
        // Storage full or blocked: drafts are a convenience, skip them.
      }
    }
  }
}

/** Deletes all local progress (settings and migration markers are kept). */
export async function resetProgress(): Promise<void> {
  await restoreBackup({
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: '',
    settings: {} as Settings,
    tables: Object.fromEntries(
      BACKUP_TABLES.map((t) => [t, []]),
    ) as unknown as Backup['tables'],
    drafts: {},
  })
}
