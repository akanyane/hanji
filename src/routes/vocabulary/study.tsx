import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useDecks } from '../../db/queries'
import type { StudyMode } from '../../db/types'
import { useDeckLabel } from '../../features/vocabulary/hooks'
import { resolveDeck } from '../../features/vocabulary/logic'
import { STUDY_MODES } from '../../features/vocabulary/ModePicker'
import { StudySession } from '../../features/vocabulary/StudySession'

interface StudySearch {
  deck?: string
  /** Flashcards are the default and are left out of the URL. */
  mode?: Exclude<StudyMode, 'flashcards'>
}

export const Route = createFileRoute('/vocabulary/study')({
  validateSearch: (search: Record<string, unknown>): StudySearch => ({
    deck:
      typeof search.deck === 'string' && search.deck !== ''
        ? search.deck
        : undefined,
    mode:
      STUDY_MODES.includes(search.mode as StudyMode) &&
      search.mode !== 'flashcards'
        ? (search.mode as StudySearch['mode'])
        : undefined,
  }),
  component: StudyPage,
})

function StudyPage() {
  const { deck: deckId = 'all', mode = 'flashcards' } = Route.useSearch()
  const { data: customDecks = [] } = useDecks()
  const label = useDeckLabel()
  // Bumped to start a fresh session with the same deck.
  const [round, setRound] = useState(0)
  const deck = resolveDeck(deckId, customDecks) ?? resolveDeck('all', [])

  if (!deck) return null
  return (
    <StudySession
      key={`${deck.id}-${mode}-${round}`}
      deck={deck}
      deckLabel={label(deck)}
      mode={mode}
      onRestart={() => setRound((r) => r + 1)}
    />
  )
}
