import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pop, spring } from '../../components/motion/presets'
import { RecorderPanel } from '../../components/speech/RecorderPanel'
import { SyllableDiff } from '../../components/speech/SyllableDiff'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { SpeedControl } from '../../components/ui/SpeedControl'
import {
  PRACTICE_SENTENCES,
  type PracticeSentence,
} from '../../content/pronunciation/practice'
import { useRecordPractice } from '../../db/queries'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { shuffle } from '../../lib/quiz/quiz'
import { compareJamo } from '../../lib/similarity/jamoSimilarity'

/** Similarity thresholds for the feedback message. */
const GREAT = 0.9
const GOOD = 0.7

export function RepeatPractice({
  sentences,
}: {
  sentences?: PracticeSentence[]
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const items = useMemo(
    () => sentences ?? shuffle(PRACTICE_SENTENCES, Math.random),
    [sentences],
  )
  const [index, setIndex] = useState(0)
  const recognition = useSpeechRecognition()
  const { mutate: record } = useRecordPractice()
  const current = items[index % items.length]

  const result = useMemo(
    () =>
      recognition.status === 'done' && recognition.transcript
        ? compareJamo(current.ko, recognition.transcript)
        : null,
    [recognition.status, recognition.transcript, current],
  )

  // One practice result per recognized attempt; "good" or better counts as right.
  useEffect(() => {
    if (result)
      record({
        skill: 'speaking',
        source: 'speaking:repeat',
        correct: Number(result.score >= GOOD),
        total: 1,
      })
  }, [result, record])

  const next = () => {
    recognition.reset()
    setIndex((i) => i + 1)
  }

  const verdict = result
    ? result.score >= GREAT
      ? 'great'
      : result.score >= GOOD
        ? 'good'
        : 'retry'
    : null

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <p className="text-slate-600 dark:text-slate-300">
        {t('speaking.repeat.description')}
      </p>
      <SpeedControl />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={spring}
          className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-sky-50 to-violet-50 p-6 text-center dark:from-slate-800 dark:to-slate-800/40"
        >
          <p lang="ko" className="text-3xl font-bold">
            {current.ko}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            {l(current.translation)}
          </p>
          <AudioButton
            text={current.ko}
            className="h-14 w-14 [&_svg]:h-7 [&_svg]:w-7"
          />
        </motion.div>
      </AnimatePresence>

      {recognition.supported ? (
        <div className="flex flex-col items-center gap-3">
          <motion.button
            type="button"
            onClick={
              recognition.status === 'listening'
                ? recognition.stop
                : recognition.start
            }
            whileTap={{ scale: 0.92 }}
            aria-pressed={recognition.status === 'listening'}
            className={cn(
              'relative flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-xl',
              recognition.status === 'listening'
                ? 'bg-rose-500'
                : 'bg-gradient-to-br from-rose-500 to-orange-500',
            )}
            aria-label={
              recognition.status === 'listening'
                ? t('speaking.repeat.stop')
                : t('speaking.repeat.speak')
            }
          >
            {recognition.status === 'listening' && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-4 border-rose-300"
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
            🎤
          </motion.button>
          <p
            className="text-sm text-slate-500 dark:text-slate-400"
            aria-live="polite"
          >
            {recognition.status === 'listening'
              ? t('speaking.repeat.listening')
              : t('speaking.repeat.speak')}
          </p>
          {recognition.transcript && (
            <p className="text-sm">
              {t('speaking.repeat.youSaid')}:{' '}
              <span lang="ko" className="font-semibold">
                {recognition.transcript}
              </span>
            </p>
          )}
          {recognition.status === 'error' && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {t('speaking.repeat.error')}
            </p>
          )}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {t('speaking.repeat.privacy')}
          </p>
        </div>
      ) : (
        <p className="rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {t('speaking.repeat.unsupported')}
        </p>
      )}

      <div aria-live="assertive">
        {result && verdict && (
          <motion.div
            variants={pop}
            initial="hidden"
            animate="visible"
            className={cn(
              'flex flex-col gap-3 rounded-2xl p-4 text-center',
              verdict === 'great'
                ? 'bg-emerald-50 dark:bg-emerald-950/50'
                : verdict === 'good'
                  ? 'bg-amber-50 dark:bg-amber-950/40'
                  : 'bg-rose-50 dark:bg-rose-950/50',
            )}
          >
            <p className="text-4xl font-extrabold">
              {Math.round(result.score * 100)}%
            </p>
            <p className="font-semibold">{t(`speaking.repeat.${verdict}`)}</p>
            <SyllableDiff result={result} />
          </motion.div>
        )}
      </div>

      <RecorderPanel key={index} />

      <Button variant="secondary" className="self-end" onClick={next}>
        {t('speaking.repeat.next')} →
      </Button>
    </div>
  )
}
