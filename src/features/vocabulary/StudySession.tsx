import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import { pop, spring } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { getWord } from '../../content/vocabulary'
import { useRecordReview } from '../../db/queries'
import type { StudyMode } from '../../db/types'
import { MINUTE_MS, planSession, type SrsGrade } from '../../lib/srs/scheduler'
import { useSettings } from '../../stores/settings'
import { useDueDates } from './hooks'
import type { ResolvedDeck } from './logic'
import { AnswerInputView, ChoiceView, FlashcardView } from './StudyCards'

/** Cards due again within this window come back later in the same session. */
const REQUEUE_WINDOW_MS = 20 * MINUTE_MS
/** But no card is shown more than this many times per session. */
const MAX_VIEWS = 3

interface StudySessionProps {
  deck: ResolvedDeck
  deckLabel: string
  mode: StudyMode
  onRestart: () => void
}

export function StudySession({
  deck,
  deckLabel,
  mode,
  onRestart,
}: StudySessionProps) {
  const { t } = useTranslation()
  const { dueDates, isLoading } = useDueDates()
  const newPerSession = useSettings((s) => s.newPerSession)
  const { mutateAsync: record, isPending } = useRecordReview()

  // The queue is planned once, when the session starts.
  const [queue, setQueue] = useState<string[] | null>(null)
  const [views, setViews] = useState<Record<string, number>>({})
  const [done, setDone] = useState(0)
  const [grades, setGrades] = useState<Record<SrsGrade, number>>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  if (queue === null && !isLoading) {
    const plan = planSession({
      itemIds: deck.itemIds,
      dueDates,
      now: new Date(),
      newLimit: newPerSession,
    })
    setQueue([...plan.due, ...plan.fresh])
  }

  const current = queue?.[0]
  const word = current ? getWord(current) : undefined

  const grade = useCallback(
    async (g: SrsGrade) => {
      if (!current || isPending) return
      const saved = await record({ itemId: current, grade: g, mode })
      const seen = (views[current] ?? 0) + 1
      const comesBackSoon =
        saved.dueAt.getTime() - Date.now() <= REQUEUE_WINDOW_MS
      setViews((v) => ({ ...v, [current]: seen }))
      setGrades((s) => ({ ...s, [g]: s[g] + 1 }))
      setDone((d) => d + 1)
      setQueue((q) => {
        const rest = (q ?? []).slice(1)
        return comesBackSoon && seen < MAX_VIEWS ? [...rest, current] : rest
      })
    },
    [current, isPending, record, mode, views],
  )

  if (queue === null) return null

  if (done === 0 && queue.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <motion.p
          variants={pop}
          initial="hidden"
          animate="visible"
          className="text-6xl"
          aria-hidden="true"
        >
          🌱
        </motion.p>
        <p className="text-lg">{t('vocabulary.session.nothingToStudy')}</p>
        <Link
          to="/vocabulary/decks"
          className="font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          {t('vocabulary.session.backToDecks')}
        </Link>
      </div>
    )
  }

  if (!current || !word) {
    const remembered = grades.hard + grades.good + grades.easy
    return (
      <motion.div
        className="relative flex flex-col items-center gap-4 py-10 text-center"
        variants={pop}
        initial="hidden"
        animate="visible"
      >
        {remembered / Math.max(done, 1) >= 0.8 && <Confetti />}
        <p className="text-5xl" aria-hidden="true">
          🎉
        </p>
        <h2 className="text-2xl font-bold">
          {t('vocabulary.session.finished')}
        </h2>
        <p role="status">{t('vocabulary.session.summary', { count: done })}</p>
        <dl className="grid grid-cols-4 gap-3">
          {(Object.keys(grades) as SrsGrade[]).map((g) => (
            <div
              key={g}
              className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-800"
            >
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                {t(`vocabulary.session.grades.${g}`)}
              </dt>
              <dd className="text-2xl font-bold">
                <AnimatedNumber value={grades[g]} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onRestart}>
            {t('vocabulary.session.studyMore')}
          </Button>
          <Link
            to="/vocabulary"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2 font-medium text-white shadow-md"
          >
            {t('vocabulary.session.done')}
          </Link>
        </div>
      </motion.div>
    )
  }

  const total = done + queue.length
  const viewKey = `${current}-${views[current] ?? 0}`

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{deckLabel}</span>
          <span>
            {t('vocabulary.session.remaining', { count: queue.length })}
          </span>
        </div>
        <ProgressBar
          value={done}
          max={total}
          label={t('vocabulary.session.progress')}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewKey}
          initial={{ opacity: 0, x: 60, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -60, rotate: -2 }}
          transition={spring}
        >
          {mode === 'flashcards' && (
            <FlashcardView word={word} onGrade={grade} />
          )}
          {mode === 'choice' && <ChoiceView word={word} onGrade={grade} />}
          {(mode === 'typing' || mode === 'listening') && (
            <AnswerInputView
              word={word}
              onGrade={grade}
              listening={mode === 'listening'}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <Link
        to="/vocabulary"
        className="self-center text-sm text-slate-500 hover:underline dark:text-slate-400"
      >
        {t('vocabulary.session.exit')}
      </Link>
    </div>
  )
}
