import { isMedial } from './jamo'

/**
 * Where the vowel sits in a syllable block, which decides the block's shape:
 * - vertical (ㅏ, ㅓ, ㅣ…): initial on the left, vowel on the right (가);
 * - horizontal (ㅗ, ㅜ, ㅡ…): initial on top, vowel below (고);
 * - mixed (ㅘ, ㅟ, ㅢ…): initial top-left, vowel wraps around it (과).
 * A final consonant, when present, always goes at the bottom.
 */
export type VowelOrientation = 'vertical' | 'horizontal' | 'mixed'

const VERTICAL = new Set(['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅣ'])
const HORIZONTAL = new Set(['ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ'])

export function vowelOrientation(medial: string): VowelOrientation | null {
  if (!isMedial(medial)) return null
  if (VERTICAL.has(medial)) return 'vertical'
  if (HORIZONTAL.has(medial)) return 'horizontal'
  return 'mixed'
}
