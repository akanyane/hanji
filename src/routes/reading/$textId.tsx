import { createFileRoute, notFound } from '@tanstack/react-router'
import { getReadingText } from '../../content/reading/texts'
import { ReadingPage } from '../../features/reading/Reading'

export const Route = createFileRoute('/reading/$textId')({
  loader: ({ params }) => {
    const text = getReadingText(params.textId)
    if (!text) throw notFound()
    return text
  },
  component: TextRoute,
})

function TextRoute() {
  const text = Route.useLoaderData()
  return <ReadingPage key={text.id} text={text} />
}
