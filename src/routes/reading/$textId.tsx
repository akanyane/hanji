import { createFileRoute, notFound } from '@tanstack/react-router'
import { ReadingPage } from '../../features/reading/Reading'

export const Route = createFileRoute('/reading/$textId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { getReadingText } = await import('../../content/reading/texts')
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
