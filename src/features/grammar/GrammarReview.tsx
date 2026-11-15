import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InkMark } from '../../components/brand/InkMark'
import { Seal } from '../../components/brand/Seal'
import {
  QuizSession,
  type SessionQuestion,
} from '../../components/exercise/QuizSession'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { type GrammarLesson, getLesson } from '../../content/grammar'
import { useGrammarCards, useRecordLessonResult } from '../../db/queries'
import { useLocale, useLocalized } from '../../i18n/useLocalized'
import { shuffle } from '../../lib/quiz/quiz'
import { formatInterval } from '../../lib/srs/scheduler'
import { exerciseQuestion } from './exerciseQuestion'

/** Lessons per review session, and exercises asked per lesson. */
export const REVIEW_LESSONS = 6
export const EXERCISES_PER_LESSON = 2

interface LessonResult {
  lesson: GrammarLesson
  correct: number
  total: number
  nextDue: Date | null
}

/** Lessons due for review, most overdue first. */
export function dueLessons(
  cards: { itemId: string; dueAt: Date }[],
  now: Date,
): GrammarLesson[] {
  return cards
    .filter((c) => c.dueAt.getTime() <= now.getTime())
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .flatMap((c) => getLesson(c.itemId) ?? [])
}

export function GrammarReview({
  random = Math.random,
}: {
  random?: () => number
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const locale = useLocale()
  const { data: cards } = useGrammarCards()
  const { mutateAsync: recordLesson } = useRecordLessonResult()
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro')
  const [round, setRound] = useState(0)
  const [results, setResults] = useState<LessonResult[]>([])
  const tally = useRef(new Map<string, { correct: number; total: number }>())
  const now = useMemo(() => new Date(), [])

  const due = useMemo(() => dueLessons(cards ?? [], now), [cards, now])
  const session = due.slice(0, REVIEW_LESSONS)

  // Exercises are drawn once per round.
  // biome-ignore lint/correctness/useExhaustiveDependencies: drawn per round
  const picks = useMemo(
    () =>
      session.map((lesson) => ({
        lesson,
        exercises: shuffle(
          lesson.exercises.map((ex, i) => ({ ex, i })),
          random,
        ).slice(0, EXERCISES_PER_LESSON),
      })),
    [round, session.map((s) => s.id).join(',')],
  )
  // biome-ignore lint/correctness/useExhaustiveDependencies: `l` follows the locale
  const questions = useMemo<SessionQuestion[]>(
    () =>
      shuffle(
        picks.flatMap(({ lesson, exercises }) =>
          exercises.map(({ ex, i }) =>
            exerciseQuestion(`${lesson.id}#${i}`, ex, l),
          ),
        ),
        random,
      ),
    [picks, locale],
  )

  const onAnswer = useCallback((id: string, correct: boolean) => {
    const lessonId = id.split('#')[0]
    const entry = tally.current.get(lessonId) ?? { correct: 0, total: 0 }
    tally.current.set(lessonId, {
      correct: entry.correct + Number(correct),
      total: entry.total + 1,
    })
  }, [])

  const onComplete = useCallback(async () => {
    const done: LessonResult[] = []
    for (const { lesson } of picks) {
      const { correct, total } = tally.current.get(lesson.id) ?? {
        correct: 0,
        total: 0,
      }
      const record = await recordLesson({ lessonId: lesson.id, correct, total })
      done.push({ lesson, correct, total, nextDue: record?.dueAt ?? null })
    }
    setResults(done)
    setPhase('done')
  }, [picks, recordLesson])

  const start = () => {
    tally.current = new Map()
    setRound((r) => r + 1)
    setPhase('running')
  }

  if (!cards) return <p role="status">{t('progress.loading')}</p>

  if (phase === 'running')
    return (
      <QuizSession
        key={round}
        questions={questions}
        onAnswer={onAnswer}
        onComplete={onComplete}
      />
    )

  if (phase === 'done')
    return (
      <motion.div
        className="mx-auto flex w-full max-w-xl flex-col gap-4"
        variants={stagger(0, 0.06)}
        initial="hidden"
        animate="visible"
        role="status"
      >
        <motion.div variants={pop} className="flex flex-col items-center gap-2">
          <Seal text="복습" size="xl" animate="stamp" />
          <p className="font-serif text-2xl font-bold">
            {t('grammar.review.finished')}
          </p>
        </motion.div>
        <ul className="flex flex-col gap-2">
          {results.map((r) => (
            <motion.li
              key={r.lesson.id}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white p-3 shadow-paper dark:border-ink-800 dark:bg-ink-900"
            >
              <InkMark
                kind={r.correct === r.total ? 'correct' : 'wrong'}
                className="h-5 w-5"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span lang="ko" className="font-serif font-bold">
                  {r.lesson.pattern}
                </span>
                <span className="text-sm text-ink-600 dark:text-ink-300">
                  {t('grammar.review.lessonScore', {
                    correct: r.correct,
                    total: r.total,
                  })}
                </span>
              </span>
              {r.nextDue && (
                <span className="text-sm text-ink-500 dark:text-ink-400">
                  {t('grammar.review.next', {
                    when: formatInterval(new Date(), r.nextDue, locale),
                  })}
                </span>
              )}
            </motion.li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/today"
            className="rounded-lg bg-ink-900 px-4 py-2 font-medium text-ink-50 dark:bg-ink-50 dark:text-ink-900"
          >
            {t('grammar.review.backToday')}
          </Link>
          <Link
            to="/grammar"
            className="rounded-lg border border-ink-300 px-4 py-2 font-medium hover:border-ink-900 dark:border-ink-700"
          >
            {t('grammar.review.backLessons')}
          </Link>
        </div>
      </motion.div>
    )

  const upcoming = (cards ?? [])
    .filter((c) => c.dueAt.getTime() > now.getTime())
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())[0]

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 text-center"
    >
      <Seal text="복습" size="xl" muted={due.length === 0} />
      <p className="text-ink-600 dark:text-ink-300">
        {t('grammar.review.description')}
      </p>
      {due.length > 0 ? (
        <>
          <p className="font-serif text-xl font-bold">
            {t('grammar.review.due', { count: due.length })}
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {session.map((lesson) => (
              <li
                key={lesson.id}
                lang="ko"
                className="rounded-md border border-ink-200 px-2 py-0.5 font-serif text-sm dark:border-ink-700"
                title={l(lesson.title)}
              >
                {lesson.pattern}
              </li>
            ))}
          </ul>
          <Button onClick={start}>
            {t('grammar.review.start', {
              count: session.length * EXERCISES_PER_LESSON,
            })}
          </Button>
        </>
      ) : (
        <>
          <p className="font-serif text-xl font-bold">
            {t('grammar.review.nothing')}
          </p>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {cards.length === 0
              ? t('grammar.review.howTo')
              : upcoming &&
                t('grammar.review.upcoming', {
                  when: formatInterval(now, upcoming.dueAt, locale),
                })}
          </p>
          <Link
            to="/grammar"
            className="rounded-lg border border-ink-300 px-4 py-2 font-medium hover:border-ink-900 dark:border-ink-700"
          >
            {t('grammar.review.backLessons')}
          </Link>
        </>
      )}
    </motion.div>
  )
}
