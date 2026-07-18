import { useCallback, useEffect, useMemo, useState } from 'react'
import { hangulData } from '../data'
import { useProgress } from '../hooks/useProgress'
import type { HangulCategory } from '../types/hangul'
import { CATEGORY_LABELS } from '../types/hangul'
import { filterEntries } from '../utils/filter'
import { generateQuiz, type QuizQuestion, scoreAnswer } from '../utils/quiz'

const QUESTION_COUNT = 10
const CHOICE_COUNT = 4
const CATEGORIES: (HangulCategory | 'all')[] = [
  'all',
  'vowel',
  'consonant',
  'final',
  'syllable',
]

export function QuizView() {
  const { progress, recordAttempt } = useProgress()
  const [category, setCategory] = useState<HangulCategory | 'all'>('all')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)

  const pool = useMemo(
    () => filterEntries(hangulData, { category, query: '' }),
    [category],
  )

  const startQuiz = () => {
    setQuestions(generateQuiz(pool, QUESTION_COUNT, CHOICE_COUNT))
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
      const correct = scoreAnswer(currentQuestion, choiceId)
      const nextScore = correct ? score + 1 : score

      window.setTimeout(() => {
        if (index + 1 < questions.length) {
          setIndex(index + 1)
          setSelectedId(null)
          setScore(nextScore)
        } else {
          setScore(nextScore)
          setFinished(true)
          recordAttempt(nextScore)
        }
      }, 600)
    },
    [
      selectedId,
      currentQuestion,
      score,
      index,
      questions.length,
      recordAttempt,
    ],
  )

  useEffect(() => {
    if (!currentQuestion || selectedId !== null) return

    const onKeyDown = (e: KeyboardEvent) => {
      const digit = Number(e.key)
      if (digit >= 1 && digit <= currentQuestion.choices.length) {
        handleAnswer(currentQuestion.choices[digit - 1].id)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentQuestion, selectedId, handleAnswer])

  if (questions.length === 0 || finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        {finished && (
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            You scored {score} / {questions.length}!
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-300">
          Best score: {progress.bestScore} · Attempts: {progress.attempts}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                category === c
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={startQuiz}
          disabled={pool.length < CHOICE_COUNT}
          className="rounded-md bg-sky-600 px-6 py-2 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {finished ? 'Play again' : 'Start quiz'}
        </button>
        {pool.length < CHOICE_COUNT && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Not enough characters in this category to quiz on.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <p className="text-slate-500 dark:text-slate-400">
        Question {index + 1} / {questions.length} · Score: {score}
      </p>
      <span className="text-7xl font-semibold text-slate-900 dark:text-slate-50">
        {currentQuestion.entry.hangul}
      </span>
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {currentQuestion.choices.map((choice, i) => {
          const isCorrect = choice.id === currentQuestion.entry.id
          const isSelected = choice.id === selectedId
          const showResult = selectedId !== null

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleAnswer(choice.id)}
              disabled={showResult}
              className={`rounded-md border px-4 py-3 font-medium transition ${
                showResult && isCorrect
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                  : showResult && isSelected
                    ? 'border-rose-500 bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="mr-1 text-xs text-slate-400">{i + 1}.</span>
              {choice.romanization || '(silent)'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
