// The Today page: a short, ready-made study session built from the
// learner's progress. Pure: everything comes in as arguments, so the rules
// are easy to test.

import { GRAMMAR_LESSONS, type GrammarLesson } from '../../content/grammar'
import { DIALOGUES, type Dialogue } from '../../content/listening/dialogues'
import { READING_TEXTS, type ReadingText } from '../../content/reading/texts'
import { VOCABULARY } from '../../content/vocabulary'
import type { ProgressData } from '../../db/progress'
import { dayKey } from '../../lib/progress/dates'
import { PASS_RATIO } from '../../lib/progress/progress'

export type DailyTask =
  | { kind: 'hangul'; done: boolean }
  | {
      kind: 'vocabulary'
      done: boolean
      due: number
      fresh: number
      reviewedToday: number
      /** Deck to study: everything when reviews are due, else the level deck. */
      deck: string
    }
  | { kind: 'grammarReview'; done: boolean; due: number; reviewedToday: number }
  | { kind: 'grammar'; done: boolean; lesson: GrammarLesson }
  | { kind: 'reading'; done: boolean; text: ReadingText }
  | { kind: 'dialogue'; done: boolean; dialogue: Dialogue }

export interface DailyPlanInput {
  data: ProgressData
  /** Placement test level (0–4), or null when it was never taken. */
  placementLevel: number | null
  newPerSession: number
  now?: number
}

/** Reviews in one day after which the vocabulary task counts as done. */
export const DAILY_REVIEWS = 10

const passed = (score: number, total: number) =>
  total > 0 && score / total >= PASS_RATIO

/**
 * Where the learner is: 0 = cannot read Hangul yet … 4 = ready for TOPIK
 * practice. The placement test decides; without it, progress hints at it.
 */
export function learnerLevel(
  data: ProgressData,
  placementLevel: number | null,
): number {
  if (placementLevel !== null) return placementLevel
  const passedIds = data.attempts
    .filter((a) => passed(a.score, a.total))
    .map((a) => a.quizId)
  if (passedIds.some((id) => id.startsWith('grammar:'))) return 1
  if (passedIds.some((id) => id.startsWith('hangul-'))) return 1
  return 0
}

/** TOPIK level of the grammar the learner should start from. */
function grammarStartLevel(level: number): number {
  if (level >= 3) return 3
  if (level === 2) return 2
  return 1
}

/** Highest TOPIK level of texts and dialogues to suggest. */
function practiceMaxLevel(level: number): number {
  return Math.min(3, Math.max(1, level))
}

export function planDay({
  data,
  placementLevel,
  newPerSession,
  now = Date.now(),
}: DailyPlanInput): DailyTask[] {
  const today = dayKey(now)
  const level = learnerLevel(data, placementLevel)
  const isToday = (time: number | Date) => dayKey(time) === today
  const attemptsToday = data.attempts.filter((a) => isToday(a.completedAt))
  const passedEver = new Set(
    data.attempts.filter((a) => passed(a.score, a.total)).map((a) => a.quizId),
  )
  const tasks: DailyTask[] = []

  // 1. Hangul first, until the learner can read.
  if (level === 0 && ![...passedEver].some((id) => id.startsWith('hangul-')))
    tasks.push({
      kind: 'hangul',
      done: attemptsToday.some((a) => a.quizId.startsWith('hangul-')),
    })

  // 2. Vocabulary: due reviews plus a few new words of the learner's level.
  const wordCards = data.cards.filter((c) => c.itemType === 'vocab')
  const seen = new Set(wordCards.map((c) => c.itemId))
  const due = wordCards.filter((c) => c.dueAt.getTime() <= now).length
  const vocabLevel = Math.min(3, Math.max(1, level))
  const unseen = VOCABULARY.filter(
    (w) => w.level === vocabLevel && !seen.has(w.id),
  ).length
  const fresh = Math.min(newPerSession, unseen)
  const reviewedToday = data.logs.filter(
    (l) => l.cardId.startsWith('vocab:') && isToday(l.reviewedAt),
  ).length
  if (due + fresh > 0 || reviewedToday > 0)
    tasks.push({
      kind: 'vocabulary',
      due,
      fresh,
      reviewedToday,
      deck: due > 0 ? 'all' : `level-${vocabLevel}`,
      done: reviewedToday >= DAILY_REVIEWS || (due === 0 && reviewedToday > 0),
    })

  // 3. Grammar reviews: lessons whose spaced-repetition card is due.
  const grammarDue = data.cards.filter(
    (c) => c.itemType === 'grammar' && c.dueAt.getTime() <= now,
  ).length
  const grammarReviewedToday = data.logs.filter(
    (l) => l.cardId.startsWith('grammar:') && isToday(l.reviewedAt),
  ).length
  // Passing a lesson also logs a review: only count reviews beyond that.
  const lessonQuizzesToday = attemptsToday.filter((a) =>
    a.quizId.startsWith('grammar:'),
  ).length
  const reviewSessionsToday = Math.max(
    0,
    grammarReviewedToday - lessonQuizzesToday,
  )
  if (grammarDue > 0 || reviewSessionsToday > 0)
    tasks.push({
      kind: 'grammarReview',
      due: grammarDue,
      reviewedToday: reviewSessionsToday,
      done: grammarDue === 0 && reviewSessionsToday > 0,
    })

  // 4. Grammar: the lesson passed today, or the next one to learn.
  if (level > 0) {
    const passedToday = attemptsToday.find(
      (a) => a.quizId.startsWith('grammar:') && passed(a.score, a.total),
    )
    const todayLesson = GRAMMAR_LESSONS.find(
      (l) => `grammar:${l.id}` === passedToday?.quizId,
    )
    // First unfinished lesson at the learner's level or above (curriculum
    // order), then any unfinished lesson.
    const unfinished = GRAMMAR_LESSONS.filter(
      (l) => !passedEver.has(`grammar:${l.id}`),
    )
    const next =
      unfinished.find((l) => l.level >= grammarStartLevel(level)) ??
      unfinished[0]
    const lesson = todayLesson ?? next
    if (lesson)
      tasks.push({ kind: 'grammar', lesson, done: Boolean(todayLesson) })
  }

  // 5. Practice: a text or a dialogue (alternating by day), new ones first.
  if (level > 0) {
    const maxLevel = practiceMaxLevel(level)
    const readingToday = attemptsToday.find((a) =>
      a.quizId.startsWith('reading:'),
    )
    const dialogueToday = attemptsToday.find(
      (a) =>
        a.quizId.startsWith('dialogues:') ||
        a.quizId.startsWith('listening:dialogue:'),
    )
    const doneText = READING_TEXTS.find(
      (t) => `reading:${t.id}` === readingToday?.quizId,
    )
    const doneDialogue = DIALOGUES.find((d) =>
      dialogueToday?.quizId.endsWith(`:${d.id}`),
    )
    if (doneText) tasks.push({ kind: 'reading', text: doneText, done: true })
    else if (doneDialogue)
      tasks.push({ kind: 'dialogue', dialogue: doneDialogue, done: true })
    else {
      const texts = READING_TEXTS.filter(
        (t) => t.level <= maxLevel && !passedEver.has(`reading:${t.id}`),
      )
      const dialogues = DIALOGUES.filter(
        (d) =>
          d.level <= maxLevel &&
          !passedEver.has(`dialogues:${d.id}`) &&
          !passedEver.has(`listening:dialogue:${d.id}`),
      )
      // Even days suggest reading, odd days a dialogue (if there is one left).
      const dayNumber = localDayNumber(today)
      const preferReading = dayNumber % 2 === 0
      if ((preferReading || dialogues.length === 0) && texts.length > 0)
        tasks.push({ kind: 'reading', text: texts[0], done: false })
      else if (dialogues.length > 0)
        tasks.push({ kind: 'dialogue', dialogue: dialogues[0], done: false })
    }
  }

  return tasks
}

/** Days since the epoch for a local `YYYY-MM-DD` key (timezone-independent). */
export function localDayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000)
}

/** XP earned today and how far it is from the goal (0–1). */
export function goalProgress(todayXp: number, goal: number) {
  return { xp: todayXp, goal, ratio: Math.min(1, todayXp / goal) }
}
