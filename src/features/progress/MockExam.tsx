import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SpeakerIcon } from '../../components/brand/InkMark'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import {
  cardHover,
  fadeUp,
  pop,
  spring,
  stagger,
} from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import {
  type ExamQuestion,
  LOWEST_LEVEL,
  MOCK_EXAMS,
  type MockExam,
} from '../../content/topik/mock'
import {
  useQuizSummaries,
  useRecordPractice,
  useRecordQuizAttempt,
} from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { shuffle } from '../../lib/quiz/quiz'
import { speakSequence } from '../../services/speech'
import { useSettings } from '../../stores/settings'
import {
  type ExamAnswers,
  type ExamResult,
  examQuizId,
  formatClock,
  MAX_PLAYS,
  scoreExam,
} from './exam'

const CIRCLED = ['①', '②', '③', '④']
const PITCH = [0.85, 1.25] as const

export function ExamList() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { data: summaries } = useQuizSummaries('topik:')
  return (
    <div className="flex flex-col gap-4">
      <p className="text-ink-600 dark:text-ink-300">
        {t('progress.exam.description')}
      </p>
      <p className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
        {t('progress.exam.disclaimer')}
      </p>
      <motion.ul
        className="grid gap-3 sm:grid-cols-2"
        variants={stagger(0, 0.06)}
        initial="hidden"
        animate="visible"
      >
        {MOCK_EXAMS.map((exam) => {
          const best = summaries?.[examQuizId(exam.id)]
          return (
            <motion.li key={exam.id} variants={fadeUp} whileHover={cardHover}>
              <Link
                to="/progress/exam/$examId"
                params={{ examId: exam.id }}
                className={cn(
                  'flex flex-col gap-1 rounded-lg p-5 shadow-paper',
                  exam.kind === 'topik1' ? 'panel-seal' : 'panel-ink',
                )}
              >
                <span className="text-xs font-medium tracking-wide uppercase opacity-80">
                  {exam.kind === 'topik1'
                    ? t('progress.exam.kindTopik1')
                    : t('progress.exam.kindTopik2')}
                </span>
                <span className="font-serif text-lg font-bold">
                  {l(exam.title)}
                </span>
                <span className="text-sm text-white/90">
                  {t('progress.exam.meta', {
                    count: exam.questions.length,
                    minutes: exam.minutes,
                  })}
                </span>
                {best && best.attempts > 0 && (
                  <span className="text-sm font-medium">
                    {t('progress.exam.best', { score: best.bestScore })}
                  </span>
                )}
              </Link>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}

function ListeningPlayer({ question }: { question: ExamQuestion }) {
  const { t } = useTranslation()
  const rate = useSettings((s) => s.speechRate)
  const [plays, setPlays] = useState(0)
  const [playing, setPlaying] = useState(false)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopRef.current?.(), [])

  const play = () => {
    if (plays >= MAX_PLAYS || !question.audio) return
    setPlays((p) => p + 1)
    setPlaying(true)
    stopRef.current = speakSequence(
      question.audio.map((line) => ({
        text: line.text,
        pitch: PITCH[line.speaker],
      })),
      { rate, onEnd: () => setPlaying(false) },
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={play}
        disabled={plays >= MAX_PLAYS || playing}
        whileTap={{ scale: 0.9 }}
        animate={playing ? { scale: [1, 1.08, 1] } : {}}
        transition={
          playing ? { repeat: Number.POSITIVE_INFINITY, duration: 1 } : spring
        }
        className="flex h-20 w-20 items-center justify-center rounded-full bg-pine-600 text-3xl text-white shadow-paper disabled:opacity-50"
        aria-label={t('progress.exam.play')}
      >
        {playing ? <SpeakerIcon className="h-8 w-8" /> : '▶'}
      </motion.button>
      <span className="text-sm text-ink-500 dark:text-ink-400">
        {t('progress.exam.playsLeft', { count: MAX_PLAYS - plays })}
      </span>
    </div>
  )
}

function ExamResults({
  exam,
  result,
  answers,
  orders,
  onRetry,
}: {
  exam: MockExam
  result: ExamResult
  answers: ExamAnswers
  orders: Record<string, number[]>
  onRetry: () => void
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  return (
    <div className="flex flex-col gap-5">
      <motion.div
        variants={pop}
        initial="hidden"
        animate="visible"
        role="status"
        className="relative flex flex-col items-center gap-2 rounded-xl panel-seal p-8 text-center text-white shadow-lift"
      >
        {result.level > 0 && <Confetti />}
        <p className="text-6xl font-extrabold">
          <AnimatedNumber value={result.score} />
          <span className="text-2xl font-semibold text-white/80">
            {' '}
            / {result.max}
          </span>
        </p>
        <p className="text-xl font-bold">
          {result.level > 0
            ? t('progress.exam.levelEstimate', { level: result.level })
            : t('progress.exam.belowEstimate', {
                level: LOWEST_LEVEL[exam.kind],
              })}
        </p>
        <p className="text-sm text-white/90">
          {t('progress.exam.sections', {
            listening: `${result.sections.listening.correct}/${result.sections.listening.total}`,
            reading: `${result.sections.reading.correct}/${result.sections.reading.total}`,
          })}
        </p>
        <p className="max-w-md text-xs text-white/80">
          {t('progress.exam.estimateNote')}
        </p>
      </motion.div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onRetry}>{t('progress.exam.retry')}</Button>
        <Link
          to="/progress"
          className="rounded-full px-4 py-2 font-medium text-pine-700 hover:underline dark:text-pine-300"
        >
          {t('progress.exam.toDashboard')}
        </Link>
      </div>
      <h2 className="text-lg font-semibold">{t('progress.exam.review')}</h2>
      <motion.ol
        className="flex flex-col gap-3"
        variants={stagger(0, 0.03)}
        initial="hidden"
        animate="visible"
      >
        {exam.questions.map((q, n) => {
          const chosen = answers[q.id]
          const right = chosen === 0
          return (
            <motion.li
              key={q.id}
              variants={fadeUp}
              className={cn(
                'flex flex-col gap-2 rounded-lg border-l-4 bg-white p-4 shadow-paper dark:bg-ink-900',
                right ? 'border-emerald-500' : 'border-rose-500',
              )}
            >
              <p className="text-sm font-semibold">
                {n + 1}. {right ? '✓' : '✗'}{' '}
                <span lang="ko">{q.instruction.ko}</span>
              </p>
              {q.audio && (
                <p lang="ko" className="text-sm">
                  {q.audio.map((a) => a.text).join(' / ')}
                </p>
              )}
              {q.passage && (
                <p lang="ko" className="text-sm whitespace-pre-line">
                  {q.passage}
                </p>
              )}
              <p className="text-sm text-ink-600 italic dark:text-ink-300">
                {l(q.translation)}
              </p>
              <p className="text-sm">
                {t('progress.exam.correctAnswer')}{' '}
                <span
                  lang="ko"
                  className="font-semibold text-emerald-700 dark:text-emerald-300"
                >
                  {CIRCLED[orders[q.id].indexOf(0)]} {q.choices[0]}
                </span>
              </p>
              {!right && (
                <p className="text-sm">
                  {t('progress.exam.yourAnswer')}{' '}
                  <span
                    lang="ko"
                    className="font-semibold text-rose-700 dark:text-rose-300"
                  >
                    {chosen === undefined
                      ? t('progress.exam.unanswered')
                      : `${CIRCLED[orders[q.id].indexOf(chosen)]} ${q.choices[chosen]}`}
                  </span>
                </p>
              )}
            </motion.li>
          )
        })}
      </motion.ol>
    </div>
  )
}

type Phase = 'intro' | 'running' | 'done'

export function ExamRunner({
  exam,
  random = Math.random,
}: {
  exam: MockExam
  random?: () => number
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const { mutate: saveAttempt } = useRecordQuizAttempt()
  const { mutate: savePractice } = useRecordPractice()
  const [phase, setPhase] = useState<Phase>('intro')
  const [run, setRun] = useState(0)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<ExamAnswers>({})
  const [deadline, setDeadline] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [result, setResult] = useState<ExamResult | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: reshuffle per run
  const orders = useMemo(
    () =>
      Object.fromEntries(
        exam.questions.map((q) => [q.id, shuffle([0, 1, 2, 3], random)]),
      ),
    [exam, random, run],
  )

  const question = exam.questions[index]
  const remaining = deadline - now
  const answeredCount = Object.keys(answers).length

  const submit = () => {
    const scored = scoreExam(exam, answers)
    setResult(scored)
    setPhase('done')
    saveAttempt({
      quizId: examQuizId(exam.id),
      filter: 'all',
      score: scored.score,
      total: scored.max,
    })
    for (const section of ['listening', 'reading'] as const)
      savePractice({
        skill: section,
        source: examQuizId(exam.id),
        ...scored.sections[section],
      })
  }
  const submitRef = useRef(submit)
  submitRef.current = submit

  useEffect(() => {
    if (phase !== 'running') return
    const timer = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= deadline) submitRef.current()
    }, 1000)
    return () => window.clearInterval(timer)
  }, [phase, deadline])

  const start = () => {
    setRun((r) => r + 1)
    setAnswers({})
    setIndex(0)
    setResult(null)
    const startAt = Date.now()
    setNow(startAt)
    setDeadline(startAt + exam.minutes * 60_000)
    setPhase('running')
  }

  if (phase === 'done' && result)
    return (
      <ExamResults
        exam={exam}
        result={result}
        answers={answers}
        orders={orders}
        onRetry={start}
      />
    )

  if (phase === 'intro')
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mx-auto flex w-full max-w-xl flex-col gap-4"
      >
        <h2 className="text-2xl font-bold">{l(exam.title)}</h2>
        <ul className="list-inside list-disc text-ink-600 dark:text-ink-300">
          <li>
            {t('progress.exam.meta', {
              count: exam.questions.length,
              minutes: exam.minutes,
            })}
          </li>
          <li>{t('progress.exam.ruleListening', { count: MAX_PLAYS })}</li>
          <li>{t('progress.exam.ruleNavigate')}</li>
          <li>
            {exam.kind === 'topik1'
              ? t('progress.exam.ruleLevels')
              : t('progress.exam.ruleLevels2')}
          </li>
        </ul>
        <p className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
          {t('progress.exam.disclaimer')}
        </p>
        <Button onClick={start} className="self-start">
          {t('progress.exam.start')}
        </Button>
      </motion.div>
    )

  const order = orders[question.id]
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold">
          {question.section === 'listening'
            ? t('progress.exam.listening')
            : t('progress.exam.reading')}{' '}
          ·{' '}
          {t('progress.exam.question', {
            current: index + 1,
            total: exam.questions.length,
          })}
        </span>
        <span
          className={cn(
            'rounded-full px-3 py-1 font-mono tabular-nums',
            remaining < 60_000
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
              : 'bg-ink-200 dark:bg-ink-700',
          )}
          role="timer"
          aria-label={t('progress.exam.timeLeft')}
        >
          {formatClock(remaining)}
        </span>
      </div>
      <ProgressBar
        value={answeredCount}
        max={exam.questions.length}
        label={t('progress.exam.answered', {
          count: answeredCount,
          total: exam.questions.length,
        })}
      />

      <AnimatePresence mode="wait">
        <motion.section
          key={`${run}-${question.id}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={spring}
          className="flex flex-col gap-4 rounded-xl border border-ink-200 bg-white dark:border-ink-800 p-6 shadow-paper dark:bg-ink-900"
        >
          <div>
            <p lang="ko" className="font-semibold">
              {index + 1}. {question.instruction.ko}
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              {l(question.instruction.help)}
            </p>
          </div>
          {question.audio && (
            <ListeningPlayer
              key={`${run}-${question.id}`}
              question={question}
            />
          )}
          {question.passage && (
            <p
              lang="ko"
              className="rounded-lg border border-ink-200 p-4 text-lg leading-relaxed whitespace-pre-line dark:border-ink-600"
            >
              {question.passage}
            </p>
          )}
          <fieldset className="grid gap-2">
            <legend className="sr-only">{question.instruction.ko}</legend>
            {order.map((original, position) => {
              const selected = answers[question.id] === original
              return (
                <motion.button
                  key={original}
                  type="button"
                  lang="ko"
                  aria-pressed={selected}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [question.id]: original }))
                  }
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left text-lg transition-colors',
                    selected
                      ? 'border-pine-500 bg-pine-50 dark:bg-pine-950/50'
                      : 'border-ink-200 hover:border-pine-300 dark:border-ink-700',
                  )}
                >
                  <span aria-hidden="true">{CIRCLED[position]}</span>
                  {question.choices[original]}
                </motion.button>
              )
            })}
          </fieldset>
        </motion.section>
      </AnimatePresence>

      <nav
        aria-label={t('progress.exam.questions')}
        className="flex flex-wrap gap-1.5"
      >
        {exam.questions.map((q, i) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index ? 'step' : undefined}
            aria-label={t('progress.exam.goToQuestion', { number: i + 1 })}
            className={cn(
              'h-8 w-8 rounded-lg text-sm font-medium tabular-nums transition-colors',
              i === index && 'ring-2 ring-pine-500',
              answers[q.id] !== undefined
                ? 'bg-pine-600 text-white'
                : 'bg-ink-200 dark:bg-ink-700',
            )}
          >
            {i + 1}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap justify-between gap-2">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          ← {t('common.previous')}
        </Button>
        {index < exam.questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>
            {t('common.next')} →
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (
                answeredCount === exam.questions.length ||
                window.confirm(
                  t('progress.exam.confirmSubmit', {
                    count: exam.questions.length - answeredCount,
                  }),
                )
              )
                submit()
            }}
          >
            {t('progress.exam.submit')}
          </Button>
        )}
      </div>
    </div>
  )
}
