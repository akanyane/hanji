export type HangulCategory = 'vowel' | 'consonant' | 'final' | 'syllable'

export interface HangulEntry {
  /** Stable identifier: never change it, user progress references this id. */
  id: string
  hangul: string
  /** Revised Romanization (South Korea's official standard), lowercase. */
  romanization: string
  category: HangulCategory
  notes?: string
  /** Set to true when the content still needs review by a native speaker or a reliable source. */
  needsReview?: boolean
}

export const CATEGORY_LABELS: Record<HangulCategory, string> = {
  vowel: 'Vogal',
  consonant: 'Consoante',
  final: 'Batchim (final)',
  syllable: 'Sílaba',
}
