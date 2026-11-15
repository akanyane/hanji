import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import {
  addToSrs,
  getAllCards,
  getCard,
  getReviewLogs,
  gradeFromScore,
  recordLessonResult,
} from './srs'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('grammar spaced repetition', () => {
  it('grades a lesson by its share of right answers', () => {
    expect(gradeFromScore(3, 3)).toBe('good')
    expect(gradeFromScore(2, 3)).toBe('hard')
    expect(gradeFromScore(1, 2)).toBe('hard')
    expect(gradeFromScore(1, 3)).toBe('again')
    expect(gradeFromScore(0, 0)).toBe('again')
  })

  it('enrolls a lesson only once it is passed', async () => {
    expect(await recordLessonResult('past-tense', 1, 3)).toBeNull()
    expect(await getCard('past-tense', 'grammar')).toBeUndefined()

    const now = new Date('2026-11-14T12:00:00Z')
    const card = await recordLessonResult('past-tense', 3, 3, now)
    expect(card).toMatchObject({
      id: 'grammar:past-tense',
      itemType: 'grammar',
      itemId: 'past-tense',
    })
    expect(card?.dueAt.getTime()).toBeGreaterThan(now.getTime())
  })

  it('reschedules an enrolled lesson after every result, even a failed one', async () => {
    const now = new Date('2026-11-14T12:00:00Z')
    await recordLessonResult('past-tense', 3, 3, now)
    const later = new Date('2026-11-20T12:00:00Z')
    const failed = await recordLessonResult('past-tense', 0, 2, later)
    expect(failed).not.toBeNull()
    const logs = await getReviewLogs(new Date(0), 'grammar')
    expect(logs.map((l) => l.grade)).toEqual(['good', 'again'])
    expect(logs.every((l) => l.mode === 'grammar')).toBe(true)
  })

  it('keeps vocabulary and grammar apart', async () => {
    await addToSrs('water')
    await recordLessonResult('past-tense', 3, 3)
    expect((await getAllCards()).map((c) => c.itemId)).toEqual(['water'])
    expect((await getAllCards('grammar')).map((c) => c.itemId)).toEqual([
      'past-tense',
    ])
    expect(await getReviewLogs(new Date(0))).toHaveLength(0)
    expect(await getReviewLogs(new Date(0), 'grammar')).toHaveLength(1)
  })
})
