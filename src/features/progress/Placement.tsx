import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
import {
  QuizSession,
  type SessionQuestion,
} from '../../components/exercise/QuizSession'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import {
  PLACEMENT_QUESTIONS,
  PLACEMENT_RECOMMENDATIONS,
  type PlacementLevel,
  type PlacementQuestion,
  type PlacementResult,
  placementLevel,
} from '../../content/progress/placement'
import { META_KEYS, useMeta, useSetMeta } from '../../db/queries'
import type { Localized } from '../../i18n/locales'
import { useLocale, useLocalized } from '../../i18n/useLocalized'
import { shuffle } from '../../lib/quiz/quiz'

type Phase = 'intro' | 'running' | 'done'

function toSessionQuestion(
  q: PlacementQuestion,
  l: (value: Localized) => string,
  order: number[],
): SessionQuestion {
  const choices = order.map((i) => {
    const choice = q.choices[i]
    return {
      id: `${q.id}:${i}`,
      label: typeof choice === 'string' ? choice : l(choice),
      lang:
        typeof choice === 'string' && q.choiceScript !== 'latin'
          ? 'ko'
          : undefined,
    }
  })
  return {
    id: q.id,
    prompt: (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-ink-600 dark:text-ink-300">
          {l(q.instruction)}
        </p>
        {q.ko && (
          <p
            lang="ko"
            className={
              q.ko.length > 12
                ? 'text-xl leading-relaxed font-semibold'
                : 'text-5xl font-bold'
            }
          >
            {q.ko}
          </p>
        )}
      </div>
    ),
    choices,
    answerId: `${q.id}:${q.answer}`,
  }
}

function Recommendation({ result }: { result: PlacementResult }) {
  const { t } = useTranslation()
  const rec = PLACEMENT_RECOMMENDATIONS[result.level]
  return (
    <motion.div
      variants={stagger(0.1, 0.1)}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center gap-4 rounded-xl border border-ink-200 bg-white dark:border-ink-800 p-8 text-center shadow-paper dark:bg-ink-900"
      role="status"
    >
      {result.level >= 2 && <Confetti />}
      <motion.p variants={pop} className="text-6xl" aria-hidden="true">
        <Seal
          text={['시작', '기초', '초급', '중급', '도전'][result.level]}
          size="xl"
          animate="stamp"
        />
      </motion.p>
      <motion.h2 variants={fadeUp} className="text-2xl font-bold">
        {t(`progress.placement.levels.${result.level}.title` as never)}
      </motion.h2>
      <motion.p variants={fadeUp} className="text-ink-600 dark:text-ink-300">
        {t(`progress.placement.levels.${result.level}.description` as never)}
      </motion.p>
      <motion.p variants={fadeUp} className="text-sm text-ink-500">
        {t('progress.placement.score', {
          correct: result.correct,
          total: result.total,
        })}{' '}
        (
        <AnimatedNumber
          value={Math.round((result.correct / result.total) * 100)}
        />
        %)
      </motion.p>
      <motion.div variants={fadeUp}>
        <Link
          to={rec.to}
          className="inline-block rounded-full bg-pine-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-pine-700"
        >
          {t('progress.placement.goTo', {
            module: t(`progress.placement.modules.${rec.module}` as never),
          })}{' '}
          →
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function Placement({ random = Math.random }: { random?: () => number }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const locale = useLocale()
  const { data: saved } = useMeta<PlacementResult>(META_KEYS.placement)
  const { mutate: save } = useSetMeta(META_KEYS.placement)
  const [phase, setPhase] = useState<Phase>('intro')
  const [run, setRun] = useState(0)
  const [result, setResult] = useState<PlacementResult | null>(null)
  const correctByLevel = useRef<Record<PlacementLevel, number>>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  })

  // Choice order is drawn once per run; texts follow the current language.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reshuffle per run
  const orders = useMemo(
    () =>
      PLACEMENT_QUESTIONS.map((q) =>
        shuffle(
          q.choices.map((_, i) => i),
          random,
        ),
      ),
    [random, run],
  )
  // biome-ignore lint/correctness/useExhaustiveDependencies: `l` changes with locale
  const questions = useMemo(
    () => PLACEMENT_QUESTIONS.map((q, i) => toSessionQuestion(q, l, orders[i])),
    [orders, locale],
  )
  const levelOf = useMemo(
    () => new Map(PLACEMENT_QUESTIONS.map((q) => [q.id, q.level])),
    [],
  )

  const onAnswer = useCallback(
    (id: string, correct: boolean) => {
      const level = levelOf.get(id)
      if (correct && level !== undefined) correctByLevel.current[level]++
    },
    [levelOf],
  )

  const onComplete = useCallback(
    (score: number) => {
      const next: PlacementResult = {
        level: placementLevel(correctByLevel.current),
        correct: score,
        total: PLACEMENT_QUESTIONS.length,
        at: Date.now(),
      }
      setResult(next)
      save(next)
      setPhase('done')
    },
    [save],
  )

  const start = () => {
    correctByLevel.current = { 0: 0, 1: 0, 2: 0, 3: 0 }
    setRun((r) => r + 1)
    setPhase('running')
  }

  if (phase === 'running')
    return (
      <QuizSession
        key={run}
        questions={questions}
        onAnswer={onAnswer}
        onComplete={onComplete}
        layout="list"
      />
    )

  const shown = result ?? saved
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      {phase === 'done' && result ? (
        <Recommendation result={result} />
      ) : (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 rounded-xl panel-pine p-6 text-white shadow-lift"
        >
          <p className="text-4xl" aria-hidden="true">
            🧭
          </p>
          <h2 className="text-2xl font-bold">
            {t('progress.placement.ctaTitle')}
          </h2>
          <p className="text-white/90">
            {t('progress.placement.intro', {
              count: PLACEMENT_QUESTIONS.length,
            })}
          </p>
        </motion.div>
      )}
      {phase === 'intro' && shown && (
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('progress.placement.previous', {
            level: t(`progress.placement.levels.${shown.level}.title` as never),
          })}
        </p>
      )}
      <Button onClick={start} className="self-center">
        {phase === 'done' || shown
          ? t('progress.placement.retake')
          : t('progress.placement.start')}
      </Button>
    </div>
  )
}
