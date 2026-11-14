import { createFileRoute, notFound } from '@tanstack/react-router'
import { getLesson } from '../../content/grammar'
import { LessonPage } from '../../features/grammar/LessonPage'

export const Route = createFileRoute('/grammar/$lessonId')({
  loader: ({ params }) => {
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
