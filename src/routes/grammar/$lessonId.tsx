import { createFileRoute, notFound } from '@tanstack/react-router'
import { LessonPage } from '../../features/grammar/LessonPage'

export const Route = createFileRoute('/grammar/$lessonId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { getLesson } = await import('../../content/grammar')
    const lesson = getLesson(params.lessonId)
    if (!lesson) throw notFound()
    return lesson
  },
  component: LessonRoute,
})

function LessonRoute() {
  const lesson = Route.useLoaderData()
  return <LessonPage lesson={lesson} />
}
