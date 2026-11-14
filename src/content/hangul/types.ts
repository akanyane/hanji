import type { Localized } from '../../i18n/locales'

export type HangulCategory = 'vowel' | 'consonant' | 'final' | 'syllable'

export interface HangulEntry {
  /** Stable identifier: never change it, user progress references this id. */
  id: string
  hangul: string
  /** Revised Romanization (South Korea's official standard), lowercase. */
  romanization: string
  category: HangulCategory
  notes?: Localized
  /** Set to true when the content still needs review by a native speaker or a reliable source. */
  needsReview?: boolean
}
