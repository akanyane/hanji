import {
  type ExamSection,
  estimateTopikLevel,
  type MockExam,
} from '../../content/topik/mock'

/** How many times each listening item can be played (TOPIK plays twice). */
export const MAX_PLAYS = 2

export const examQuizId = (examId: string) => `topik:${examId}`

/** Answers by question id: the ORIGINAL index of the chosen option (0 = right). */
export type ExamAnswers = Record<string, number>

export interface ExamResult {
  score: number
  max: number
  level: 0 | 1 | 2
  sections: Record<ExamSection, { correct: number; total: number }>
}

export function scoreExam(exam: MockExam, answers: ExamAnswers): ExamResult {
  const sections: ExamResult['sections'] = {
    listening: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
  }
  let score = 0
  let max = 0
  for (const q of exam.questions) {
    max += q.points
    sections[q.section].total++
    if (answers[q.id] === 0) {
      score += q.points
      sections[q.section].correct++
    }
  }
  return { score, max, level: estimateTopikLevel(score, max), sections }
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  return `${minutes}:${String(total % 60).padStart(2, '0')}`
}
