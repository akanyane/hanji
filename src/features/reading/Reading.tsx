import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  QuizSession,
  type SessionQuestion,
} from '../../components/exercise/QuizSession'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import {
  cardHover,
  cardTap,
  fadeUp,
  pop,
  stagger,
} from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { SpeedControl } from '../../components/ui/SpeedControl'
import {
  parseReading,
  plainText,
  READING_TEXTS,
  type ReadingText,
} from '../../content/reading/texts'
import { getWord } from '../../content/vocabulary'
import {
  useAddToSrs,
  useQuizSummaries,
  useRecordQuizAttempt,
  useSrsCards,
} from '../../db/queries'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { romanize } from '../../lib/romanization/romanize'
import { speakSequence } from '../../services/speech'
import { useSettings } from '../../stores/settings'

export function ReadingList() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { data: summaries = {} } = useQuizSummaries('reading:')
  return (
    <motion.ul
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0, 0.05)}
      initial="hidden"
      animate="visible"
    >
      {READING_TEXTS.map((text) => {
        const summary = summaries[`reading:${text.id}`]
        return (
          <motion.li key={text.id} variants={fadeUp}>
            <Link
              to="/reading/$textId"
              params={{ textId: text.id }}
              className="block h-full rounded-2xl"
            >
              <motion.div
                whileHover={cardHover}
                whileTap={cardTap}
                className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <span className="text-xs font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
                  {t('vocabulary.deck.level', { level: text.level })}
                </span>
                <span className="font-semibold">📖 {l(text.title)}</span>
                <span
                  lang="ko"
                  className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300"
                >
                  {plainText(text.paragraphs[0].ko)}
                </span>
                {summary && (
                  <span className="mt-auto self-start rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
                    {t('grammar.home.bestScore', {
                      score: summary.bestScore,
                      total: text.questions.length,
                    })}
                  </span>
                )}
              </motion.div>
            </Link>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}

/** Popover for a clicked glossary word. */
function GlossaryCard({
  text,
  wordKey,
  surface,
  onClose,
}: {
  text: ReadingText
  wordKey: string
  surface: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const vocab = getWord(wordKey)
  const local = text.glossary[wordKey]
  const base = vocab?.word ?? local?.base ?? surface
  const meaning = vocab ? l(vocab.meaning) : local ? l(local.meaning) : ''
  const { data: cards } = useSrsCards()
  const { mutate: add, isSuccess } = useAddToSrs()
  const inSrs = Boolean(vocab && cards?.some((c) => c.itemId === vocab.id))
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => closeRef.current?.focus(), [])

  return (
    <motion.div
      role="dialog"
      aria-label={base}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p lang="ko" className="text-3xl font-bold">
            {base}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {romanize(base)}
          </p>
        </div>
        <AudioButton text={base} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t('reading.glossary.close')}
          className="rounded-full px-2 text-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          ✕
        </button>
      </div>
      <p className="text-lg">{meaning}</p>
      {vocab && (
        <div className="flex flex-wrap items-center gap-3">
          {inSrs || isSuccess ? (
            <motion.span
              variants={pop}
              initial="hidden"
              animate="visible"
              className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
            >
              ✓{' '}
              {isSuccess
                ? t('reading.glossary.added')
                : t('reading.glossary.alreadyAdded')}
            </motion.span>
          ) : (
            <Button
              className="px-4 py-1.5 text-sm"
              onClick={() => add(vocab.id)}
            >
              + {t('reading.glossary.addToSrs')}
            </Button>
          )}
          <Link
            to="/vocabulary/word/$wordId"
            params={{ wordId: vocab.id }}
            className="text-sm text-sky-700 hover:underline dark:text-sky-400"
          >
            {t('reading.glossary.openWord')} →
          </Link>
        </div>
      )}
    </motion.div>
  )
}

export function ReadingPage({ text }: { text: ReadingText }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const voice = useKoreanVoice()
  const { mutate: save } = useRecordQuizAttempt()
  const [selected, setSelected] = useState<{
    key: string
    surface: string
  } | null>(null)
  const [playing, setPlaying] = useState<number | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [quiz, setQuiz] = useState<'idle' | 'running' | 'done'>('idle')
  const [score, setScore] = useState(0)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopRef.current?.(), [])
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const toggleAudio = () => {
    if (playing !== null) {
      stopRef.current?.()
      setPlaying(null)
      return
    }
    stopRef.current = speakSequence(
      text.paragraphs.map((p) => ({ text: plainText(p.ko) })),
      { rate, onLine: setPlaying, onEnd: () => setPlaying(null) },
    )
  }

  const questions = useMemo<SessionQuestion[]>(
    () =>
      text.questions.map((q, i) => ({
        id: `${text.id}-${i}`,
        answerId: String(q.answer),
        choices: q.choices.map((c, ci) => ({ id: String(ci), label: l(c) })),
        prompt: <span className="text-xl font-semibold">{l(q.question)}</span>,
      })),
    [text, l],
  )

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Link
        to="/reading"
        className="self-start text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
      >
        ← {t('reading.back')}
      </Link>
      <motion.h2 variants={fadeUp} className="text-2xl font-bold">
        {l(text.title)}{' '}
        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
          · {t('vocabulary.deck.level', { level: text.level })}
        </span>
      </motion.h2>
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3"
      >
        <Button onClick={toggleAudio} disabled={voice === 'unsupported'}>
          {playing !== null
            ? `⏹ ${t('reading.stop')}`
            : `▶ ${t('reading.listen')}`}
        </Button>
        <SpeedControl />
        <Button
          variant="secondary"
          onClick={() => setShowTranslation((s) => !s)}
          aria-pressed={showTranslation}
        >
          {showTranslation
            ? t('reading.hideTranslation')
            : t('reading.showTranslation')}
        </Button>
      </motion.div>

      <motion.article
        variants={fadeUp}
        className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-800"
      >
        {text.paragraphs.map((paragraph, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are a fixed sequence
            key={i}
            className={cn(
              'flex flex-col gap-1 rounded-xl p-2 transition-colors',
              playing === i && 'bg-sky-50 dark:bg-sky-950/40',
            )}
          >
            <p lang="ko" className="text-xl leading-loose">
              {parseReading(paragraph.ko).map((token, ti) =>
                token.key ? (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: tokens are a fixed sequence
                    key={ti}
                    type="button"
                    onClick={() =>
                      setSelected({ key: token.key, surface: token.text })
                    }
                    className="rounded decoration-sky-400 decoration-dotted decoration-2 underline-offset-4 hover:bg-sky-100 hover:underline focus-visible:bg-sky-100 underline dark:hover:bg-sky-900"
                  >
                    {token.text}
                  </button>
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: tokens are a fixed sequence
                  <span key={ti}>{token.text}</span>
                ),
              )}
            </p>
            <AnimatePresence>
              {showTranslation && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-slate-600 dark:text-slate-300"
                >
                  {l(paragraph.translation)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.article>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
      >
        <h3 className="text-lg font-semibold">{t('reading.questions')}</h3>
        {quiz === 'idle' && (
          <Button
            className="self-center px-8"
            onClick={() => setQuiz('running')}
          >
            {t('reading.start')}
          </Button>
        )}
        {quiz === 'running' && (
          <QuizSession
            questions={questions}
            onComplete={(s) => {
              setScore(s)
              setQuiz('done')
              save({
                quizId: `reading:${text.id}`,
                filter: 'all',
                score: s,
                total: questions.length,
              })
            }}
          />
        )}
        {quiz === 'done' && (
          <motion.div
            variants={pop}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col items-center gap-2"
            role="status"
          >
            {score === questions.length && <Confetti />}
            <p className="text-4xl font-extrabold">
              <AnimatedNumber value={score} />
              <span className="text-xl text-slate-400">
                /{questions.length}
              </span>
            </p>
            <p className="font-semibold">
              {t('reading.score', { score, total: questions.length })}
            </p>
          </motion.div>
        )}
      </motion.section>

      <AnimatePresence>
        {selected && (
          <GlossaryCard
            key={selected.key}
            text={text}
            wordKey={selected.key}
            surface={selected.surface}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
