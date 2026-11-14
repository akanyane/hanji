import { describe, expect, it } from 'vitest'
import { GRAMMAR_LESSONS } from '../../content/grammar'
import type { ProgressData } from '../../db/progress'
import type {
  QuizAttempt,
  ReviewLogRecord,
  SrsCardRecord,
} from '../../db/types'
import { dayKey } from '../../lib/progress/dates'
import {
  DAILY_REVIEWS,
  goalProgress,
  learnerLevel,
  localDayNumber,
  planDay,
} from './plan'

// Noon local time. Nov 15 is an even day (reading), Nov 14 odd (dialogue).
const NOW = new Date(2026, 10, 15, 12).getTime()
const ODD_DAY = new Date(2026, 10, 14, 12).getTime()
const YESTERDAY = NOW - 86_400_000

const empty = (): ProgressData => ({
  attempts: [],
  logs: [],
  cards: [],
  practice: [],
  studyDays: [],
})

const attempt = (
  quizId: string,
  score: number,
  total: number,
  at = NOW,
): QuizAttempt => ({
  id: `${quizId}-${at}`,
  updatedAt: at,
  deletedAt: null,
  quizId,
  filter: 'all',
  score,
  total,
  completedAt: at,
})

const card = (itemId: string, dueAt: number): SrsCardRecord =>
  ({
    id: `vocab:${itemId}`,
    updatedAt: NOW,
    deletedAt: null,
    itemType: 'vocab',
    itemId,
    dueAt: new Date(dueAt),
    card: {},
  }) as SrsCardRecord

const log = (at = NOW): ReviewLogRecord =>
  ({
    id: `log-${Math.random()}`,
    updatedAt: at,
    deletedAt: null,
    cardId: 'vocab:x',
    itemId: 'x',
    grade: 'good',
    mode: 'flashcards',
    reviewedAt: new Date(at),
    wasNew: false,
    revlog: {},
  }) as ReviewLogRecord

const kinds = (data: ProgressData, placementLevel: number | null = null) =>
  planDay({ data, placementLevel, newPerSession: 10, now: NOW }).map(
    (t) => t.kind,
  )

describe('learnerLevel', () => {
  it('trusts the placement test, else infers from progress', () => {
    expect(learnerLevel(empty(), 3)).toBe(3)
    expect(learnerLevel(empty(), null)).toBe(0)
    const data = empty()
    data.attempts.push(attempt('hangul-basic', 9, 10))
    expect(learnerLevel(data, null)).toBe(1)
  })
})

describe('planDay', () => {
  it('starts a beginner with Hangul and first words', () => {
    expect(kinds(empty())).toEqual(['hangul', 'vocabulary'])
  })

  it('gives readers vocabulary, the next lesson and a text', () => {
    const plan = planDay({
      data: empty(),
      placementLevel: 1,
      newPerSession: 10,
      now: NOW,
    })
    expect(plan.map((t) => t.kind)).toEqual([
      'vocabulary',
      'grammar',
      'reading',
    ])
    const grammar = plan.find((t) => t.kind === 'grammar')
    expect(grammar?.kind === 'grammar' && grammar.lesson.id).toBe(
      GRAMMAR_LESSONS[0].id,
    )
  })

  it('starts grammar at the placement level and skips passed lessons', () => {
    const data = empty()
    const firstTopik3 = GRAMMAR_LESSONS.find((l) => l.level === 3)
    if (!firstTopik3) throw new Error('no TOPIK 3 lesson')
    data.attempts.push(attempt(`grammar:${firstTopik3.id}`, 3, 3, YESTERDAY))
    const plan = planDay({
      data,
      placementLevel: 4,
      newPerSession: 10,
      now: NOW,
    })
    const grammar = plan.find((t) => t.kind === 'grammar')
    if (grammar?.kind !== 'grammar') throw new Error('no grammar task')
    expect(grammar.lesson.level).toBe(3)
    expect(grammar.lesson.id).not.toBe(firstTopik3.id)
    expect(grammar.done).toBe(false)
  })

  it('keeps the lesson passed today, marked as done', () => {
    const data = empty()
    data.attempts.push(attempt(`grammar:${GRAMMAR_LESSONS[0].id}`, 3, 3))
    const grammar = planDay({
      data,
      placementLevel: 1,
      newPerSession: 10,
      now: NOW,
    }).find((t) => t.kind === 'grammar')
    expect(grammar).toMatchObject({ done: true })
    expect(grammar?.kind === 'grammar' && grammar.lesson.id).toBe(
      GRAMMAR_LESSONS[0].id,
    )
  })

  it('counts due reviews and marks vocabulary done after enough reviews', () => {
    const data = empty()
    data.cards.push(card('water', YESTERDAY), card('rice-meal', NOW + 1e9))
    let vocab = planDay({
      data,
      placementLevel: 1,
      newPerSession: 5,
      now: NOW,
    }).find((t) => t.kind === 'vocabulary')
    expect(vocab).toMatchObject({ due: 1, fresh: 5, deck: 'all', done: false })

    for (let i = 0; i < DAILY_REVIEWS; i++) data.logs.push(log())
    vocab = planDay({
      data,
      placementLevel: 1,
      newPerSession: 5,
      now: NOW,
    }).find((t) => t.kind === 'vocabulary')
    expect(vocab?.done).toBe(true)
  })

  it('marks practice done with the text read today', () => {
    const data = empty()
    data.attempts.push(attempt('reading:my-day', 3, 3))
    const reading = planDay({
      data,
      placementLevel: 2,
      newPerSession: 10,
      now: NOW,
    }).find((t) => t.kind === 'reading')
    expect(reading).toMatchObject({ done: true })
    expect(reading?.kind === 'reading' && reading.text.id).toBe('my-day')
  })

  it('suggests a dialogue on odd days', () => {
    const odd = ODD_DAY
    expect(localDayNumber(dayKey(NOW)) % 2).toBe(0)
    expect(localDayNumber(dayKey(odd)) % 2).toBe(1)
    const plan = planDay({
      data: empty(),
      placementLevel: 1,
      newPerSession: 10,
      now: odd,
    })
    expect(plan.map((t) => t.kind)).toContain('dialogue')
  })
})

describe('goalProgress', () => {
  it('caps the ratio at the goal', () => {
    expect(goalProgress(25, 50)).toEqual({ xp: 25, goal: 50, ratio: 0.5 })
    expect(goalProgress(80, 50).ratio).toBe(1)
  })
})
