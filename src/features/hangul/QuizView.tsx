import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import {
  CATEGORY_LABELS,
  type HangulEntry,
  hangulData,
} from '../../content/hangul'
import { useQuizSummary, useRecordQuizAttempt } from '../../db/queries'
import { QUIZ_IDS } from '../../db/quizAttempts'
import { cn } from '../../lib/cn'
import {
  generateQuiz,
  type QuizQuestion,
  scoreAnswer,
} from '../../lib/quiz/quiz'
import { CategoryChips } from './FilterBar'
import { type CategoryFilter, filterEntries } from './filter'

const QUESTION_COUNT = 10
const CHOICE_COUNT = 4
const FEEDBACK_MS = 600

interface QuizViewProps {
  category: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
}

export function QuizView({ category, onCategoryChange }: QuizViewProps) {
  const { data: summary } = useQuizSummary(QUIZ_IDS.hangulBasic)
  const { mutate: saveAttempt } = useRecordQuizAttempt()
  const [questions, setQuestions] = useState<QuizQuestion<HangulEntry>[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  // Cancel the pending auto-advance if the user leaves mid-feedback.
  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const pool = useMemo(
    () => filterEntries(hangulData, { category, query: '' }),
    [category],
  )

  const startQuiz = () => {
    setQuestions(
      generateQuiz(pool, {
        questionCount: QUESTION_COUNT,
        choiceCount: CHOICE_COUNT,
        groupOf: (e) => e.category,
        answerKey: (e) => e.romanization,
      }),
    )
    setIndex(0)
    setScore(0)
    setSelectedId(null)
    setFinished(false)
  }

  const currentQuestion = questions[index]

  const handleAnswer = useCallback(
    (choiceId: string) => {
      if (selectedId !== null || !currentQuestion) return
      setSelectedId(choiceId)
      const nextScore = scoreAnswer(currentQuestion, choiceId)
        ? score + 1
        : score

      timeoutRef.current = window.setTimeout(() => {
        setScore(nextScore)
        if (index + 1 < questions.length) {
          setIndex(index + 1)
          setSelectedId(null)
        } else {
          setFinished(true)
          saveAttempt({
            quizId: QUIZ_IDS.hangulBasic,
            filter: category,
            score: nextScore,
            total: questions.length,
          })
        }
      }, FEEDBACK_MS)
    },
    [
      selectedId,
      currentQuestion,
      score,
      index,
      questions.length,
      saveAttempt,
      category,
    ],
  )

  // Shortcuts: keys 1–4 pick the matching choice.
  useEffect(() => {
    if (!currentQuestion || selectedId !== null || finished) return

    const onKeyDown = (e: KeyboardEvent) => {
      const digit = Number(e.key)
      if (digit >= 1 && digit <= currentQuestion.choices.length) {
        handleAnswer(currentQuestion.choices[digit - 1].id)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentQuestion, selectedId, finished, handleAnswer])

  if (questions.length === 0 || finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        {finished && (
          <p className="text-xl font-semibold" role="status">
            Você acertou {score} de {questions.length}!
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-300">
          Melhor pontuação: {summary?.bestScore ?? 0} · Tentativas:{' '}
          {summary?.attempts ?? 0}
        </p>
        <CategoryChips
          category={category}
          onCategoryChange={onCategoryChange}
        />
        <Button onClick={startQuiz} disabled={pool.length < CHOICE_COUNT}>
          {finished ? 'Jogar de novo' : 'Começar quiz'}
        </Button>
        {pool.length < CHOICE_COUNT && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Não há caracteres suficientes nesta categoria para o quiz.
          </p>
        )}
      </div>
    )
  }

  const { answer } = currentQuestion

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 py-8">
      <div className="flex w-full flex-col gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Questão {index + 1} de {questions.length} · Acertos: {score}
        </p>
        <ProgressBar
          value={index}
          max={questions.length}
          label="Progresso do quiz"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span lang="ko" className="text-7xl font-semibold">
          {answer.hangul}
        </span>
        {/* Without this label, initial ㄱ and final ㄱ would look identical. */}
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {CATEGORY_LABELS[answer.category]}
        </span>
      </div>
      <p className="sr-only">
        Escolha a romanização correta. Use as teclas de 1 a 4.
      </p>
      <div className="grid w-full grid-cols-2 gap-3">
        {currentQuestion.choices.map((choice, i) => {
          const showResult = selectedId !== null
          const isCorrect = choice.id === answer.id
          const isSelected = choice.id === selectedId

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleAnswer(choice.id)}
              disabled={showResult}
              className={cn(
                'rounded-md border px-4 py-3 font-medium transition',
                showResult && isCorrect
                  ? 'border-emerald-600 bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                  : showResult && isSelected
                    ? 'border-rose-600 bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                    : 'border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700',
              )}
            >
              <span className="mr-1 text-xs text-slate-500 dark:text-slate-400">
                {i + 1}.
              </span>
              {choice.romanization || '(muda)'}
            </button>
          )
        })}
      </div>
      <p className="sr-only" aria-live="assertive">
        {selectedId === null
          ? ''
          : selectedId === answer.id
            ? 'Correto!'
            : `Incorreto. A resposta era ${answer.romanization || 'muda'}.`}
      </p>
    </div>
  )
}
