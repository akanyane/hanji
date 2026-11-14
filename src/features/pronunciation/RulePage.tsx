import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  QuizSession,
  type SessionQuestion,
} from '../../components/exercise/QuizSession'
import { AnimatedNumber } from '../../components/motion/AnimatedNumber'
import { Confetti } from '../../components/motion/Confetti'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { RULE_EXAMPLES } from '../../content/pronunciation/practice'
import { PRONUNCIATION_RULES } from '../../content/pronunciation/rules'
import { useRecordQuizAttempt } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import {
  type PronunciationRuleId,
  pronounce,
} from '../../lib/pronunciation/pronounce'
import { pronunciationChoices, pronunciationStages } from './logic'

function Quiz({ rule }: { rule: PronunciationRuleId }) {
  const { t } = useTranslation()
  const { mutate: save } = useRecordQuizAttempt()
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const words = RULE_EXAMPLES[rule]

  const questions = useMemo<SessionQuestion[]>(
    () =>
      words.map((word) => {
        const correct = pronounce(word).pronunciation
        return {
          id: `${round}-${word}`,
          answerId: correct,
          choices: pronunciationChoices(word).map((c) => ({
            id: c,
            label: `[${c}]`,
            lang: 'ko',
          })),
          prompt: (
            <span lang="ko" className="text-5xl font-bold">
              {word}
            </span>
          ),
          reveal: (
            <AudioButton
              text={word}
              className="mt-2 h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
            />
          ),
        }
      }),
    [words, round],
  )

  if (state === 'running') {
    return (
      <QuizSession
        key={round}
        questions={questions}
        onComplete={(s) => {
          setScore(s)
          setState('done')
          save({
            quizId: `pronunciation:${rule}`,
            filter: 'all',
            score: s,
            total: questions.length,
          })
        }}
      />
    )
  }
  if (state === 'done') {
    return (
      <motion.div
        variants={pop}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center gap-3 text-center"
        role="status"
      >
        {score === questions.length && <Confetti />}
        <p className="text-5xl font-extrabold">
          <AnimatedNumber value={score} />
          <span className="text-2xl text-ink-400">/{questions.length}</span>
        </p>
        <p className="font-semibold">
          {t('pronunciation.rule.score', { score, total: questions.length })}
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setRound((r) => r + 1)
            setState('running')
          }}
        >
          {t('pronunciation.rule.retry')}
        </Button>
      </motion.div>
    )
  }
  return (
    <div className="flex justify-center">
      <Button className="px-8 py-3 text-lg" onClick={() => setState('running')}>
        {t('pronunciation.rule.quizStart')}
      </Button>
    </div>
  )
}

export function RulePage({ rule }: { rule: PronunciationRuleId }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const info = PRONUNCIATION_RULES[rule]

  return (
    <motion.div
      key={rule}
      className="flex flex-col gap-5"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Link
        to="/pronunciation"
        className="self-start text-sm font-medium text-pine-700 hover:underline dark:text-pine-400"
      >
        ← {t('pronunciation.rule.back')}
      </Link>
      <motion.header
        variants={fadeUp}
        className="rounded-xl panel-ink p-6 text-white shadow-paper"
      >
        <p lang="ko" className="text-sm text-white/80">
          {info.korean}
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">{l(info.name)}</h1>
        <p className="mt-2 text-white/90">{l(info.summary)}</p>
      </motion.header>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 shadow-paper dark:bg-ink-900"
      >
        <h2 className="text-lg font-semibold">
          {t('pronunciation.rule.examples')}
        </h2>
        <ul className="flex flex-col gap-3">
          {RULE_EXAMPLES[rule].map((word) => {
            const stages = pronunciationStages(word)
            return (
              <li
                key={word}
                className="flex flex-wrap items-center gap-3 border-b border-ink-100 pb-3 last:border-0 dark:border-ink-700"
              >
                <AudioButton
                  text={word}
                  className="h-9 w-9 [&_svg]:h-4 [&_svg]:w-4"
                />
                <span
                  lang="ko"
                  className="flex flex-wrap items-center gap-2 text-xl"
                >
                  {stages.map((stage, i) => (
                    <span key={stage} className="flex items-center gap-2">
                      {i > 0 && <span className="text-ink-400">→</span>}
                      <span
                        className={
                          i === stages.length - 1
                            ? 'font-bold text-pine-700 dark:text-pine-300'
                            : undefined
                        }
                      >
                        {i === stages.length - 1 ? `[${stage}]` : stage}
                      </span>
                    </span>
                  ))}
                </span>
                <Link
                  to="/tools/pronunciation"
                  search={{ text: word }}
                  className="ml-auto text-sm text-pine-700 hover:underline dark:text-pine-400"
                >
                  {t('pronunciation.rule.openInTool')}
                </Link>
              </li>
            )
          })}
        </ul>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 shadow-paper dark:bg-ink-900"
      >
        <h2 className="text-lg font-semibold">
          {t('pronunciation.rule.quiz')}
        </h2>
        <Quiz key={rule} rule={rule} />
      </motion.section>
    </motion.div>
  )
}
