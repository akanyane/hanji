import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
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
import { notesForDialogue } from '../../content/culture/notes'
import { DIALOGUES, type Dialogue } from '../../content/listening/dialogues'
import { useQuizSummaries, useRecordQuizAttempt } from '../../db/queries'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { speakSequence } from '../../services/speech'
import { useSettings } from '../../stores/settings'
import { CultureCallout } from '../culture/CultureCallout'

/** Each speaker gets a slightly different pitch so voices are easy to tell apart. */
const PITCHES = [1, 1.35, 0.8]

export function DialogueList() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { data: summaries = {} } = useQuizSummaries('listening:dialogue:')
  return (
    <div className="flex flex-col gap-4">
      <p className="text-ink-600 dark:text-ink-300">
        {t('listening.dialogues.description')}
      </p>
      <motion.ul
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        variants={stagger(0, 0.05)}
        initial="hidden"
        animate="visible"
      >
        {DIALOGUES.map((d) => {
          const summary = summaries[`listening:dialogue:${d.id}`]
          return (
            <motion.li key={d.id} variants={fadeUp}>
              <Link
                to="/listening/dialogues/$dialogueId"
                params={{ dialogueId: d.id }}
                className="block h-full rounded-lg"
              >
                <motion.div
                  whileHover={cardHover}
                  whileTap={cardTap}
                  className="flex h-full flex-col gap-1 rounded-lg border border-ink-200 bg-white p-4 shadow-paper dark:border-ink-700 dark:bg-ink-900"
                >
                  <span className="font-semibold">{l(d.title)}</span>
                  <span className="text-sm text-ink-500 dark:text-ink-400">
                    {t('vocabulary.deck.level', { level: d.level })} ·{' '}
                    {d.speakers.map((s) => l(s)).join(' & ')}
                  </span>
                  {summary && (
                    <span className="mt-auto self-start rounded-full bg-pine-100 px-2 py-0.5 text-xs text-pine-800 dark:bg-pine-900/50 dark:text-pine-200">
                      {t('grammar.home.bestScore', {
                        score: summary.bestScore,
                        total: d.questions.length,
                      })}
                    </span>
                  )}
                </motion.div>
              </Link>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}

export function DialoguePage({
  dialogue,
  backTo = '/listening/dialogues',
  children,
}: {
  dialogue: Dialogue
  /** Where the "back" link goes (the dialogue is shared by two modules). */
  backTo?: '/listening/dialogues' | '/dialogues'
  /** Extra sections rendered after the questions. */
  children?: ReactNode
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const voice = useKoreanVoice()
  const { mutate: save } = useRecordQuizAttempt()
  const [playing, setPlaying] = useState<number | null>(null)
  const [showText, setShowText] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [quiz, setQuiz] = useState<'idle' | 'running' | 'done'>('idle')
  const [score, setScore] = useState(0)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopRef.current?.(), [])

  const playAll = () => {
    if (playing !== null) {
      stopRef.current?.()
      setPlaying(null)
      return
    }
    stopRef.current = speakSequence(
      dialogue.lines.map((line) => ({
        text: line.ko,
        pitch: PITCHES[line.speaker % PITCHES.length],
      })),
      { rate, onLine: setPlaying, onEnd: () => setPlaying(null) },
    )
  }

  const questions = useMemo<SessionQuestion[]>(
    () =>
      dialogue.questions.map((q, i) => ({
        id: `${dialogue.id}-${i}`,
        answerId: String(q.answer),
        choices: q.choices.map((c, ci) => ({ id: String(ci), label: l(c) })),
        prompt: <span className="text-xl font-semibold">{l(q.question)}</span>,
      })),
    [dialogue, l],
  )

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Link
        to={backTo}
        className="self-start text-sm font-medium text-pine-700 hover:underline dark:text-pine-400"
      >
        ← {t('listening.dialogues.back')}
      </Link>
      <motion.h2 variants={fadeUp} className="text-2xl font-bold">
        {l(dialogue.title)}
      </motion.h2>
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3"
      >
        <Button
          onClick={playAll}
          disabled={voice === 'unsupported'}
          className="px-6"
        >
          {playing !== null
            ? `⏹ ${t('listening.dialogues.stop')}`
            : `▶ ${t('listening.dialogues.playAll')}`}
        </Button>
        <SpeedControl />
        <Button
          variant="secondary"
          onClick={() => setShowText((s) => !s)}
          aria-pressed={showText}
        >
          {showText
            ? t('listening.dialogues.hideTranscript')
            : t('listening.dialogues.showTranscript')}
        </Button>
        {showText && (
          <Button
            variant="secondary"
            onClick={() => setShowTranslation((s) => !s)}
            aria-pressed={showTranslation}
          >
            {showTranslation
              ? t('listening.dialogues.hideTranslation')
              : t('listening.dialogues.showTranslation')}
          </Button>
        )}
      </motion.div>
      {voice === 'unsupported' && (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t('listening.unsupported')}
        </p>
      )}

      <motion.ol variants={fadeUp} className="flex flex-col gap-3">
        {dialogue.lines.map((line, i) => {
          const right = line.speaker % 2 === 1
          return (
            <motion.li
              // biome-ignore lint/suspicious/noArrayIndexKey: dialogue lines are a fixed sequence
              key={i}
              className={cn(
                'flex max-w-[85%] flex-col gap-1',
                right ? 'items-end self-end text-right' : 'items-start',
              )}
              animate={playing === i ? { scale: 1.03 } : { scale: 1 }}
            >
              <span className="text-xs text-ink-500 dark:text-ink-400">
                {l(dialogue.speakers[line.speaker])}
              </span>
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-3 shadow-paper transition-colors',
                  right ? 'flex-row-reverse rounded-br-sm' : 'rounded-bl-sm',
                  playing === i
                    ? 'bg-pine-500 text-white'
                    : right
                      ? 'bg-pine-100 dark:bg-pine-950/60'
                      : 'border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900',
                )}
              >
                <AudioButton
                  text={line.ko}
                  className="h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
                />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={showText ? 'text' : 'hidden'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    lang={showText ? 'ko' : undefined}
                    className="text-lg"
                  >
                    {showText ? line.ko : '• • •'}
                  </motion.span>
                </AnimatePresence>
              </div>
              {showText && showTranslation && (
                <span className="text-sm text-ink-600 dark:text-ink-300">
                  {l(line.translation)}
                </span>
              )}
            </motion.li>
          )
        })}
      </motion.ol>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 shadow-paper dark:bg-ink-900"
      >
        <h3 className="text-lg font-semibold">
          {t('listening.dialogues.questions')}
        </h3>
        {quiz === 'idle' && (
          <Button
            className="self-center px-8"
            onClick={() => setQuiz('running')}
          >
            {t('listening.dialogues.start')}
          </Button>
        )}
        {quiz === 'running' && (
          <QuizSession
            questions={questions}
            onComplete={(s) => {
              setScore(s)
              setQuiz('done')
              save({
                quizId: `listening:dialogue:${dialogue.id}`,
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
              <span className="text-xl text-ink-400">/{questions.length}</span>
            </p>
            <p className="font-semibold">
              {t('listening.dialogues.score', {
                score,
                total: questions.length,
              })}
            </p>
          </motion.div>
        )}
      </motion.section>
      <CultureCallout notes={notesForDialogue(dialogue.id)} />
      {children}
    </motion.div>
  )
}
