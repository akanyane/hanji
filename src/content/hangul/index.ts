import { consonants } from './consonants'
import { finals } from './finals'
import { syllables } from './syllables'
import type { HangulEntry } from './types'
import { vowels } from './vowels'

export const hangulData: HangulEntry[] = [
  ...vowels,
  ...consonants,
  ...finals,
  ...syllables,
]

export * from './types'
export { consonants, finals, syllables, vowels }
