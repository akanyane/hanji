import { createFileRoute } from '@tanstack/react-router'
import { ExamList } from '../../../features/progress/MockExam'

export const Route = createFileRoute('/progress/exam/')({
  component: ExamList,
})
