import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InkMark } from '../../components/brand/InkMark'
import { pop, shake, spring } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import type { VocabWord } from '../../content/vocabulary'
import { previewItem } from '../../db/srs'
import { useLocale, useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import {
  formatInterval,
  SRS_GRADES,
  type SrsGrade,
} from '../../lib/srs/scheduler'
import { speakKorean } from '../../services/speech'
import { useSettings } from '../../stores/settings'
import { checkAnswer, meaningChoices } from './logic'
import { WordFacts } from './WordFacts'

export interface StudyCardProps {
  word: VocabWord
  onGrade: (grade: SrsGrade) => void
}

const GRADE_STYLE: Record<SrsGrade, string> = {
  again: 'bg-rose-500 hover:bg-rose-600',
  hard: 'bg-amber-500 hover:bg-amber-600',
  good: 'bg-emerald-500 hover:bg-emerald-600',
  easy: 'bg-pine-500 hover:bg-pine-600',
}

const cardShell =
  'relative w-full rounded-xl border border-ink-200 bg-white p-6 shadow-lift shadow-ink-200/60 dark:border-ink-700 dark:bg-ink-900 dark:shadow-none'

function BigWord({ word }: { word: VocabWord }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span lang="ko" className="text-5xl font-bold sm:text-6xl">
        {word.word}
      </span>
      <AudioButton text={word.word} />
    </div>
  )
}

/** Shared "continue" bar shown after answering in the non-flashcard modes. */
function Verdict({
  correct,
  word,
  onContinue,
}: {
  correct: boolean
  word: VocabWord
  onContinue: () => void
}) {
  const { t } = useTranslation()
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => ref.current?.focus(), [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      aria-live="assertive"
      className={cn(
        'flex flex-col gap-3 rounded-lg p-4',
        correct
          ? 'bg-emerald-50 dark:bg-emerald-950/50'
          : 'bg-rose-50 dark:bg-rose-950/50',
      )}
    >
      <p className="font-semibold">
        {correct ? (
          <>
            <InkMark kind="correct" /> {t('vocabulary.session.correct')}
          </>
        ) : (
          t('vocabulary.session.incorrect')
        )}{' '}
        {!correct && (
          <span lang="ko" className="text-lg">
            {word.word}
          </span>
        )}
      </p>
      <WordFacts word={word} />
      <Button ref={ref} onClick={onContinue} className="self-end">
        {t('common.continue')} →
      </Button>
    </motion.div>
  )
}

// --- Flashcards --------------------------------------------------------------

export function FlashcardView({ word, onGrade }: StudyCardProps) {
  const { t } = useTranslation()
  const locale = useLocale()
  const [flipped, setFlipped] = useState(false)
  // Previewed when the card appears, so the buttons can show "1 min", "5 days"...
  const [now] = useState(() => new Date())
  const { data: preview } = useQuery({
    queryKey: ['srs', 'preview', word.id, now.getTime()],
    queryFn: () => previewItem(word.id, now),
    staleTime: 0,
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === ' ') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (flipped) {
        const index = Number(e.key) - 1
        if (index >= 0 && index < SRS_GRADES.length) onGrade(SRS_GRADES[index])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, onGrade])

  return (
    <div className="flex flex-col gap-4">
      {/* 3D flip: both faces share the space; the back starts rotated 180°. */}
      <div className="[perspective:1200px]">
        <motion.div
          className="relative grid [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-hidden={flipped}
            tabIndex={flipped ? -1 : 0}
            className={cn(
              cardShell,
              'col-start-1 row-start-1 flex min-h-64 flex-col items-center justify-center gap-4 [backface-visibility:hidden]',
            )}
          >
            <span lang="ko" className="text-6xl font-bold">
              {word.word}
            </span>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              {t('vocabulary.session.flipHint')}
            </span>
          </button>
          <div
            aria-hidden={!flipped}
            className={cn(
              cardShell,
              'col-start-1 row-start-1 flex min-h-64 flex-col gap-4 [backface-visibility:hidden] [transform:rotateY(180deg)]',
            )}
          >
            <BigWord word={word} />
            {flipped && <WordFacts word={word} />}
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!flipped ? (
          <motion.div
            key="show"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <Button onClick={() => setFlipped(true)} className="px-8 py-3">
              {t('vocabulary.session.show')}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="grades"
            className="grid grid-cols-4 gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {SRS_GRADES.map((grade, i) => (
              <motion.button
                key={grade}
                type="button"
                variants={pop}
                whileTap={{ scale: 0.92 }}
                onClick={() => onGrade(grade)}
                className={cn(
                  'flex flex-col items-center rounded-lg px-2 py-3 font-semibold text-white shadow-paper',
                  GRADE_STYLE[grade],
                )}
              >
                <span>
                  <span className="mr-1 text-xs opacity-75">{i + 1}</span>
                  {t(`vocabulary.session.grades.${grade}`)}
                </span>
                <span className="text-xs font-normal opacity-90">
                  {preview ? formatInterval(now, preview[grade], locale) : '…'}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Multiple choice ---------------------------------------------------------

export function ChoiceView({ word, onGrade }: StudyCardProps) {
  const { t } = useTranslation()
  const locale = useLocale()
  const l = useLocalized()
  const choices = useMemo(() => meaningChoices(word, locale), [word, locale])
  const [picked, setPicked] = useState<string | null>(null)
  const correct = picked === word.id

  useEffect(() => {
    if (picked) return
    const onKey = (e: KeyboardEvent) => {
      const index = Number(e.key) - 1
      if (index >= 0 && index < choices.length) setPicked(choices[index].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [picked, choices])

  return (
    <div className="flex flex-col gap-4">
      <div className={cn(cardShell, 'flex flex-col items-center gap-2')}>
        <BigWord word={word} />
        <p className="text-sm text-ink-500 dark:text-ink-400">
          {t('vocabulary.session.choicePrompt')}
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {choices.map((choice, i) => {
          const isAnswer = choice.id === word.id
          const isPicked = choice.id === picked
          return (
            <motion.button
              key={choice.id}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(choice.id)}
              whileHover={picked ? undefined : { scale: 1.02 }}
              whileTap={picked ? undefined : { scale: 0.97 }}
              animate={
                picked && isPicked && !isAnswer
                  ? shake
                  : picked && isAnswer
                    ? { scale: [1, 1.05, 1] }
                    : {}
              }
              className={cn(
                'flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors',
                picked && isAnswer
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                  : picked && isPicked
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50'
                    : 'border-ink-200 bg-white hover:border-pine-400 dark:border-ink-700 dark:bg-ink-900',
                picked && !isAnswer && !isPicked && 'opacity-50',
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs dark:bg-ink-700">
                {i + 1}
              </span>
              {l(choice.meaning)}
            </motion.button>
          )
        })}
      </div>
      {picked && (
        <Verdict
          correct={correct}
          word={word}
          onContinue={() => onGrade(correct ? 'good' : 'again')}
        />
      )}
    </div>
  )
}

// --- Typing and listening ------------------------------------------------------

export function AnswerInputView({
  word,
  onGrade,
  listening,
}: StudyCardProps & { listening: boolean }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ReturnType<typeof checkAnswer> | null>(
    null,
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    if (listening) speakKorean(word.word, { rate })
  }, [listening, word.word, rate])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (result || value.trim() === '') return
    setResult(checkAnswer(value, word.word))
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          cardShell,
          'flex flex-col items-center gap-3 text-center',
        )}
      >
        {listening ? (
          <motion.div variants={pop} initial="hidden" animate="visible">
            <AudioButton
              text={word.word}
              label={t('vocabulary.session.playAgain')}
              className="h-20 w-20 [&_svg]:h-9 [&_svg]:w-9"
            />
          </motion.div>
        ) : (
          <p className="text-3xl font-semibold">{l(word.meaning)}</p>
        )}
        <p className="text-sm text-ink-500 dark:text-ink-400">
          {listening
            ? t('vocabulary.session.listenPrompt')
            : t('vocabulary.session.typePrompt')}
        </p>
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <label className="sr-only" htmlFor={`answer-${word.id}`}>
          {t('vocabulary.session.answerLabel')}
        </label>
        <motion.input
          ref={inputRef}
          id={`answer-${word.id}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={result !== null}
          lang="ko"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          animate={result && !result.correct ? shake : {}}
          className={cn(
            'min-w-0 flex-1 rounded-lg border-2 bg-white px-5 py-3 text-xl dark:bg-ink-900',
            result
              ? result.correct
                ? 'border-emerald-500'
                : 'border-rose-500'
              : 'border-ink-300 dark:border-ink-600',
          )}
        />
        {!result && (
          <Button type="submit" disabled={value.trim() === ''}>
            {t('vocabulary.session.check')}
          </Button>
        )}
      </form>

      {/* Jamo-level diff: which syllables of the answer were wrong. */}
      {result?.similarity && !result.correct && (
        <p
          lang="ko"
          className="flex justify-center gap-1 text-2xl"
          aria-hidden="true"
        >
          {result.similarity.syllables.map((s, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: positional diff of a fixed string
              key={i}
              className={cn(
                'rounded px-1',
                s.status === 'correct' &&
                  'text-emerald-600 dark:text-emerald-400',
                s.status === 'partial' &&
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
                s.status === 'wrong' &&
                  'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
              )}
            >
              {s.char}
            </span>
          ))}
        </p>
      )}

      {result && (
        <Verdict
          correct={result.correct}
          word={word}
          onContinue={() => onGrade(result.correct ? 'good' : 'again')}
        />
      )}
    </div>
  )
}
