import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  fadeUp,
  pop,
  shake,
  spring,
  stagger,
} from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { useRecordPractice } from '../../db/queries'
import { cn } from '../../lib/cn'
import {
  COUNTERS,
  type Counter,
  countWith,
  nativeKorean,
  sinoKorean,
} from '../../lib/numbers/numbers'
import {
  makeNumberExercise,
  NUMBER_EXERCISE_KINDS,
  type NumberExercise,
  type NumberExerciseKind,
} from './exercises'

function Reading({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            lang="ko"
            className="text-lg font-semibold"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            {value ?? '—'}
          </motion.span>
        </AnimatePresence>
        {value && (
          <AudioButton
            text={value}
            className="h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
          />
        )}
      </span>
    </div>
  )
}

export function NumbersLearn() {
  const { t } = useTranslation()
  const [value, setValue] = useState('25')
  const n = Number(value)
  const valid = value !== '' && Number.isInteger(n) && n >= 0 && n < 1e12
  const nativeOk = valid && n >= 1 && n <= 99

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={fadeUp} className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-lg">
          <h2 className="text-lg font-bold">{t('numbers.learn.sinoTitle')}</h2>
          <p className="mt-1 text-white/90">{t('numbers.learn.sinoUse')}</p>
          <p lang="ko" className="mt-3 text-2xl font-semibold">
            일 · 이 · 삼 · 사 · 오 · 육 · 칠 · 팔 · 구 · 십
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 text-white shadow-lg">
          <h2 className="text-lg font-bold">
            {t('numbers.learn.nativeTitle')}
          </h2>
          <p className="mt-1 text-white/90">{t('numbers.learn.nativeUse')}</p>
          <p lang="ko" className="mt-3 text-2xl font-semibold">
            하나 · 둘 · 셋 · 넷 · 다섯 · 여섯 · 일곱 · 여덟 · 아홉 · 열
          </p>
        </div>
      </motion.section>
      <motion.p
        variants={fadeUp}
        className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40"
      >
        💡 {t('numbers.learn.shortForms')}
      </motion.p>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
      >
        <h2 className="text-lg font-semibold">{t('numbers.learn.tryIt')}</h2>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t('numbers.learn.numberLabel')}
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-48 rounded-full border border-slate-300 bg-white px-4 py-2 text-xl dark:border-slate-600 dark:bg-slate-900"
          />
        </label>
        <Reading
          label={t('numbers.learn.sino')}
          value={valid ? sinoKorean(n) : null}
        />
        <Reading
          label={t('numbers.learn.native')}
          value={nativeOk ? nativeKorean(n) : null}
        />
        <Reading
          label={t('numbers.learn.nativeCounter')}
          value={nativeOk ? countWith(n, '개') : null}
        />
        {valid && !nativeOk && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('numbers.learn.outOfRange')}
          </p>
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
      >
        <h2 className="text-lg font-semibold">{t('numbers.learn.counters')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              {(Object.keys(COUNTERS) as Counter[]).map((counter) => {
                const example = countWith(
                  COUNTERS[counter] === 'native' ? 3 : 2,
                  counter,
                )
                return (
                  <tr
                    key={counter}
                    className="border-t border-slate-100 dark:border-slate-700"
                  >
                    <th
                      scope="row"
                      lang="ko"
                      className="py-2 pr-4 text-lg font-bold text-sky-700 dark:text-sky-300"
                    >
                      {counter}
                    </th>
                    <td className="py-2 pr-4 text-sm">
                      {t(`numbers.counterNames.${counter}`)}
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-500 dark:text-slate-400">
                      {COUNTERS[counter] === 'native'
                        ? t('numbers.learn.native')
                        : t('numbers.learn.sino')}
                    </td>
                    <td lang="ko" className="py-2">
                      {example}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          📅 {t('numbers.learn.monthNote')}
        </p>
      </motion.section>
    </motion.div>
  )
}

export function NumberPractice({ initial }: { initial?: NumberExercise }) {
  const { t } = useTranslation()
  const { mutate: record } = useRecordPractice()
  const [kind, setKind] = useState<NumberExerciseKind | 'all'>('all')
  const [exercise, setExercise] = useState<NumberExercise>(
    () => initial ?? makeNumberExercise(),
  )
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [count, setCount] = useState(0)
  const nextRef = useRef<HTMLButtonElement>(null)
  const correct = picked === exercise.answer

  const next = useCallback(
    (k: NumberExerciseKind | 'all' = kind) => {
      setExercise(makeNumberExercise(k === 'all' ? undefined : k))
      setPicked(null)
      setCount((c) => c + 1)
    },
    [kind],
  )

  const choose = useCallback(
    (choice: string) => {
      if (picked) return
      setPicked(choice)
      setStreak(choice === exercise.answer ? streak + 1 : 0)
      record({
        skill: 'numbers',
        source: 'numbers:practice',
        correct: Number(choice === exercise.answer),
        total: 1,
      })
    },
    [picked, exercise.answer, streak, record],
  )

  useEffect(() => {
    if (picked) nextRef.current?.focus()
  }, [picked])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLButtonElement &&
        (e.key === 'Enter' || e.key === ' ')
      )
        return
      const digit = Number(e.key)
      if (!picked && digit >= 1 && digit <= exercise.choices.length)
        choose(exercise.choices[digit - 1])
      else if (picked && e.key === 'Enter') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [picked, exercise, choose, next])

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <p className="text-slate-600 dark:text-slate-300">
        {t('numbers.practice.description')}
      </p>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('numbers.practice.kind')}</legend>
        {(['all', ...NUMBER_EXERCISE_KINDS] as const).map((k) => (
          <Chip
            key={k}
            selected={kind === k}
            onClick={() => {
              setKind(k)
              next(k)
            }}
          >
            {k === 'all'
              ? t('numbers.practice.all')
              : t(`numbers.practice.kinds.${k}`)}
          </Chip>
        ))}
      </fieldset>
      <motion.span
        key={streak}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={spring}
        className="self-start rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
      >
        🔥 {t('numbers.practice.streak', { count: streak })}
      </motion.span>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, rotateX: -30, y: 20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={spring}
          className="flex flex-col items-center gap-1 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white shadow-xl"
        >
          <span className="text-sm font-medium text-white/85">
            {t(`numbers.practice.kinds.${exercise.kind}`)}
          </span>
          <span className="text-5xl font-extrabold tabular-nums">
            {exercise.prompt}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="grid gap-2">
        {exercise.choices.map((choice, i) => {
          const isAnswer = choice === exercise.answer
          const isPicked = choice === picked
          return (
            <motion.button
              key={choice}
              type="button"
              lang="ko"
              disabled={picked !== null}
              onClick={() => choose(choice)}
              whileHover={picked ? undefined : { scale: 1.02 }}
              animate={
                picked && isPicked && !isAnswer
                  ? shake
                  : picked && isAnswer
                    ? { scale: [1, 1.04, 1] }
                    : {}
              }
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-medium transition-colors',
                picked && isAnswer
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                  : picked && isPicked
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50'
                    : 'border-slate-200 bg-white hover:border-sky-400 dark:border-slate-700 dark:bg-slate-800',
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs dark:bg-slate-700">
                {i + 1}
              </span>
              {choice}
            </motion.button>
          )
        })}
      </div>

      <div aria-live="assertive" className="min-h-16">
        {picked && (
          <motion.div
            variants={pop}
            initial="hidden"
            animate="visible"
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4',
              correct
                ? 'bg-emerald-50 dark:bg-emerald-950/50'
                : 'bg-rose-50 dark:bg-rose-950/50',
            )}
          >
            <p className="flex items-center gap-2 font-semibold">
              {correct
                ? `🎉 ${t('numbers.practice.correct')}`
                : t('numbers.practice.incorrect', { answer: exercise.answer })}
              <AudioButton
                text={exercise.answer}
                className="h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
              />
            </p>
            <Button ref={nextRef} onClick={() => next()}>
              {t('numbers.practice.next')} →
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
