import { describe, expect, it } from 'vitest'
import type { ProgressData } from '../../db/progress'
import type {
  PracticeEvent,
  QuizAttempt,
  ReviewLogRecord,
  SrsCardRecord,
} from '../../db/types'
import { SrsState } from '../srs/scheduler'
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  newlyUnlocked,
} from './achievements'
import { dayKey, lastDays, shiftDay } from './dates'
import {
  computeProgress,
  levelFromXp,
  passedCount,
  skillOfQuiz,
  streaks,
  XP,
  xpForLevel,
} from './progress'

// Noon local time avoids any DST edge in the fixtures.
const NOW = new Date(2026, 10, 14, 12).getTime()
const daysAgo = (n: number) => new Date(2026, 10, 14 - n, 12).getTime()

const sync = (id: string, at: number) => ({
  id,
  updatedAt: at,
  deletedAt: null,
})

const attempt = (
  quizId: string,
  score: number,
  total: number,
  at = NOW,
): QuizAttempt => ({
  ...sync(`${quizId}-${at}-${score}`, at),
  quizId,
  filter: 'all',
  score,
  total,
  completedAt: at,
})

const log = (grade: ReviewLogRecord['grade'], at = NOW): ReviewLogRecord =>
  ({
    ...sync(`log-${at}-${grade}-${Math.random()}`, at),
    cardId: 'vocab:x',
    itemId: 'x',
    grade,
    mode: 'flashcards',
    reviewedAt: new Date(at),
    wasNew: false,
    revlog: { rating: 3, reviewTime: new Date(at) },
  }) as ReviewLogRecord

const card = (itemId: string, state: SrsState): SrsCardRecord =>
  ({
    ...sync(`vocab:${itemId}`, NOW),
    itemType: 'vocab',
    itemId,
    dueAt: new Date(NOW),
    card: { state },
  }) as SrsCardRecord

const practice = (
  skill: PracticeEvent['skill'],
  correct: number,
  total: number,
  at = NOW,
): PracticeEvent => ({
  ...sync(`p-${at}-${Math.random()}`, at),
  skill,
  source: 'test',
  correct,
  total,
  at,
})

const empty = (): ProgressData => ({
  attempts: [],
  logs: [],
  cards: [],
  practice: [],
  studyDays: [],
})

describe('dates', () => {
  it('formats local days and shifts across months', () => {
    expect(dayKey(NOW)).toBe('2026-11-14')
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28')
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01')
    expect(lastDays('2026-11-14', 3)).toEqual([
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
    ])
  })
})

describe('levels', () => {
  it('grows the XP needed for each level', () => {
    expect(xpForLevel(1)).toBe(0)
    expect(xpForLevel(2)).toBe(50)
    expect(xpForLevel(3)).toBe(150)
    expect(levelFromXp(0)).toEqual({ level: 1, current: 0, needed: 50 })
    expect(levelFromXp(49).level).toBe(1)
    expect(levelFromXp(50)).toEqual({ level: 2, current: 0, needed: 100 })
    expect(levelFromXp(160)).toEqual({ level: 3, current: 10, needed: 150 })
  })
})

describe('streaks', () => {
  const set = (...offsets: number[]) =>
    new Set(offsets.map((o) => shiftDay('2026-11-14', -o)))

  it('counts the current run ending today', () => {
    expect(streaks(set(0, 1, 2, 5), '2026-11-14')).toEqual({
      current: 3,
      longest: 3,
      activeToday: true,
    })
  })

  it('keeps yesterday’s streak alive until today ends', () => {
    expect(streaks(set(1, 2), '2026-11-14')).toEqual({
      current: 2,
      longest: 2,
      activeToday: false,
    })
  })

  it('breaks after a missed day but remembers the longest run', () => {
    expect(streaks(set(2, 3, 4, 5, 9), '2026-11-14')).toEqual({
      current: 0,
      longest: 4,
      activeToday: false,
    })
  })
})

describe('computeProgress', () => {
  it('starts from zero', () => {
    const stats = computeProgress(empty(), NOW)
    expect(stats.xp).toBe(0)
    expect(stats.level.level).toBe(1)
    expect(stats.streak.current).toBe(0)
    expect(stats.skills.grammar.accuracy).toBeNull()
    expect(stats.daily).toHaveLength(84)
    expect(stats.daily[stats.daily.length - 1]).toEqual({
      day: '2026-11-14',
      xp: 0,
    })
  })

  it('adds XP from quizzes, reviews, practice and study time', () => {
    const data = empty()
    data.attempts.push(attempt('grammar:copula', 4, 5))
    data.logs.push(log('good'), log('again'))
    data.practice.push(practice('numbers', 1, 1))
    data.studyDays.push({
      id: '2026-11-14',
      ms: 5 * 60_000 + 30_000,
      updatedAt: NOW,
      deletedAt: null,
    })
    const stats = computeProgress(data, NOW)
    expect(stats.xp).toBe(XP.quiz(4) + 2 * XP.review + XP.practice(1, 1) + 5)
    expect(stats.todayMs).toBe(330_000)
    expect(stats.daily[stats.daily.length - 1]?.xp).toBe(stats.xp)
  })

  it('computes accuracy per skill', () => {
    const data = empty()
    data.attempts.push(
      attempt('grammar:a', 3, 4),
      attempt('pronunciation:liaison', 1, 2),
    )
    data.logs.push(log('good'), log('hard'), log('again'), log('easy'))
    data.practice.push(practice('grammar', 1, 4))
    const { skills } = computeProgress(data, NOW)
    expect(skills.grammar).toEqual({ correct: 4, total: 8, accuracy: 0.5 })
    expect(skills.vocabulary.accuracy).toBe(0.75)
    expect(skills.pronunciation.accuracy).toBe(0.5)
    expect(skills.speaking.accuracy).toBeNull()
  })

  it('tracks streaks from activity of any kind', () => {
    const data = empty()
    data.attempts.push(attempt('reading:x', 1, 1, daysAgo(2)))
    data.logs.push(log('good', daysAgo(1)))
    data.practice.push(practice('writing', 2, 3, NOW))
    const stats = computeProgress(data, NOW)
    expect(stats.streak).toEqual({ current: 3, longest: 3, activeToday: true })
    expect(stats.activeDays).toBe(3)
  })

  it('counts learned words, perfect and passed quizzes and mocks', () => {
    const data = empty()
    data.cards.push(
      card('a', SrsState.Review),
      card('b', SrsState.Learning),
      card('c', SrsState.Review),
    )
    data.attempts.push(
      attempt('grammar:a', 5, 5),
      attempt('grammar:a', 2, 5),
      attempt('grammar:b', 3, 5),
      attempt('topik:mock-1', 12, 20),
    )
    const stats = computeProgress(data, NOW)
    expect(stats.wordsSeen).toBe(3)
    expect(stats.wordsLearned).toBe(2)
    expect(stats.perfectQuizzes).toBe(1)
    expect(passedCount(stats, 'grammar:')).toBe(1)
    expect(stats.bestMock).toBe(0.6)
  })

  it('counts grammar reviews for grammar, not as words', () => {
    const data = empty()
    data.cards.push(card('water', SrsState.Review), {
      ...card('past-tense', SrsState.Review),
      id: 'grammar:past-tense',
      itemType: 'grammar',
    })
    data.logs.push(log('good'), {
      ...log('again'),
      cardId: 'grammar:past-tense',
    })
    const stats = computeProgress(data, NOW)
    expect(stats.wordsSeen).toBe(1)
    expect(stats.wordsLearned).toBe(1)
    expect(stats.skills.vocabulary).toMatchObject({ correct: 1, total: 1 })
    expect(stats.skills.grammar).toMatchObject({ correct: 0, total: 1 })
  })

  it('maps quiz ids to skills', () => {
    expect(skillOfQuiz('hangul-listen')).toBe('hangul')
    expect(skillOfQuiz('listening:dialogue:cafe')).toBe('listening')
    expect(skillOfQuiz('dialogues:cafe')).toBe('reading')
    expect(skillOfQuiz('topik:mock-1')).toBeUndefined()
  })
})

describe('achievements', () => {
  it('have unique ids and positive goals', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const a of ACHIEVEMENTS) expect(a.goal).toBeGreaterThan(0)
  })

  it('unlock from stats and report progress', () => {
    const data = empty()
    data.attempts.push(attempt('hangul-basic', 10, 10))
    const stats = computeProgress(data, NOW)
    const statuses = evaluateAchievements({ stats, placementDone: false })
    const byId = Object.fromEntries(statuses.map((s) => [s.achievement.id, s]))
    expect(byId.firstSteps.unlocked).toBe(true)
    expect(byId.hangulMaster.unlocked).toBe(true)
    expect(byId.perfect.unlocked).toBe(true)
    expect(byId.placement.unlocked).toBe(false)
    expect(byId.xp100.ratio).toBeCloseTo(0.3)
    expect(newlyUnlocked(statuses, ['firstSteps'])).toEqual([
      'hangulMaster',
      'perfect',
    ])
  })
})
