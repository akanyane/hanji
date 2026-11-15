import { createFileRoute, notFound } from '@tanstack/react-router'
import { WordDetail } from '../../../features/vocabulary/WordDetail'

export const Route = createFileRoute('/vocabulary/word/$wordId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { getWord } = await import('../../../content/vocabulary')
    const word = getWord(params.wordId)
    if (!word) throw notFound()
    return word
  },
  component: WordPage,
})

function WordPage() {
  const word = Route.useLoaderData()
  return <WordDetail word={word} />
}
