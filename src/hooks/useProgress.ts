import { useLocalStorage } from './useLocalStorage'

export interface QuizProgress {
  bestScore: number
  attempts: number
  lastPlayed: string | null
}

const initialProgress: QuizProgress = {
  bestScore: 0,
  attempts: 0,
  lastPlayed: null,
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<QuizProgress>(
    'hangul:quiz-progress',
    initialProgress,
  )

  const recordAttempt = (score: number) => {
    setProgress((current) => ({
      bestScore: Math.max(current.bestScore, score),
      attempts: current.attempts + 1,
      lastPlayed: new Date().toISOString(),
    }))
  }

  return { progress, recordAttempt }
}
