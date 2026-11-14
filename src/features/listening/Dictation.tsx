import { AnimatePresence, motion } from 'motion/react'
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import { pop, shake, spring } from '../../components/motion/presets'
import { SyllableDiff } from '../../components/speech/SyllableDiff'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { SpeedControl } from '../../components/ui/SpeedControl'
import {
  PRACTICE_SENTENCES,
  type PracticeSentence,
} from '../../content/pronunciation/practice'
import { useRecordQuizAttempt } from '../../db/queries'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { shuffle } from '../../lib/quiz/quiz'
import { compareJamo } from '../../lib/similarity/jamoSimilarity'
import { speakKorean } from '../../services/speech'
import { useSettings } from '../../stores/settings'
import { normalizeAnswer } from '../vocabulary/logic'

const SESSION_SIZE = 8

export function Dictation({ sentences }: { sentences?: PracticeSentence[] }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const voice = useKoreanVoice()
  const { mutate: save } = useRecordQuizAttempt()
  const draw = () =>
    sentences ?? shuffle(PRACTICE_SENTENCES, Math.random).slice(0, SESSION_SIZE)
  const [round, setRound] = useState(0)
  // Drawn once per round; "New dictation" draws again.
  const [items, setItems] = useState(draw)
  // Read through a ref so moving the speed slider doesn't replay the sentence.
  const rateRef = useRef(rate)
  rateRef.current = rate
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [exact, setExact] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const current = items[index]
  const finished = index >= items.length

  const result = useMemo(
    () => (checked && current ? compareJamo(current.ko, value) : null),
    [checked, current, value],
  )
  const isExact =
    checked &&
    current !== undefined &&
    normalizeAnswer(value) === normalizeAnswer(current.ko)

  // Play each new sentence once, as it appears.
  useEffect(() => {
    if (!current || voice === 'unsupported') return
    inputRef.current?.focus()
    speakKorean(current.ko, { rate: rateRef.current })
  }, [current, voice])

  if (voice === 'unsupported') {
    return (
      <p className="rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
        {t('listening.unsupported')}
      </p>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (checked) {
      next()
      return
    }
    if (value.trim() === '') return
    setChecked(true)
    if (normalizeAnswer(value) === normalizeAnswer(current.ko))
      setExact((x) => x + 1)
  }

  const next = () => {
    const nextIndex = index + 1
    setIndex(nextIndex)
    setValue('')
    setChecked(false)
    if (nextIndex >= items.length)
      save({
        quizId: 'listening:dictation',
        filter: 'all',
        score: exact,
        total: items.length,
      })
  }

  if (finished) {
    return (
      <motion.div
        variants={pop}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center gap-3 py-8 text-center"
        role="status"
      >
        {exact / items.length >= 0.75 && <Confetti />}
        <p className="text-5xl font-extrabold">
          <AnimatedNumber value={exact} />
          <span className="text-2xl text-slate-400">/{items.length}</span>
        </p>
        <p className="font-semibold">
          {t('listening.dictation.finished', {
            score: exact,
            total: items.length,
          })}
        </p>
        <Button
          onClick={() => {
            setRound((r) => r + 1)
            setItems(draw())
            setIndex(0)
            setExact(0)
          }}
        >
          {t('listening.dictation.again')}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <p className="text-slate-600 dark:text-slate-300">
        {t('listening.dictation.description')}
      </p>
      <SpeedControl />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('listening.dictation.progress', {
            current: index + 1,
            total: items.length,
          })}
        </p>
        <ProgressBar
          value={index}
          max={items.length}
          label={t('listening.dictation.progress', {
            current: index + 1,
            total: items.length,
          })}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={`${round}-${index}`}
          onSubmit={submit}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={spring}
        >
          <motion.button
            type="button"
            onClick={() => speakKorean(current.ko, { rate })}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            aria-label={t('vocabulary.session.playAgain')}
            className="flex h-24 w-24 items-center justify-center self-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-4xl text-white shadow-xl"
          >
            🔊
          </motion.button>
          <label htmlFor="dictation-input" className="text-sm font-semibold">
            {t('listening.dictation.label')}
          </label>
          <div className="flex gap-2">
            <motion.input
              ref={inputRef}
              id="dictation-input"
              lang="ko"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={checked}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              animate={checked && !isExact ? shake : {}}
              className={cn(
                'min-w-0 flex-1 rounded-full border-2 bg-white px-5 py-3 text-xl dark:bg-slate-800',
                checked
                  ? isExact
                    ? 'border-emerald-500'
                    : 'border-amber-500'
                  : 'border-slate-300 dark:border-slate-600',
              )}
            />
            {!checked && (
              <Button type="submit" disabled={value.trim() === ''}>
                {t('listening.dictation.check')}
              </Button>
            )}
          </div>
          <div aria-live="assertive">
            {checked && result && (
              <motion.div
                variants={pop}
                initial="hidden"
                animate="visible"
                className={cn(
                  'flex flex-col gap-3 rounded-2xl p-4',
                  isExact
                    ? 'bg-emerald-50 dark:bg-emerald-950/50'
                    : 'bg-amber-50 dark:bg-amber-950/40',
                )}
              >
                <p className="font-semibold">
                  {isExact
                    ? `🎉 ${t('listening.dictation.correct')}`
                    : t('listening.dictation.incorrect')}{' '}
                  <span className="text-sm font-normal">
                    (
                    {t('listening.dictation.similarity', {
                      score: Math.round(result.score * 100),
                    })}
                    )
                  </span>
                </p>
                <SyllableDiff result={result} />
                <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                  {l(current.translation)}
                </p>
                <Button type="submit" className="self-end">
                  {t('listening.dictation.next')} →
                </Button>
              </motion.div>
            )}
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}
