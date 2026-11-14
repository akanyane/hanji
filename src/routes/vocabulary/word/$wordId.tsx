import { createFileRoute, notFound } from '@tanstack/react-router'
import { getWord } from '../../../content/vocabulary'
import { WordDetail } from '../../../features/vocabulary/WordDetail'

export const Route = createFileRoute('/vocabulary/word/$wordId')({
  loader: ({ params }) => {
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
