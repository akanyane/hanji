import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { InkMark } from '../brand/InkMark'
import { pop, shake, spring } from '../motion/presets'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'

export interface SessionChoice {
  id: string
  label: string
  lang?: string
}

export interface SessionQuestion {
  id: string
  prompt: ReactNode
  choices: SessionChoice[]
  answerId: string
  /** Extra info shown after answering (e.g. a word's meaning). */
  reveal?: ReactNode
  /** Called when the question appears (e.g. to auto-play audio). */
  onShow?: () => void
}

interface QuizSessionProps {
  questions: SessionQuestion[]
  onComplete: (score: number) => void
  /** Called on every answer (e.g. to score questions by level). */
  onAnswer?: (questionId: string, correct: boolean) => void
  /** "list" stacks the choices, for long sentence choices. */
  layout?: 'grid' | 'list'
}

/**
 * Runs a multiple-choice session: one question at a time, keys 1–N to answer,
 * Enter to continue, animated feedback. Reusable by any module.
 */
export function QuizSession({
  questions,
  onComplete,
  onAnswer,
  layout = 'grid',
}: QuizSessionProps) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const continueRef = useRef<HTMLButtonElement>(null)
  const question = questions[index]
  const answered = selectedId !== null
  const correct = answered && selectedId === question.answerId

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once per question
  useEffect(() => {
    question?.onShow?.()
  }, [index])

  useEffect(() => {
    if (answered) continueRef.current?.focus()
  }, [answered])

  const answer = useCallback(
    (choiceId: string) => {
      if (answered) return
      setSelectedId(choiceId)
      if (choiceId === question.answerId) setScore((s) => s + 1)
      onAnswer?.(question.id, choiceId === question.answerId)
    },
    [answered, question, onAnswer],
  )

  const advance = useCallback(() => {
    if (!answered) return
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelectedId(null)
    } else {
      onComplete(score)
    }
  }, [answered, index, questions.length, onComplete, score])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLButtonElement &&
        (e.key === 'Enter' || e.key === ' ')
      )
        return
      if (!answered) {
        const digit = Number(e.key)
        if (digit >= 1 && digit <= question.choices.length)
          answer(question.choices[digit - 1].id)
      } else if (e.key === 'Enter') {
        advance()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [answered, question, answer, advance])

  if (!question) return null
  const answerChoice = question.choices.find((c) => c.id === question.answerId)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          {t('hangul.quiz.question', {
            current: index + 1,
            total: questions.length,
            score,
          })}
        </p>
        <ProgressBar
          value={index + (answered ? 1 : 0)}
          max={questions.length}
          label={t('hangul.quiz.progress')}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id + index}
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={spring}
        >
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg panel-paper p-6 dark:from-ink-800 dark:to-ink-800/40">
            {question.prompt}
          </div>
          <p className="sr-only">
            {t('hangul.quiz.instructions', { count: question.choices.length })}
          </p>
          <div
            className={cn(
              'grid gap-3',
              layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1',
            )}
          >
            {question.choices.map((choice, i) => {
              const isAnswer = choice.id === question.answerId
              const isSelected = choice.id === selectedId
              return (
                <motion.button
                  key={choice.id}
                  type="button"
                  onClick={() => answer(choice.id)}
                  disabled={answered}
                  whileHover={answered ? undefined : { scale: 1.03 }}
                  whileTap={answered ? undefined : { scale: 0.96 }}
                  animate={
                    answered && isSelected && !isAnswer
                      ? shake
                      : answered && isAnswer
                        ? { scale: [1, 1.08, 1] }
                        : {}
                  }
                  className={cn(
                    'flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left text-lg font-medium transition-colors',
                    answered && isAnswer
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-50'
                      : answered && isSelected
                        ? 'border-rose-500 bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-50'
                        : 'border-ink-200 bg-white hover:border-pine-400 dark:border-ink-700 dark:bg-ink-900',
                    answered && !isAnswer && !isSelected && 'opacity-50',
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs text-ink-500 dark:bg-ink-700 dark:text-ink-300">
                    {i + 1}
                  </span>
                  <span lang={choice.lang}>{choice.label}</span>
                  {answered && isAnswer && (
                    <motion.span
                      variants={pop}
                      initial="hidden"
                      animate="visible"
                      className="ml-auto"
                      aria-hidden="true"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div aria-live="assertive" className="min-h-24">
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
              className={cn(
                'flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between',
                correct
                  ? 'bg-emerald-50 dark:bg-emerald-950/50'
                  : 'bg-rose-50 dark:bg-rose-950/50',
              )}
            >
              <div>
                <p className="font-semibold">
                  {correct ? (
                    <>
                      <InkMark kind="correct" /> {t('hangul.quiz.correct')}
                    </>
                  ) : (
                    t('hangul.quiz.incorrect', {
                      answer: answerChoice?.label ?? '',
                    })
                  )}
                </p>
                {question.reveal}
              </div>
              <Button
                ref={continueRef}
                onClick={advance}
                title={t('hangul.quiz.continueHint')}
              >
                {t('common.continue')} →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
