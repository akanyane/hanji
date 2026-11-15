import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import {
  cardHover,
  cardTap,
  fadeUp,
  pop,
  shake,
  stagger,
} from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { DIALOGUES, type Dialogue } from '../../content/listening/dialogues'
import { useRecordQuizAttempt } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { speakKorean } from '../../services/speech'
import { useSettings } from '../../stores/settings'
import { buildCompletion } from './completion'

export function DialoguesHome() {
  const { t } = useTranslation()
  const l = useLocalized()
  return (
    <motion.ul
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {DIALOGUES.map((d) => (
        <motion.li key={d.id} variants={fadeUp}>
          <Link
            to="/dialogues/$dialogueId"
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
              <span
                lang="ko"
                className="mt-1 line-clamp-1 text-sm text-ink-600 dark:text-ink-300"
              >
                {d.lines[0].ko}
              </span>
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  )
}

/** "Complete the dialogue": pick each line of the second speaker. */
export function CompleteDialogue({ dialogue }: { dialogue: Dialogue }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const { mutate: save } = useRecordQuizAttempt()
  const [round, setRound] = useState(0)
  // biome-ignore lint/correctness/useExhaustiveDependencies: round reshuffles the choices
  const steps = useMemo(() => buildCompletion(dialogue), [dialogue, round])
  const [stepIndex, setStepIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const step = steps[stepIndex]
  // Lines revealed so far: everything before the current gap (or all, when done).
  const visible = step
    ? dialogue.lines.slice(0, step.lineIndex + (picked ? 1 : 0))
    : dialogue.lines

  const choose = (choice: string) => {
    if (picked || !step) return
    setPicked(choice)
    if (choice === step.answer) setScore((s) => s + 1)
    speakKorean(step.answer, { rate, pitch: 1.35 })
  }

  const next = () => {
    const nextIndex = stepIndex + 1
    setPicked(null)
    setStepIndex(nextIndex)
    if (nextIndex >= steps.length)
      save({
        quizId: `dialogues:${dialogue.id}`,
        filter: 'all',
        score,
        total: steps.length,
      })
  }

  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-4 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 shadow-paper dark:bg-ink-900"
    >
      <div>
        <h3 className="text-lg font-semibold">{t('dialogues.complete')}</h3>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('dialogues.completeDescription')}
        </p>
      </div>

      <ol className="flex flex-col gap-2">
        {visible.map((line, i) => (
          <motion.li
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed sequence of lines
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'max-w-[85%] rounded-lg px-4 py-2',
              line.speaker === 1
                ? 'self-end bg-pine-100 dark:bg-pine-950/60'
                : 'bg-ink-100 dark:bg-ink-700',
            )}
          >
            <span className="block text-xs text-ink-500 dark:text-ink-400">
              {l(dialogue.speakers[line.speaker])}
            </span>
            <span lang="ko">{line.ko}</span>
          </motion.li>
        ))}
      </ol>

      {step ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm font-semibold">
              {t('dialogues.yourLine', { speaker: l(dialogue.speakers[1]) })}
            </p>
            {step.choices.map((choice) => {
              const isAnswer = choice === step.answer
              const isPicked = choice === picked
              return (
                <motion.button
                  key={choice}
                  type="button"
                  lang="ko"
                  disabled={picked !== null}
                  onClick={() => choose(choice)}
                  animate={picked && isPicked && !isAnswer ? shake : {}}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 text-left transition-colors',
                    picked && isAnswer
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                      : picked && isPicked
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50'
                        : 'border-ink-200 hover:border-pine-400 dark:border-ink-700',
                    picked && !isAnswer && !isPicked && 'opacity-50',
                  )}
                >
                  {choice}
                </motion.button>
              )
            })}
            {picked && (
              <Button className="self-end" onClick={next}>
                {t('common.continue')} →
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          variants={pop}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col items-center gap-2"
          role="status"
        >
          {score === steps.length && <Confetti />}
          <p className="text-4xl font-extrabold">
            <AnimatedNumber value={score} />
            <span className="text-xl text-ink-500">/{steps.length}</span>
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setRound((r) => r + 1)
              setStepIndex(0)
              setScore(0)
            }}
          >
            {t('grammar.lesson.retry')}
          </Button>
        </motion.div>
      )}
    </motion.section>
  )
}
