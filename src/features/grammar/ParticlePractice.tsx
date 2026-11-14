import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pop, shake, spring } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import { useRecordPractice } from '../../db/queries'
import { cn } from '../../lib/cn'
import { makeParticleQuestion, type ParticleQuestion } from './particleQuiz'

export function ParticlePractice({ initial }: { initial?: ParticleQuestion }) {
  const { t } = useTranslation()
  const { mutate: record } = useRecordPractice()
  const [question, setQuestion] = useState<ParticleQuestion>(
    () => initial ?? makeParticleQuestion(),
  )
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [count, setCount] = useState(0)
  const nextRef = useRef<HTMLButtonElement>(null)
  const correct = picked === question.answer

  const pick = useCallback(
    (choice: string) => {
      if (picked) return
      setPicked(choice)
      record({
        skill: 'grammar',
        source: 'grammar:particles',
        correct: Number(choice === question.answer),
        total: 1,
      })
      if (choice === question.answer) {
        setStreak(streak + 1)
        setBest(Math.max(best, streak + 1))
      } else {
        setStreak(0)
      }
    },
    [picked, question.answer, streak, best, record],
  )

  const next = useCallback(() => {
    setQuestion(makeParticleQuestion())
    setPicked(null)
    setCount((c) => c + 1)
  }, [])

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
      if (!picked && (e.key === '1' || e.key === '2'))
        pick(question.choices[Number(e.key) - 1])
      else if (picked && e.key === 'Enter') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [picked, pick, next, question.choices])

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <p className="text-slate-600 dark:text-slate-300">
        {t('grammar.particles.description')}
      </p>

      <div className="flex justify-between text-sm font-medium">
        <motion.span
          key={streak}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={spring}
          className="rounded-full bg-orange-100 px-3 py-1 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
        >
          🔥 {t('grammar.particles.streak', { count: streak })}
        </motion.span>
        <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
          🏆 {t('grammar.particles.best', { count: best })}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, y: 20, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={spring}
          className="flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-sky-50 to-violet-50 p-8 dark:from-slate-800 dark:to-slate-800/40"
        >
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t(`grammar.particles.types.${question.type}`)}
          </span>
          <p lang="ko" className="text-5xl font-bold">
            {question.noun}
            <span
              className={cn(
                'ml-1 inline-block min-w-12 border-b-4 text-center',
                picked
                  ? correct
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-sky-500',
              )}
            >
              {picked ? question.answer : ' '}
            </span>
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {question.choices.map((choice, i) => {
          const isAnswer = choice === question.answer
          const isPicked = choice === picked
          return (
            <motion.button
              key={choice}
              type="button"
              lang="ko"
              disabled={picked !== null}
              onClick={() => pick(choice)}
              whileHover={picked ? undefined : { scale: 1.04 }}
              whileTap={picked ? undefined : { scale: 0.95 }}
              animate={
                picked && isPicked && !isAnswer
                  ? shake
                  : picked && isAnswer
                    ? { scale: [1, 1.08, 1] }
                    : {}
              }
              className={cn(
                'rounded-2xl border-2 py-4 text-3xl font-bold transition-colors',
                picked && isAnswer
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                  : picked && isPicked
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50'
                    : 'border-slate-200 bg-white hover:border-sky-400 dark:border-slate-700 dark:bg-slate-800',
              )}
            >
              <span className="mr-2 align-middle text-xs text-slate-400">
                {i + 1}
              </span>
              {choice}
            </motion.button>
          )
        })}
      </div>

      <div aria-live="assertive" className="min-h-28">
        {picked && (
          <motion.div
            variants={pop}
            initial="hidden"
            animate="visible"
            className={cn(
              'flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between',
              correct
                ? 'bg-emerald-50 dark:bg-emerald-950/50'
                : 'bg-rose-50 dark:bg-rose-950/50',
            )}
          >
            <div>
              <p className="font-semibold">
                {correct
                  ? `🎉 ${t('grammar.particles.correct')}`
                  : t('grammar.particles.incorrect', {
                      answer: question.answer,
                    })}
              </p>
              <p className="text-sm">
                {t(`grammar.particles.why.${question.reason}`, {
                  noun: question.noun,
                })}
              </p>
            </div>
            <Button ref={nextRef} onClick={next}>
              {t('grammar.particles.next')} →
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
