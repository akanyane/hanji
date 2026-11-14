import { createFileRoute } from '@tanstack/react-router'
import { DeckEditor } from '../../../features/vocabulary/DeckEditor'

export const Route = createFileRoute('/vocabulary/decks/new')({
  component: () => <DeckEditor />,
})
