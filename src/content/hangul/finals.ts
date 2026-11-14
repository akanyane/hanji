import type { HangulEntry } from './types'

// The 7 representative final sounds (받침). Every final consonant reduces to
// one of these when it doesn't link to the following syllable.
export const finals: HangulEntry[] = [
  {
    id: 'final-g',
    hangul: 'ㄱ',
    romanization: 'k',
    category: 'final',
    notes: 'ㄱ, ㅋ e ㄲ no final soam como um [k] sem soltar o ar.',
  },
  {
    id: 'final-n',
    hangul: 'ㄴ',
    romanization: 'n',
    category: 'final',
    notes: 'Soa como [n], igual ao som inicial.',
  },
  {
    id: 'final-d',
    hangul: 'ㄷ',
    romanization: 't',
    category: 'final',
    notes:
      'ㄷ, ㅅ, ㅆ, ㅈ, ㅊ, ㅌ e ㅎ no final soam como um [t] sem soltar o ar.',
  },
  {
    id: 'final-l',
    hangul: 'ㄹ',
    romanization: 'l',
    category: 'final',
    notes: 'Soa como [l], diferente do som inicial, mais próximo de [r].',
  },
  {
    id: 'final-m',
    hangul: 'ㅁ',
    romanization: 'm',
    category: 'final',
    notes: 'Soa como [m], igual ao som inicial.',
  },
  {
    id: 'final-b',
    hangul: 'ㅂ',
    romanization: 'p',
    category: 'final',
    notes: 'ㅂ e ㅍ no final soam como um [p] sem soltar o ar.',
  },
  {
    id: 'final-ng',
    hangul: 'ㅇ',
    romanization: 'ng',
    category: 'final',
    notes: 'Soa como [ng]; no início da sílaba é mudo.',
  },
]
