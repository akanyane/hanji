export type HangulCategory = 'vowel' | 'consonant' | 'final' | 'syllable'

export interface HangulEntry {
  id: string
  hangul: string
  romanization: string
  category: HangulCategory
  notes?: string
}

export const CATEGORY_LABELS: Record<HangulCategory, string> = {
  vowel: 'Vowel',
  consonant: 'Consonant',
  final: 'Final (Batchim)',
  syllable: 'Syllable',
}
