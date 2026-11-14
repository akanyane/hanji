// Hangul jamo tables and Unicode composition/decomposition.
//
// Precomposed syllables live in U+AC00–U+D7A3 and follow a fixed formula:
//
//   code = 0xAC00 + (initialIndex * 21 + medialIndex) * 28 + finalIndex
//
// where 19 initials × 21 medials × 28 finals (index 0 = no final) gives
// 11,172 syllables. All jamo here use the Hangul Compatibility Jamo block
// (U+3131–U+318E), which is what users type and what fonts render standalone.

export const SYLLABLE_BASE = 0xac00
export const SYLLABLE_LAST = 0xd7a3
const MEDIAL_COUNT = 21
const FINAL_COUNT = 28

/** The 19 initial consonants (초성), in Unicode order. */
export const INITIALS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const

/** The 21 medial vowels (중성), in Unicode order. */
export const MEDIALS = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
] as const

/** The 27 final consonants (종성), in Unicode order. Index 0 means "no final". */
export const FINALS = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const

export type Initial = (typeof INITIALS)[number]
export type Medial = (typeof MEDIALS)[number]
export type Final = (typeof FINALS)[number]

export interface Syllable {
  initial: Initial
  medial: Medial
  /** Empty string when the syllable has no final consonant (batchim). */
  final: Final
}

/** Compound finals (겹받침) and the two consonants they are made of. */
export const COMPOUND_FINALS: Partial<Record<Final, [Final, Final]>> = {
  ㄳ: ['ㄱ', 'ㅅ'],
  ㄵ: ['ㄴ', 'ㅈ'],
  ㄶ: ['ㄴ', 'ㅎ'],
  ㄺ: ['ㄹ', 'ㄱ'],
  ㄻ: ['ㄹ', 'ㅁ'],
  ㄼ: ['ㄹ', 'ㅂ'],
  ㄽ: ['ㄹ', 'ㅅ'],
  ㄾ: ['ㄹ', 'ㅌ'],
  ㄿ: ['ㄹ', 'ㅍ'],
  ㅀ: ['ㄹ', 'ㅎ'],
  ㅄ: ['ㅂ', 'ㅅ'],
}

/** Compound vowels built from two basic vowels (as typed on a 2-set keyboard). */
export const COMPOUND_MEDIALS: Partial<Record<Medial, [Medial, Medial]>> = {
  ㅘ: ['ㅗ', 'ㅏ'],
  ㅙ: ['ㅗ', 'ㅐ'],
  ㅚ: ['ㅗ', 'ㅣ'],
  ㅝ: ['ㅜ', 'ㅓ'],
  ㅞ: ['ㅜ', 'ㅔ'],
  ㅟ: ['ㅜ', 'ㅣ'],
  ㅢ: ['ㅡ', 'ㅣ'],
}

const INITIAL_SET = new Set<string>(INITIALS)
const MEDIAL_SET = new Set<string>(MEDIALS)
const FINAL_SET = new Set<string>(FINALS.filter(Boolean))

export const isInitial = (jamo: string): jamo is Initial =>
  INITIAL_SET.has(jamo)
export const isMedial = (jamo: string): jamo is Medial => MEDIAL_SET.has(jamo)
/** True for any jamo that can be a final consonant (excludes the empty "no final"). */
export const isFinal = (jamo: string): jamo is Final => FINAL_SET.has(jamo)
export const isConsonant = (jamo: string) => isInitial(jamo) || isFinal(jamo)

/** True when `char` is a single precomposed Hangul syllable (가–힣). */
export function isSyllable(char: string): boolean {
  if (char.length !== 1) return false
  const code = char.charCodeAt(0)
  return code >= SYLLABLE_BASE && code <= SYLLABLE_LAST
}

/** Builds a syllable block from its jamo. Returns null for invalid combinations. */
export function compose(
  initial: string,
  medial: string,
  final: string = '',
): string | null {
  const i = INITIALS.indexOf(initial as Initial)
  const m = MEDIALS.indexOf(medial as Medial)
  const f = FINALS.indexOf(final as Final)
  if (i < 0 || m < 0 || f < 0) return null
  return String.fromCharCode(
    SYLLABLE_BASE + (i * MEDIAL_COUNT + m) * FINAL_COUNT + f,
  )
}

/** Composes a `Syllable` object; assumes it is valid (it is, by its types). */
export function composeSyllable({ initial, medial, final }: Syllable): string {
  return compose(initial, medial, final) as string
}

/** Splits a syllable block into its jamo. Returns null for non-syllables. */
export function decompose(char: string): Syllable | null {
  if (!isSyllable(char)) return null
  const offset = char.charCodeAt(0) - SYLLABLE_BASE
  return {
    initial: INITIALS[Math.floor(offset / (MEDIAL_COUNT * FINAL_COUNT))],
    medial: MEDIALS[Math.floor(offset / FINAL_COUNT) % MEDIAL_COUNT],
    final: FINALS[offset % FINAL_COUNT],
  }
}

/** Splits a compound vowel/final into its parts; basic jamo come back as-is. */
export function splitCompound(jamo: string): string[] {
  return (
    COMPOUND_FINALS[jamo as Final] ?? COMPOUND_MEDIALS[jamo as Medial] ?? [jamo]
  )
}

/** Combines two finals into a compound final (ㄱ + ㅅ → ㄳ), or null. */
export function combineFinals(first: string, second: string): Final | null {
  for (const [compound, parts] of Object.entries(COMPOUND_FINALS)) {
    if (parts[0] === first && parts[1] === second) return compound as Final
  }
  return null
}

/** Combines two vowels into a compound vowel (ㅗ + ㅏ → ㅘ), or null. */
export function combineMedials(first: string, second: string): Medial | null {
  for (const [compound, parts] of Object.entries(COMPOUND_MEDIALS)) {
    if (parts[0] === first && parts[1] === second) return compound as Medial
  }
  return null
}

export interface JamoOptions {
  /** Split compound vowels and finals into basic jamo (ㅘ → ㅗㅏ, ㄳ → ㄱㅅ). */
  splitCompounds?: boolean
}

/**
 * Converts text into a flat list of jamo. Non-Hangul characters are kept
 * as single elements so the result can be mapped back to the input.
 */
export function toJamo(
  text: string,
  { splitCompounds = false }: JamoOptions = {},
) {
  const result: string[] = []
  for (const char of text) {
    const syllable = decompose(char)
    if (!syllable) {
      result.push(...(splitCompounds ? splitCompound(char) : [char]))
      continue
    }
    for (const jamo of [syllable.initial, syllable.medial, syllable.final]) {
      if (jamo) result.push(...(splitCompounds ? splitCompound(jamo) : [jamo]))
    }
  }
  return result
}

/** True when the last Hangul syllable of `word` has a final consonant. */
export function hasFinalConsonant(word: string): boolean {
  const chars = [...word.trim()]
  for (let i = chars.length - 1; i >= 0; i--) {
    const syllable = decompose(chars[i])
    if (syllable) return syllable.final !== ''
  }
  return false
}
