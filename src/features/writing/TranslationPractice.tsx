import { AnimatePresence, motion } from 'motion/react'
import { type FormEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HangulKeyboard } from '../../components/hangul/HangulKeyboard'
import { pop, shake, spring } from '../../components/motion/presets'
import { SyllableDiff } from '../../components/speech/SyllableDiff'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import {
  TRANSLATIONS,
  type TranslationExercise,
} from '../../content/writing/writing'
import { useRecordQuizAttempt } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import {
  type ImeState,
  imeBackspace,
  imeInput,
  imeText,
} from '../../lib/ime/dubeolsik'
import { compareJamo } from '../../lib/similarity/jamoSimilarity'
import { normalizeAnswer } from '../vocabulary/logic'

/** Similarity above which a wrong answer counts as "almost". */
const CLOSE = 0.8

export type TranslationVerdict =
  | { kind: 'correct'; match: string }
  | { kind: 'close' | 'wrong'; best: string; score: number }

/** Tolerant check: exact after normalizing, otherwise the closest accepted answer. */
export function checkTranslation(
  input: string,
  exercise: TranslationExercise,
): TranslationVerdict {
  const typed = normalizeAnswer(input)
  const exact = exercise.answers.find((a) => normalizeAnswer(a) === typed)
  if (exact) return { kind: 'correct', match: exact }
  let best = exercise.answers[0]
  let score = -1
  for (const answer of exercise.answers) {
    const s = compareJamo(answer, input).score
    if (s > score) {
      best = answer
      score = s
    }
  }
  return { kind: score >= CLOSE ? 'close' : 'wrong', best, score }
}

export function TranslationPractice({
  exercises = TRANSLATIONS,
}: {
  exercises?: TranslationExercise[]
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const { mutate: save } = useRecordQuizAttempt()
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  // On-screen keyboard state; typing in the field resyncs it.
  const [ime, setIme] = useState<ImeState>({ committed: '', composing: null })
  const [verdict, setVerdict] = useState<TranslationVerdict | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [keyboard, setKeyboard] = useState(false)
  const exercise = exercises[index % exercises.length]
  const diff = useMemo(
    () =>
      verdict && verdict.kind !== 'correct'
        ? compareJamo(verdict.best, value)
        : null,
    [verdict, value],
  )

  const setFromKeyboard = (next: ImeState) => {
    setIme(next)
    setValue(imeText(next))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (verdict) {
      next()
      return
    }
    if (!value.trim()) return
    const result = checkTranslation(value, exercise)
    setVerdict(result)
    if (result.kind === 'correct') setCorrectCount((c) => c + 1)
  }

  const next = () => {
    const nextIndex = index + 1
    if (nextIndex === exercises.length)
      save({
        quizId: 'writing:translate',
        filter: 'all',
        score: correctCount,
        total: exercises.length,
      })
    setIndex(nextIndex)
    setValue('')
    setIme({ committed: '', composing: null })
    setVerdict(null)
  }

  const answer = verdict
    ? verdict.kind === 'correct'
      ? verdict.match
      : verdict.best
    : ''

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <p className="text-slate-600 dark:text-slate-300">
        {t('writing.translate.description')}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('writing.translate.progress', {
          current: (index % exercises.length) + 1,
          total: exercises.length,
        })}
      </p>
      <ProgressBar
        value={index % exercises.length}
        max={exercises.length}
        label={t('writing.translate.progress', {
          current: (index % exercises.length) + 1,
          total: exercises.length,
        })}
      />

      <AnimatePresence mode="wait">
        <motion.form
          key={index}
          onSubmit={submit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={spring}
          className="flex flex-col gap-4"
        >
          <p className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center text-2xl font-semibold text-white shadow-lg">
            {l(exercise.prompt)}
          </p>
          <label htmlFor="translation-input" className="text-sm font-semibold">
            {t('writing.translate.label')}
          </label>
          <div className="flex gap-2">
            <motion.input
              id="translation-input"
              lang="ko"
              value={value}
              disabled={verdict !== null}
              onChange={(e) => {
                setValue(e.target.value)
                setIme({ committed: e.target.value, composing: null })
              }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              animate={verdict && verdict.kind !== 'correct' ? shake : {}}
              className={cn(
                'min-w-0 flex-1 rounded-full border-2 bg-white px-5 py-3 text-xl dark:bg-slate-800',
                verdict
                  ? verdict.kind === 'correct'
                    ? 'border-emerald-500'
                    : 'border-amber-500'
                  : 'border-slate-300 dark:border-slate-600',
              )}
            />
            {!verdict && (
              <Button type="submit" disabled={!value.trim()}>
                {t('writing.translate.check')}
              </Button>
            )}
          </div>
          {!verdict && (
            <Button
              variant="ghost"
              className="self-start text-sm"
              onClick={() => setKeyboard((k) => !k)}
              aria-pressed={keyboard}
            >
              ⌨️{' '}
              {keyboard
                ? t('writing.keyboard.hideKeyboard')
                : t('writing.keyboard.showKeyboard')}
            </Button>
          )}
          {keyboard && !verdict && (
            <HangulKeyboard
              onJamo={(j) => setFromKeyboard(imeInput(ime, j))}
              onBackspace={() => setFromKeyboard(imeBackspace(ime))}
              onSpace={() => setFromKeyboard(imeInput(ime, ' '))}
            />
          )}
          <div aria-live="assertive">
            {verdict && (
              <motion.div
                variants={pop}
                initial="hidden"
                animate="visible"
                className={cn(
                  'flex flex-col gap-3 rounded-2xl p-4',
                  verdict.kind === 'correct'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50'
                    : 'bg-amber-50 dark:bg-amber-950/40',
                )}
              >
                <p className="font-semibold">
                  {verdict.kind === 'correct'
                    ? `🎉 ${t('writing.translate.correct')}`
                    : verdict.kind === 'close'
                      ? t('writing.translate.close')
                      : t('writing.translate.incorrect')}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {diff ? (
                    <SyllableDiff result={diff} />
                  ) : (
                    <span lang="ko" className="text-2xl">
                      {answer}
                    </span>
                  )}
                  <AudioButton
                    text={answer}
                    className="h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
                  />
                </div>
                {exercise.answers.length > 1 && (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {t('writing.translate.otherAnswers')}{' '}
                    <span lang="ko">
                      {exercise.answers.filter((a) => a !== answer).join(' · ')}
                    </span>
                  </p>
                )}
                <Button type="submit" className="self-end">
                  {t('writing.translate.next')} →
                </Button>
              </motion.div>
            )}
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}
