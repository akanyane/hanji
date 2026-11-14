import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fadeUp, stagger } from '../../components/motion/presets'
import { useDecks } from '../../db/queries'
import type { StudyMode } from '../../db/types'
import { DeckCard } from './DeckCard'
import { useDueDates } from './hooks'
import { builtInDecks, deckCounts, type ResolvedDeck } from './logic'
import { ModePicker } from './ModePicker'

function DeckGrid({ decks, mode }: { decks: ResolvedDeck[]; mode: StudyMode }) {
  const { dueDates } = useDueDates()
  const now = useMemo(() => new Date(), [])
  return (
    <motion.ul
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {decks.map((deck) => (
        <motion.li key={deck.id} variants={fadeUp}>
          <DeckCard
            deck={deck}
            counts={deckCounts(deck.itemIds, dueDates, now)}
            mode={mode}
          />
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function DecksPage() {
  const { t } = useTranslation()
  const { data: custom = [] } = useDecks()
  const [mode, setMode] = useState<StudyMode>('flashcards')
  const decks = builtInDecks()
  const levels = decks.filter((d) => d.kind === 'all' || d.kind === 'level')
  const themes = decks.filter((d) => d.kind === 'theme')
  const customDecks: ResolvedDeck[] = custom.map((d) => ({
    id: d.id,
    kind: 'custom',
    itemIds: d.itemIds,
    name: d.name,
  }))

  return (
    <div className="flex flex-col gap-8">
      <ModePicker mode={mode} onChange={setMode} />

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {t('vocabulary.deck.custom')}
          </h2>
          <Link
            to="/vocabulary/decks/new"
            className="rounded-full panel-ink px-4 py-1.5 text-sm font-medium text-white shadow-paper"
          >
            + {t('vocabulary.deck.create')}
          </Link>
        </div>
        {customDecks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink-300 p-6 text-center text-ink-500 dark:border-ink-600 dark:text-ink-400">
            {t('vocabulary.deck.empty')}
          </p>
        ) : (
          <DeckGrid decks={customDecks} mode={mode} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          {t('vocabulary.deck.levels')}{' '}
          <span className="text-sm font-normal text-ink-500 dark:text-ink-400">
            ({t('vocabulary.deck.levelHint')})
          </span>
        </h2>
        <DeckGrid decks={levels} mode={mode} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t('vocabulary.deck.themes')}</h2>
        <DeckGrid decks={themes} mode={mode} />
      </section>
    </div>
  )
}
