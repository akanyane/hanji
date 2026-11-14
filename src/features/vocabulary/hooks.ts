import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { THEMES } from '../../content/vocabulary'
import { useSrsCards } from '../../db/queries'
import { useLocalized } from '../../i18n/useLocalized'
import type { ResolvedDeck } from './logic'

/** Due date of every studied item, keyed by item id. */
export function useDueDates(): {
  dueDates: Map<string, Date>
  isLoading: boolean
} {
  const { data, isLoading } = useSrsCards()
  const dueDates = useMemo(
    () => new Map((data ?? []).map((c) => [c.itemId, c.dueAt])),
    [data],
  )
  return { dueDates, isLoading }
}

/** Display name for any deck, in the current language. */
export function useDeckLabel() {
  const { t } = useTranslation()
  const l = useLocalized()
  return (deck: ResolvedDeck): string => {
    switch (deck.kind) {
      case 'all':
        return t('vocabulary.deck.all')
      case 'level':
        return t('vocabulary.deck.level', { level: deck.level })
      case 'theme':
        return deck.theme ? l(THEMES[deck.theme].label) : ''
      case 'custom':
        return deck.name ?? ''
    }
  }
}
