import { createFileRoute, notFound } from '@tanstack/react-router'
import { getMockExam } from '../../../content/topik/mock'
import { ExamRunner } from '../../../features/progress/MockExam'

export const Route = createFileRoute('/progress/exam/$examId')({
  loader: ({ params }) => {
    const exam = getMockExam(params.examId)
    if (!exam) throw notFound()
    return exam
  },
  component: ExamRoute,
})

function ExamRoute() {
  const exam = Route.useLoaderData()
  return <ExamRunner key={exam.id} exam={exam} />
}
