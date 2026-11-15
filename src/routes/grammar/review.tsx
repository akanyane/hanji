import { createFileRoute } from '@tanstack/react-router'
import { grammarCardsQuery } from '../../db/queries'
import { GrammarReview } from '../../features/grammar/GrammarReview'

export const Route = createFileRoute('/grammar/review')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(grammarCardsQuery),
  component: () => <GrammarReview />,
})
