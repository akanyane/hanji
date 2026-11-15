import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
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
import { hangulData } from '../../content/hangul'
import { READING_WORDS } from '../../content/hangul/readingWords'
import { useQuizSummary, useRecordQuizAttempt } from '../../db/queries'
import { QUIZ_IDS } from '../../db/quizAttempts'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { generateQuiz } from '../../lib/quiz/quiz'
import { romanize } from '../../lib/romanization/romanize'
import { speakKorean } from '../../services/speech'
import { useSettings } from '../../stores/settings'
import { CategoryChips } from './FilterBar'
import { type CategoryFilter, filterEntries } from './filter'
import { entrySound, soundKey } from './sound'

export type QuizMode = 'recognize' | 'listen' | 'read'

const QUESTION_COUNT = 10
const CHOICE_COUNT = 4
const MODE_ICONS: Record<QuizMode, string> = {
  recognize: '보기',
  listen: '듣기',
  read: '읽기',
}
const MODE_QUIZ_ID: Record<QuizMode, string> = {
  recognize: QUIZ_IDS.hangulBasic,
  listen: QUIZ_IDS.hangulListen,
  read: QUIZ_IDS.hangulRead,
}
/** "Listen" skips finals: a lone final ㄱ and initial ㄱ look identical as choices. */
const LISTEN_CATEGORIES: CategoryFilter[] = [
  'all',
  'vowel',
  'consonant',
  'syllable',
]

interface HangulQuizProps {
  mode: QuizMode
  category: CategoryFilter
  onModeChange: (mode: QuizMode) => void
  onCategoryChange: (category: CategoryFilter) => void
}

export function HangulQuiz({
  mode,
  category,
  onModeChange,
  onCategoryChange,
}: HangulQuizProps) {
  const { t } = useTranslation()
  const l = useLocalized()
  const voice = useKoreanVoice()
  const rate = useSettings((s) => s.speechRate)
  const quizId = MODE_QUIZ_ID[mode]
  const { data: summary } = useQuizSummary(quizId)
  const { mutate: saveAttempt } = useRecordQuizAttempt()
  const [questions, setQuestions] = useState<SessionQuestion[] | null>(null)
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null,
  )
  // Bumped on every start so a replay remounts the session.
  const [round, setRound] = useState(0)

  const listenUnavailable = mode === 'listen' && voice === 'unsupported'
  const effectiveCategory =
    mode === 'listen' && category === 'final' ? 'all' : category

  const pool = useMemo(() => {
    const entries = filterEntries(hangulData, {
      category: effectiveCategory,
      query: '',
    })
    return mode === 'listen'
      ? entries.filter((e) => e.category !== 'final')
      : entries
  }, [effectiveCategory, mode])
  const canStart =
    mode === 'read' || (pool.length >= CHOICE_COUNT && !listenUnavailable)

  function buildQuestions(): SessionQuestion[] {
    if (mode === 'read') {
      const items = READING_WORDS.map((w) => ({
        ...w,
        id: w.word,
        romanized: romanize(w.word),
      }))
      return generateQuiz(items, {
        questionCount: QUESTION_COUNT,
        choiceCount: CHOICE_COUNT,
        answerKey: (w) => w.romanized,
      }).map(({ answer, choices }) => ({
        id: answer.id,
        answerId: answer.id,
        choices: choices.map((c) => ({ id: c.id, label: c.romanized })),
        prompt: (
          <span lang="ko" className="text-6xl font-bold">
            {answer.word}
          </span>
        ),
        reveal: (
          <p className="text-sm">
            <span lang="ko">{answer.word}</span> = {answer.romanized} ·{' '}
            {t('hangul.quiz.meaning', { meaning: l(answer.meaning) })}
          </p>
        ),
      }))
    }

    if (mode === 'listen') {
      return generateQuiz(pool, {
        questionCount: QUESTION_COUNT,
        choiceCount: CHOICE_COUNT,
        groupOf: (e) => e.category,
        answerKey: soundKey,
      }).map(({ answer, choices }) => {
        const sound = entrySound(answer)
        return {
          id: answer.id,
          answerId: answer.id,
          choices: choices.map((c) => ({
            id: c.id,
            label: c.hangul,
            lang: 'ko',
          })),
          onShow: () => speakKorean(sound, { rate }),
          prompt: (
            <motion.div
              variants={pop}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-2"
            >
              <AudioButton
                text={sound}
                label={t('hangul.quiz.playSound')}
                className="h-20 w-20 [&_svg]:h-9 [&_svg]:w-9"
              />
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {t('hangul.quiz.playSound')}
              </span>
            </motion.div>
          ),
          reveal: (
            <p lang="ko" className="text-sm">
              {answer.hangul} → {sound} (
              {answer.romanization || t('common.silent')})
            </p>
          ),
        }
      })
    }

    return generateQuiz(pool, {
      questionCount: QUESTION_COUNT,
      choiceCount: CHOICE_COUNT,
      groupOf: (e) => e.category,
      answerKey: (e) => e.romanization,
    }).map(({ answer, choices }) => ({
      id: answer.id,
      answerId: answer.id,
      choices: choices.map((c) => ({
        id: c.id,
        label: c.romanization || t('common.silent'),
      })),
      prompt: (
        <>
          <span lang="ko" className="text-7xl font-bold">
            {answer.hangul}
          </span>
          {/* Without this label, initial ㄱ and final ㄱ would look identical. */}
          <span className="text-sm text-ink-500 dark:text-ink-400">
            {t(`hangul.category.${answer.category}`)}
          </span>
        </>
      ),
    }))
  }

  function start() {
    setQuestions(buildQuestions())
    setResult(null)
    setRound((r) => r + 1)
  }

  function finish(score: number) {
    const total = questions?.length ?? 0
    setResult({ score, total })
    setQuestions(null)
    saveAttempt({
      quizId,
      filter: mode === 'read' ? 'all' : effectiveCategory,
      score,
      total,
    })
  }

  if (questions)
    return <QuizSession key={round} questions={questions} onComplete={finish} />

  const ratio =
    result === null || result.total === 0 ? 0 : result.score / result.total

  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-4 text-center"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      {result !== null && (
        <motion.div
          variants={pop}
          className="relative flex flex-col items-center gap-1"
          role="status"
        >
          {ratio >= 0.8 && <Confetti />}
          <p className="text-6xl font-extrabold">
            <AnimatedNumber value={result.score} />
            <span className="text-3xl text-ink-500">/{result.total}</span>
          </p>
          <p className="text-xl font-semibold">
            {t('hangul.quiz.finished', result)}
          </p>
          <p className="text-ink-600 dark:text-ink-300">
            {ratio === 1
              ? t('hangul.quiz.perfect')
              : ratio >= 0.6
                ? t('hangul.quiz.good')
                : t('hangul.quiz.keepGoing')}
          </p>
        </motion.div>
      )}

      <motion.fieldset
        variants={fadeUp}
        className="grid w-full gap-3 sm:grid-cols-3"
      >
        <legend className="sr-only">{t('hangul.quiz.modes')}</legend>
        {(['recognize', 'listen', 'read'] as const).map((m) => (
          <motion.button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => onModeChange(m)}
            whileHover={cardHover}
            whileTap={cardTap}
            className={cn(
              'flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-colors',
              mode === m
                ? 'border-pine-500 bg-pine-50 dark:bg-pine-950/40'
                : 'border-ink-200 bg-white hover:border-pine-300 dark:border-ink-700 dark:bg-ink-900',
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {MODE_ICONS[m]}
            </span>
            <span className="font-semibold">{t(`hangul.quiz.${m}.title`)}</span>
            <span className="text-sm text-ink-600 dark:text-ink-300">
              {t(`hangul.quiz.${m}.description`)}
            </span>
          </motion.button>
        ))}
      </motion.fieldset>

      {mode !== 'read' && (
        <motion.div variants={fadeUp}>
          <CategoryChips
            category={effectiveCategory}
            onCategoryChange={onCategoryChange}
            options={mode === 'listen' ? LISTEN_CATEGORIES : undefined}
          />
        </motion.div>
      )}

      <motion.p variants={fadeUp} className="text-ink-600 dark:text-ink-300">
        {t('hangul.quiz.summary', {
          best: summary?.bestScore ?? 0,
          attempts: summary?.attempts ?? 0,
        })}
      </motion.p>

      <motion.div variants={fadeUp}>
        <Button
          onClick={start}
          disabled={!canStart}
          className="px-8 py-3 text-lg"
        >
          {result === null
            ? t('hangul.quiz.start')
            : t('hangul.quiz.playAgain')}
        </Button>
      </motion.div>
      {listenUnavailable && (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t('hangul.quiz.listenUnsupported')}
        </p>
      )}
      {!listenUnavailable && !canStart && (
        <p className="text-sm text-ink-500 dark:text-ink-400">
          {t('hangul.quiz.notEnough')}
        </p>
      )}
    </motion.div>
  )
}
