import { describe, expect, it } from 'vitest'
import {
  createCard,
  DAY_MS,
  daysBetween,
  dueForecast,
  formatInterval,
  intervalParts,
  MINUTE_MS,
  planSession,
  previewNextDue,
  retentionRate,
  reviewCard,
  reviewsPerDay,
  SrsState,
} from './scheduler'

const NOW = new Date('2026-03-10T12:00:00')
const at = (ms: number) => new Date(NOW.getTime() + ms)

describe('FSRS scheduling', () => {
  it('creates new cards that are due immediately', async () => {
    const card = await createCard(NOW)
    expect(card.state).toBe(SrsState.New)
    expect(card.dueAt.getTime()).toBe(NOW.getTime())
  })

  it('schedules "again" within minutes and "good" days later', async () => {
    const card = await createCard(NOW)
    const again = await reviewCard(card, 'again', NOW)
    const good = await reviewCard(card, 'good', NOW)

    expect(again.card.dueAt.getTime() - NOW.getTime()).toBeLessThan(
      15 * MINUTE_MS,
    )
    expect(good.card.dueAt.getTime() - NOW.getTime()).toBeGreaterThan(DAY_MS)
    expect(good.card.reps).toBe(1)
  })

  it('does not mutate the input card', async () => {
    const card = await createCard(NOW)
    const copy = structuredClone(card)
    await reviewCard(card, 'easy', NOW)
    expect(card).toEqual(copy)
  })

  it('previews longer intervals for better grades', async () => {
    const card = await createCard(NOW)
    const preview = await previewNextDue(card, NOW)
    const times = (['again', 'hard', 'good', 'easy'] as const).map((g) =>
      preview[g].getTime(),
    )
    expect([...times].sort((a, b) => a - b)).toEqual(times)
    expect(new Set(times).size).toBe(4)
  })

  it('grows the interval after successive successful reviews', async () => {
    let card = await createCard(NOW)
    let now = NOW
    const intervals: number[] = []
    for (let i = 0; i < 3; i++) {
      const result = await reviewCard(card, 'good', now)
      intervals.push(result.card.dueAt.getTime() - now.getTime())
      card = result.card
      now = result.card.dueAt
    }
    expect(intervals[1]).toBeGreaterThan(intervals[0])
    expect(intervals[2]).toBeGreaterThan(intervals[1])
  })

  it('survives a structured-clone round trip (as stored in IndexedDB)', async () => {
    const card = structuredClone(await createCard(NOW))
    const result = await reviewCard(card, 'good', NOW)
    expect(result.card.dueAt).toBeInstanceOf(Date)
  })
})

describe('daysBetween', () => {
  it('counts calendar days', () => {
    expect(
      daysBetween(
        new Date('2026-03-10T23:59:00'),
        new Date('2026-03-11T00:01:00'),
      ),
    ).toBe(1)
    expect(daysBetween(NOW, NOW)).toBe(0)
  })
})

describe('dueForecast', () => {
  it('buckets due dates per day, folding overdue cards into today', () => {
    const dates = [
      at(-3 * DAY_MS),
      at(0),
      at(2 * 3600_000),
      at(DAY_MS),
      at(3 * DAY_MS),
      at(30 * DAY_MS),
    ]
    expect(dueForecast(dates, NOW, 5)).toEqual([3, 1, 0, 1, 0])
  })
})

describe('reviewsPerDay', () => {
  it('counts reviews for the last days, oldest first', () => {
    const times = [at(0), at(-60_000), at(-DAY_MS), at(-10 * DAY_MS)]
    expect(reviewsPerDay(times, NOW, 3)).toEqual([0, 1, 2])
  })
})

describe('retentionRate', () => {
  it('ignores first views of new cards', () => {
    expect(
      retentionRate([
        { grade: 'again', wasNew: true },
        { grade: 'good', wasNew: false },
        { grade: 'again', wasNew: false },
        { grade: 'easy', wasNew: false },
        { grade: 'hard', wasNew: false },
      ]),
    ).toBe(0.75)
    expect(retentionRate([{ grade: 'good', wasNew: true }])).toBeNull()
  })
})

describe('intervals', () => {
  it('picks a readable unit', () => {
    expect(intervalParts(NOW, at(30_000))).toEqual({ value: 1, unit: 'minute' })
    expect(intervalParts(NOW, at(10 * MINUTE_MS))).toEqual({
      value: 10,
      unit: 'minute',
    })
    expect(intervalParts(NOW, at(5 * 3600_000))).toEqual({
      value: 5,
      unit: 'hour',
    })
    expect(intervalParts(NOW, at(4 * DAY_MS))).toEqual({
      value: 4,
      unit: 'day',
    })
    expect(intervalParts(NOW, at(90 * DAY_MS))).toEqual({
      value: 3,
      unit: 'month',
    })
    expect(intervalParts(NOW, at(547 * DAY_MS))).toEqual({
      value: 1.5,
      unit: 'year',
    })
  })

  it('formats intervals in the given language', () => {
    expect(formatInterval(NOW, at(4 * DAY_MS), 'en')).toMatch(/4\s?days?/)
    expect(formatInterval(NOW, at(4 * DAY_MS), 'pt-BR')).toMatch(/4\s?dias?/)
  })
})

describe('planSession', () => {
  it('puts due cards first (most overdue first) and limits new cards', () => {
    const dueDates = new Map([
      ['a', at(-DAY_MS)],
      ['b', at(DAY_MS)],
      ['c', at(-2 * DAY_MS)],
    ])
    expect(
      planSession({
        itemIds: ['a', 'b', 'c', 'd', 'e', 'f'],
        dueDates,
        now: NOW,
        newLimit: 2,
      }),
    ).toEqual({ due: ['c', 'a'], fresh: ['d', 'e'] })
  })

  it('handles a zero new-card limit', () => {
    expect(
      planSession({
        itemIds: ['x'],
        dueDates: new Map(),
        now: NOW,
        newLimit: 0,
      }).fresh,
    ).toEqual([])
  })
})
