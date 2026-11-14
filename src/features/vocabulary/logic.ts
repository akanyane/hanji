// Pure helpers for the vocabulary module (no React), all unit-tested.

import {
  THEMES,
  type ThemeId,
  type TopikLevel,
  VOCABULARY,
  type VocabWord,
} from '../../content/vocabulary'
import type { DeckRecord } from '../../db/types'
import type { Locale } from '../../i18n/locales'
import { isSyllable } from '../../lib/hangul'
import { shuffle } from '../../lib/quiz/quiz'
import { romanize } from '../../lib/romanization/romanize'
import {
  compareJamo,
  type SimilarityResult,
} from '../../lib/similarity/jamoSimilarity'
import { isDue } from '../../lib/srs/scheduler'

// --- Decks -----------------------------------------------------------------

export type DeckKind = 'all' | 'level' | 'theme' | 'custom'

export interface ResolvedDeck {
  id: string
  kind: DeckKind
  itemIds: string[]
  level?: TopikLevel
  theme?: ThemeId
  /** Only for custom decks (built-in names come from translations). */
  name?: string
}

export const LEVELS: TopikLevel[] = [
  ...new Set(VOCABULARY.map((w) => w.level)),
].sort()

const ids = (words: VocabWord[]) => words.map((w) => w.id)

export function builtInDecks(): ResolvedDeck[] {
  return [
    { id: 'all', kind: 'all', itemIds: ids(VOCABULARY) },
    ...LEVELS.map((level) => ({
      id: `level-${level}`,
      kind: 'level' as const,
      level,
      itemIds: ids(VOCABULARY.filter((w) => w.level === level)),
    })),
    ...(Object.keys(THEMES) as ThemeId[]).map((theme) => ({
      id: `theme-${theme}`,
      kind: 'theme' as const,
      theme,
      itemIds: ids(VOCABULARY.filter((w) => w.themes.includes(theme))),
    })),
  ]
}

/** Finds a built-in deck by id, or a custom deck by its database id. */
export function resolveDeck(
  id: string,
  customDecks: DeckRecord[],
): ResolvedDeck | undefined {
  const builtIn = builtInDecks().find((d) => d.id === id)
  if (builtIn) return builtIn
  const custom = customDecks.find((d) => d.id === id)
  return (
    custom && {
      id: custom.id,
      kind: 'custom',
      itemIds: custom.itemIds,
      name: custom.name,
    }
  )
}

export interface DeckCounts {
  total: number
  due: number
  fresh: number
}

export function deckCounts(
  itemIds: string[],
  dueDates: Map<string, Date>,
  now: Date,
): DeckCounts {
  let due = 0
  let fresh = 0
  for (const id of itemIds) {
    const date = dueDates.get(id)
    if (!date) fresh++
    else if (isDue(date, now)) due++
  }
  return { total: itemIds.length, due, fresh }
}

// --- Answers ---------------------------------------------------------------

/** Lowercases and drops spaces, punctuation and hyphens before comparing answers. */
export function normalizeAnswer(text: string): string {
  return text.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '')
}

export interface AnswerCheck {
  correct: boolean
  /** Jamo-level comparison when the learner typed Hangul (for highlighting). */
  similarity: SimilarityResult | null
}

/**
 * Accepts the word in Hangul or in Revised Romanization, ignoring spaces,
 * punctuation and case.
 */
export function checkAnswer(input: string, word: string): AnswerCheck {
  const answer = normalizeAnswer(input)
  const correct =
    answer !== '' &&
    (answer === normalizeAnswer(word) ||
      answer === normalizeAnswer(romanize(word)))
  const typedHangul = [...input].some(isSyllable)
  return { correct, similarity: typedHangul ? compareJamo(word, input) : null }
}

// --- Multiple choice ---------------------------------------------------------

/**
 * Builds meaning choices for a word: the right one plus distractors of the
 * same part of speech, never two choices with the same text.
 */
export function meaningChoices(
  target: VocabWord,
  locale: Locale,
  count = 4,
  rng: () => number = Math.random,
): VocabWord[] {
  const used = new Set([target.meaning[locale]])
  const samePos = shuffle(
    VOCABULARY.filter((w) => w.id !== target.id && w.pos === target.pos),
    rng,
  )
  const others = shuffle(
    VOCABULARY.filter((w) => w.id !== target.id && w.pos !== target.pos),
    rng,
  )
  const distractors: VocabWord[] = []
  for (const candidate of [...samePos, ...others]) {
    if (distractors.length >= count - 1) break
    const text = candidate.meaning[locale]
    if (used.has(text)) continue
    used.add(text)
    distractors.push(candidate)
  }
  return shuffle([target, ...distractors], rng)
}
