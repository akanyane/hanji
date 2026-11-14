// Progress statistics, computed from the raw records. Pure and synchronous:
// the dashboard, the achievements and the tests all use the same numbers.

import type { ProgressData } from '../../db/progress'
import type { Skill } from '../../db/types'
import { SrsState } from '../srs/scheduler'
import { dayKey, lastDays, shiftDay } from './dates'

export const SKILLS: Skill[] = [
  'hangul',
  'vocabulary',
  'grammar',
  'pronunciation',
  'listening',
  'speaking',
  'reading',
  'writing',
  'numbers',
]

/** Which skill each quiz trains, by quiz id prefix (first match wins). */
const QUIZ_SKILLS: [prefix: string, skill: Skill][] = [
  ['hangul-', 'hangul'],
  ['grammar:', 'grammar'],
  ['pronunciation:', 'pronunciation'],
  ['listening:', 'listening'],
  ['reading:', 'reading'],
  ['dialogues:', 'reading'],
  ['writing:', 'writing'],
  // TOPIK mocks mix skills: they record per-section practice events instead.
]

export function skillOfQuiz(quizId: string): Skill | undefined {
  return QUIZ_SKILLS.find(([prefix]) => quizId.startsWith(prefix))?.[1]
}

/** XP rules. Every activity gives something, correct answers give more. */
export const XP = {
  quiz: (score: number) => 10 + 2 * score,
  review: 2,
  practice: (correct: number, total: number) => total + correct,
  studyMinute: 1,
} as const

/** Total XP needed to reach `level` (level 1 starts at 0 XP). */
export function xpForLevel(level: number): number {
  return 25 * level * (level - 1)
}

export function levelFromXp(xp: number) {
  let level = 1
  while (xp >= xpForLevel(level + 1)) level++
  const floor = xpForLevel(level)
  const ceiling = xpForLevel(level + 1)
  return { level, current: xp - floor, needed: ceiling - floor }
}

export interface SkillStats {
  correct: number
  total: number
  /** 0–1, or null when the skill was never practiced. */
  accuracy: number | null
}

export interface ProgressStats {
  xp: number
  level: ReturnType<typeof levelFromXp>
  streak: { current: number; longest: number; activeToday: boolean }
  activeDays: number
  studyMs: number
  todayMs: number
  wordsSeen: number
  /** Cards that graduated to long-term review. */
  wordsLearned: number
  reviews: number
  quizzes: number
  perfectQuizzes: number
  /** Distinct quizzes passed (best score ≥ 70%), per quiz id. */
  passed: Set<string>
  skills: Record<Skill, SkillStats>
  /** XP per day over the last 12 weeks, oldest first. */
  daily: { day: string; xp: number }[]
  /** Best TOPIK mock score ratio (0–1), or null. */
  bestMock: number | null
}

export const PASS_RATIO = 0.7
export const HEATMAP_DAYS = 84

export function computeProgress(data: ProgressData, now = Date.now()) {
  const today = dayKey(now)
  const xpByDay = new Map<string, number>()
  const addXp = (time: number | Date, xp: number) => {
    const key = dayKey(time)
    xpByDay.set(key, (xpByDay.get(key) ?? 0) + xp)
  }
  const skills = Object.fromEntries(
    SKILLS.map((s) => [s, { correct: 0, total: 0, accuracy: null }]),
  ) as Record<Skill, SkillStats>
  const addSkill = (
    skill: Skill | undefined,
    correct: number,
    total: number,
  ) => {
    if (!skill || total <= 0) return
    skills[skill].correct += correct
    skills[skill].total += total
  }

  let quizzes = 0
  let perfectQuizzes = 0
  let bestMock: number | null = null
  const passed = new Set<string>()
  for (const a of data.attempts) {
    const times = a.countsAs ?? 1
    quizzes += times
    addXp(a.completedAt, XP.quiz(a.score))
    addSkill(skillOfQuiz(a.quizId), a.score, a.total)
    const ratio = a.total > 0 ? a.score / a.total : 0
    if (a.total >= 5 && a.score === a.total) perfectQuizzes++
    if (ratio >= PASS_RATIO) passed.add(a.quizId)
    if (a.quizId.startsWith('topik:')) bestMock = Math.max(bestMock ?? 0, ratio)
  }

  for (const log of data.logs) {
    addXp(log.reviewedAt, XP.review)
    addSkill('vocabulary', log.grade === 'again' ? 0 : 1, 1)
  }

  for (const p of data.practice) {
    addXp(p.at, XP.practice(p.correct, p.total))
    addSkill(p.skill, p.correct, p.total)
  }

  let studyMs = 0
  const activeByTime = new Set<string>()
  for (const d of data.studyDays) {
    studyMs += d.ms
    const minutes = Math.floor(d.ms / 60_000)
    if (minutes > 0) {
      xpByDay.set(d.id, (xpByDay.get(d.id) ?? 0) + minutes * XP.studyMinute)
      activeByTime.add(d.id)
    }
  }

  for (const s of SKILLS)
    skills[s].accuracy =
      skills[s].total > 0 ? skills[s].correct / skills[s].total : null

  const active = new Set([...xpByDay.keys(), ...activeByTime])
  const xp = [...xpByDay.values()].reduce((sum, v) => sum + v, 0)

  return {
    xp,
    level: levelFromXp(xp),
    streak: streaks(active, today),
    activeDays: active.size,
    studyMs,
    todayMs: data.studyDays.find((d) => d.id === today)?.ms ?? 0,
    wordsSeen: data.cards.length,
    wordsLearned: data.cards.filter((c) => c.card.state === SrsState.Review)
      .length,
    reviews: data.logs.length,
    quizzes,
    perfectQuizzes,
    passed,
    skills,
    daily: lastDays(today, HEATMAP_DAYS).map((day) => ({
      day,
      xp: xpByDay.get(day) ?? 0,
    })),
    bestMock,
  } satisfies ProgressStats
}

/**
 * Current and longest run of consecutive active days. The current streak is
 * still alive when today has no activity yet but yesterday had.
 */
export function streaks(active: Set<string>, today: string) {
  const activeToday = active.has(today)
  let current = 0
  let day = activeToday ? today : shiftDay(today, -1)
  while (active.has(day)) {
    current++
    day = shiftDay(day, -1)
  }

  let longest = 0
  for (const start of active) {
    if (active.has(shiftDay(start, -1))) continue // not the start of a run
    let length = 0
    let d = start
    while (active.has(d)) {
      length++
      d = shiftDay(d, 1)
    }
    longest = Math.max(longest, length)
  }
  return { current, longest, activeToday }
}

/** Quizzes passed whose id starts with `prefix`. */
export function passedCount(stats: ProgressStats, prefix: string): number {
  let count = 0
  for (const id of stats.passed) if (id.startsWith(prefix)) count++
  return count
}
