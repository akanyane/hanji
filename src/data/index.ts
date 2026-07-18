import type { HangulEntry } from '../types/hangul'
import { consonants } from './consonants'
import { finals } from './finals'
import { syllables } from './syllables'
import { vowels } from './vowels'

export const hangulData: HangulEntry[] = [
  ...vowels,
  ...consonants,
  ...finals,
  ...syllables,
]

export { consonants, finals, syllables, vowels }
