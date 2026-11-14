import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { LEGACY_PROGRESS_KEY, migrateLegacyProgress } from './migrateLegacy'
import { getQuizSummary, QUIZ_IDS, recordQuizAttempt } from './quizAttempts'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

function fakeStorage(values: Record<string, string>) {
  return { getItem: (key: string) => values[key] ?? null }
}

describe('quizAttempts repository', () => {
  it('returns an empty summary when there are no attempts', async () => {
    expect(await getQuizSummary('x')).toEqual({
      bestScore: 0,
      attempts: 0,
      lastPlayed: null,
    })
  })

  it('records attempts with sync fields and summarizes them per quiz', async () => {
    const a = await recordQuizAttempt({
      quizId: 'q1',
      filter: 'all',
      score: 6,
      total: 10,
      completedAt: 1000,
    })
    await recordQuizAttempt({
      quizId: 'q1',
      filter: 'vowel',
      score: 9,
      total: 10,
      completedAt: 2000,
    })
    await recordQuizAttempt({
      quizId: 'q2',
      filter: 'all',
      score: 10,
      total: 10,
    })

    expect(a.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(a.deletedAt).toBeNull()
    expect(await getQuizSummary('q1')).toEqual({
      bestScore: 9,
      attempts: 2,
      lastPlayed: 2000,
    })
  })

  it('ignores soft-deleted attempts', async () => {
    const a = await recordQuizAttempt({
      quizId: 'q1',
      filter: 'all',
      score: 10,
      total: 10,
    })
    await db.quizAttempts.update(a.id, { deletedAt: Date.now() })
    expect((await getQuizSummary('q1')).attempts).toBe(0)
  })
})

describe('migrateLegacyProgress', () => {
  const legacy = JSON.stringify({
    bestScore: 7,
    attempts: 5,
    lastPlayed: '2026-07-01T12:00:00.000Z',
  })

  it('imports the old localStorage progress as a single weighted attempt', async () => {
    await migrateLegacyProgress(fakeStorage({ [LEGACY_PROGRESS_KEY]: legacy }))

    expect(await getQuizSummary(QUIZ_IDS.hangulBasic)).toEqual({
      bestScore: 7,
      attempts: 5,
      lastPlayed: Date.parse('2026-07-01T12:00:00.000Z'),
    })
  })

  it('runs only once', async () => {
    const storage = fakeStorage({ [LEGACY_PROGRESS_KEY]: legacy })
    await migrateLegacyProgress(storage)
    await migrateLegacyProgress(storage)

    expect(await db.quizAttempts.count()).toBe(1)
  })

  it('does nothing when there is no or invalid legacy data', async () => {
    await migrateLegacyProgress(fakeStorage({}))
    await db.meta.clear()
    await migrateLegacyProgress(
      fakeStorage({ [LEGACY_PROGRESS_KEY]: '{not json' }),
    )
    await db.meta.clear()
    await migrateLegacyProgress(
      fakeStorage({
        [LEGACY_PROGRESS_KEY]: JSON.stringify({ bestScore: 0, attempts: 0 }),
      }),
    )

    expect(await db.quizAttempts.count()).toBe(0)
  })
})
