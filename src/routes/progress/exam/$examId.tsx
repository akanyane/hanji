import { createFileRoute, notFound } from '@tanstack/react-router'
import { ExamRunner } from '../../../features/progress/MockExam'

export const Route = createFileRoute('/progress/exam/$examId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { getMockExam } = await import('../../../content/topik/mock')
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
