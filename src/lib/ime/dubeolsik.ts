// Composition automaton for the standard Korean 2-set keyboard (두벌식).
//
// The keyboard sends one jamo per key; the automaton assembles them into
// syllable blocks the same way a real Korean IME does:
//
//   ㅎ → ㅎ      ㅏ → 하      ㄴ → 한      ㄱ → 한ㄱ      ㅡ → 한그      ㄹ → 한글
//
// The interesting case is a vowel arriving after a final consonant: the
// final "jumps" to start the next syllable (한 + ㅏ → 하나), and in a compound
// final only the second part jumps (닭 + ㅏ → 달가).
//
// The state is immutable; every operation returns a new state.

import {
  COMPOUND_FINALS,
  COMPOUND_MEDIALS,
  combineFinals,
  combineMedials,
  compose,
  type Final,
  isFinal,
  isInitial,
  isMedial,
  type Medial,
} from '../hangul'

/** QWERTY key → jamo on the 2-set layout. Shift only changes the 7 keys listed in uppercase. */
export const DUBEOLSIK_LAYOUT: Record<string, string> = {
  q: 'ㅂ',
  w: 'ㅈ',
  e: 'ㄷ',
  r: 'ㄱ',
  t: 'ㅅ',
  y: 'ㅛ',
  u: 'ㅕ',
  i: 'ㅑ',
  o: 'ㅐ',
  p: 'ㅔ',
  a: 'ㅁ',
  s: 'ㄴ',
  d: 'ㅇ',
  f: 'ㄹ',
  g: 'ㅎ',
  h: 'ㅗ',
  j: 'ㅓ',
  k: 'ㅏ',
  l: 'ㅣ',
  z: 'ㅋ',
  x: 'ㅌ',
  c: 'ㅊ',
  v: 'ㅍ',
  b: 'ㅠ',
  n: 'ㅜ',
  m: 'ㅡ',
  Q: 'ㅃ',
  W: 'ㅉ',
  E: 'ㄸ',
  R: 'ㄲ',
  T: 'ㅆ',
  O: 'ㅒ',
  P: 'ㅖ',
}

/** Maps a typed key to its jamo; uppercase keys without a shifted jamo fall back to lowercase. */
export function keyToJamo(key: string): string | undefined {
  return DUBEOLSIK_LAYOUT[key] ?? DUBEOLSIK_LAYOUT[key.toLowerCase()]
}

interface Composing {
  initial: string
  medial: string
  final: string
}

export interface ImeState {
  /** Text that is already final. */
  committed: string
  /** The syllable still being typed (can change with the next key). */
  composing: Composing | null
}

export const EMPTY_IME_STATE: ImeState = { committed: '', composing: null }

/** Renders the block being composed (a lone jamo while incomplete). */
export function renderComposing(c: Composing | null): string {
  if (!c) return ''
  if (c.initial && c.medial) return compose(c.initial, c.medial, c.final) ?? ''
  return c.initial || c.medial
}

/** Full text as the user sees it: committed text plus the block being composed. */
export function imeText(state: ImeState): string {
  return state.committed + renderComposing(state.composing)
}

const commit = (state: ImeState, next: Composing | null): ImeState => ({
  committed: state.committed + renderComposing(state.composing),
  composing: next,
})

function inputConsonant(state: ImeState, consonant: string): ImeState {
  const c = state.composing
  const fresh = { initial: consonant, medial: '', final: '' }
  // Nothing composing, a lone consonant, or a lone vowel: start a new block.
  if (!c?.initial || !c.medial) return commit(state, fresh)
  if (!c.final) {
    // ㄸ, ㅃ, ㅉ can't be finals: they start the next syllable.
    return isFinal(consonant)
      ? { ...state, composing: { ...c, final: consonant } }
      : commit(state, fresh)
  }
  const compound = combineFinals(c.final, consonant)
  return compound
    ? { ...state, composing: { ...c, final: compound } }
    : commit(state, fresh)
}

function inputVowel(state: ImeState, vowel: string): ImeState {
  const c = state.composing
  const fresh = { initial: '', medial: vowel, final: '' }
  if (!c) return commit(state, fresh)
  if (c.initial && !c.medial)
    return { ...state, composing: { ...c, medial: vowel } }
  if (c.final) {
    // The final moves to the new syllable; a compound final splits (닭 + ㅏ → 달가).
    const parts = COMPOUND_FINALS[c.final as Final]
    const [stay, move] = parts ?? ['', c.final]
    return {
      committed: state.committed + renderComposing({ ...c, final: stay }),
      composing: { initial: move, medial: vowel, final: '' },
    }
  }
  const compound = combineMedials(c.medial, vowel)
  return compound
    ? { ...state, composing: { ...c, medial: compound } }
    : commit(state, fresh)
}

/** Feeds one jamo (or any other character, which is committed as-is). */
export function imeInput(state: ImeState, char: string): ImeState {
  if (isMedial(char)) return inputVowel(state, char)
  if (isInitial(char) || isFinal(char)) return inputConsonant(state, char)
  return { committed: imeText(state) + char, composing: null }
}

/** Removes the last typed jamo, like Backspace in a Korean IME. */
export function imeBackspace(state: ImeState): ImeState {
  const c = state.composing
  if (!c) {
    return {
      committed: [...state.committed].slice(0, -1).join(''),
      composing: null,
    }
  }
  if (c.final) {
    const parts = COMPOUND_FINALS[c.final as Final]
    return { ...state, composing: { ...c, final: parts ? parts[0] : '' } }
  }
  if (c.medial) {
    const parts = COMPOUND_MEDIALS[c.medial as Medial]
    if (parts) return { ...state, composing: { ...c, medial: parts[0] } }
    return { ...state, composing: c.initial ? { ...c, medial: '' } : null }
  }
  return { ...state, composing: null }
}

/** Converts a sequence of QWERTY keys typed on a 2-set layout (e.g. "gksrmf" → "한글"). */
export function keysToHangul(keys: string): string {
  let state = EMPTY_IME_STATE
  for (const key of keys) state = imeInput(state, keyToJamo(key) ?? key)
  return imeText(state)
}
