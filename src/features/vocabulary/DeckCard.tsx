import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cardHover, cardTap } from '../../components/motion/presets'
import { THEMES } from '../../content/vocabulary'
import type { StudyMode } from '../../db/types'
import { useDeckLabel } from './hooks'
import type { DeckCounts, ResolvedDeck } from './logic'

const KIND_ICON = { all: '📚', level: '🎯', custom: '⭐' } as const

export function DeckCard({
  deck,
  counts,
  mode,
}: {
  deck: ResolvedDeck
  counts: DeckCounts
  mode: StudyMode
}) {
  const { t } = useTranslation()
  const label = useDeckLabel()
  const icon =
    deck.kind === 'theme' && deck.theme
      ? THEMES[deck.theme].icon
      : KIND_ICON[deck.kind as keyof typeof KIND_ICON]

  return (
    <motion.div
      whileHover={cardHover}
      whileTap={cardTap}
      className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            <span aria-hidden="true">{icon}</span> {label(deck)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('vocabulary.deck.words', { count: counts.total })}
          </p>
        </div>
        {deck.kind === 'custom' && (
          <Link
            to="/vocabulary/decks/$deckId"
            params={{ deckId: deck.id }}
            className="text-sm text-sky-700 hover:underline dark:text-sky-400"
          >
            {t('vocabulary.deck.edit')}
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
          {t('vocabulary.deck.due', { count: counts.due })}
        </span>
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
          {t('vocabulary.deck.fresh', { count: counts.fresh })}
        </span>
      </div>
      <Link
        to="/vocabulary/study"
        search={{
          deck: deck.id,
          mode: mode === 'flashcards' ? undefined : mode,
        }}
        aria-label={`${t('vocabulary.deck.study')}: ${label(deck)}`}
        className="mt-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-md hover:brightness-110"
      >
        {t('vocabulary.deck.study')} →
      </Link>
    </motion.div>
  )
}
