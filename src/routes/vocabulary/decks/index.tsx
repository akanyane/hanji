import { createFileRoute } from '@tanstack/react-router'
import { DecksPage } from '../../../features/vocabulary/DecksPage'

export const Route = createFileRoute('/vocabulary/decks/')({
  component: DecksPage,
})
