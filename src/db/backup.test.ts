import { beforeEach, describe, expect, it } from 'vitest'
import {
  BackupError,
  backupFileName,
  backupSummary,
  createBackup,
  parseBackup,
  resetProgress,
  restoreBackup,
  reviveDates,
  serializeBackup,
} from './backup'
import { db } from './db'
import { addStudyTime, getMeta, recordPractice, setMeta } from './progress'
import { recordQuizAttempt } from './quizAttempts'
import { addToSrs, getAllCards, recordReview } from './srs'

const SETTINGS = {
  locale: 'en',
  theme: 'dark',
  speechRate: 0.8,
  newPerSession: 15,
  dailyGoal: 100,
} as const

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  localStorage.clear()
})

async function seed() {
  await recordQuizAttempt({
    quizId: 'grammar:copula',
    filter: 'all',
    score: 4,
    total: 5,
  })
  await addToSrs('water')
  await recordReview({ itemId: 'water', grade: 'good', mode: 'flashcards' })
  await recordPractice({
    skill: 'numbers',
    source: 'numbers:practice',
    correct: 1,
    total: 1,
  })
  await addStudyTime(90_000)
  await setMeta('placement:result', { level: 2 })
  await setMeta('migration:legacy-quiz-progress', 1)
  localStorage.setItem('learn-korean:writing:introduce-yourself', '안녕하세요')
}

describe('backup', () => {
  it('round-trips every table, the settings and drafts', async () => {
    await seed()
    const before = await getAllCards()
    const text = serializeBackup(await createBackup(SETTINGS))

    await resetProgress()
    expect(await db.quizAttempts.count()).toBe(0)
    expect(await db.srsCards.count()).toBe(0)
    expect(localStorage.length).toBe(0)
    // Migration markers survive a reset.
    expect(await getMeta('migration:legacy-quiz-progress')).toBe(1)

    const backup = parseBackup(text)
    expect(backup.settings).toEqual(SETTINGS)
    expect(backupSummary(backup)).toEqual({ quizzes: 1, words: 1, reviews: 1 })
    await restoreBackup(backup)

    const after = await getAllCards()
    expect(after).toEqual(before)
    expect(after[0].dueAt).toBeInstanceOf(Date)
    expect(after[0].card.dueAt).toBeInstanceOf(Date)
    expect((await db.reviewLogs.toArray())[0].reviewedAt).toBeInstanceOf(Date)
    expect(await db.practiceEvents.count()).toBe(1)
    expect((await db.studyDays.toArray())[0].ms).toBe(90_000)
    expect(await getMeta('placement:result')).toEqual({ level: 2 })
    expect(
      localStorage.getItem('learn-korean:writing:introduce-yourself'),
    ).toBe('안녕하세요')
  })

  it('restored cards can still be reviewed', async () => {
    await seed()
    const backup = parseBackup(serializeBackup(await createBackup(SETTINGS)))
    await restoreBackup(backup)
    await expect(
      recordReview({ itemId: 'water', grade: 'easy', mode: 'flashcards' }),
    ).resolves.toBeDefined()
  })

  it('rejects files that are not valid backups', () => {
    const reason = (text: string) => {
      try {
        parseBackup(text)
      } catch (e) {
        return e instanceof BackupError ? e.reason : 'other'
      }
      return 'accepted'
    }
    expect(reason('not json')).toBe('notJson')
    expect(reason('{"app":"other"}')).toBe('notBackup')
    expect(reason('{"app":"learn-korean","version":99,"tables":{}}')).toBe(
      'newerVersion',
    )
    expect(
      reason(
        '{"app":"learn-korean","version":1,"tables":{"quizAttempts":[{"no":"id"}]}}',
      ),
    ).toBe('invalid')
    expect(reason('{"app":"learn-korean","version":1,"tables":{}}')).toBe(
      'accepted',
    )
  })

  it('sanitizes imported settings', () => {
    const backup = parseBackup(
      JSON.stringify({
        app: 'learn-korean',
        version: 1,
        tables: {},
        settings: { locale: 'xx', theme: 'neon', speechRate: 9 },
      }),
    )
    expect(backup.settings.theme).toBe('light')
    expect(backup.settings.speechRate).toBe(1.5)
  })

  it('revives ISO dates at any depth only', () => {
    const revived = reviveDates({
      a: '2026-11-14T12:00:00.000Z',
      b: ['2026-11-14T12:00:00Z', 'hello'],
      c: { d: '2026-11-14' },
    }) as { a: Date; b: [Date, string]; c: { d: string } }
    expect(revived.a).toBeInstanceOf(Date)
    expect(revived.b[0]).toBeInstanceOf(Date)
    expect(revived.b[1]).toBe('hello')
    expect(revived.c.d).toBe('2026-11-14')
  })

  it('names files by date', () => {
    expect(backupFileName(new Date('2026-11-14T10:00:00Z'))).toBe(
      'hanji-backup-2026-11-14.json',
    )
  })
})
