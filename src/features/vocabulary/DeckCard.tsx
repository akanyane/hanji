import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { cardHover, cardTap } from '../../components/motion/presets'
import { THEMES } from '../../content/vocabulary'
import type { StudyMode } from '../../db/types'
import { useDeckLabel } from './hooks'
import type { DeckCounts, ResolvedDeck } from './logic'

const KIND_ICON = { all: '전체', level: '급', custom: '나의' } as const

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
      className="flex h-full flex-col gap-3 rounded-lg border border-ink-200 bg-white p-4 shadow-paper dark:border-ink-700 dark:bg-ink-900"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            <span
              aria-hidden="true"
              lang="ko"
              className="mr-1.5 font-serif text-sm font-normal text-seal-600 dark:text-seal-400"
            >
              {icon}
            </span>
            {label(deck)}
          </p>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {t('vocabulary.deck.words', { count: counts.total })}
          </p>
        </div>
        {deck.kind === 'custom' && (
          <Link
            to="/vocabulary/decks/$deckId"
            params={{ deckId: deck.id }}
            className="text-sm text-pine-700 hover:underline dark:text-pine-400"
          >
            {t('vocabulary.deck.edit')}
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
          {t('vocabulary.deck.due', { count: counts.due })}
        </span>
        <span className="rounded-full bg-pine-100 px-2 py-0.5 text-pine-800 dark:bg-pine-900/50 dark:text-pine-200">
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
        className="mt-auto inline-flex items-center justify-center rounded-full panel-ink px-4 py-1.5 text-sm font-medium text-white shadow-paper hover:brightness-110"
      >
        {t('vocabulary.deck.study')} →
      </Link>
    </motion.div>
  )
}
