import { createFileRoute, notFound } from '@tanstack/react-router'
import { deckQuery } from '../../../db/queries'
import { DeckEditor } from '../../../features/vocabulary/DeckEditor'

export const Route = createFileRoute('/vocabulary/decks/$deckId')({
  loader: async ({ context, params }) => {
    const deck = await context.queryClient.ensureQueryData(
      deckQuery(params.deckId),
    )
    if (!deck) throw notFound()
    return deck
  },
  component: EditDeckPage,
})

function EditDeckPage() {
  const deck = Route.useLoaderData()
  return <DeckEditor key={deck.id} deck={deck} />
}
