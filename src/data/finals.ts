import type { HangulEntry } from '../types/hangul'

export const finals: HangulEntry[] = [
  {
    id: 'final-g',
    hangul: 'ㄱ',
    romanization: 'k',
    category: 'final',
    notes:
      'ㄱ, ㅋ, ㄲ are all pronounced as an unreleased [k] in final position',
  },
  {
    id: 'final-n',
    hangul: 'ㄴ',
    romanization: 'n',
    category: 'final',
    notes: 'Pronounced as [n], same as its initial sound',
  },
  {
    id: 'final-d',
    hangul: 'ㄷ',
    romanization: 't',
    category: 'final',
    notes:
      'ㄷ, ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ are all pronounced as an unreleased [t] in final position',
  },
  {
    id: 'final-l',
    hangul: 'ㄹ',
    romanization: 'l',
    category: 'final',
    notes: 'Pronounced as an [l] sound, unlike its initial [r] sound',
  },
  {
    id: 'final-m',
    hangul: 'ㅁ',
    romanization: 'm',
    category: 'final',
    notes: 'Pronounced as [m], same as its initial sound',
  },
  {
    id: 'final-b',
    hangul: 'ㅂ',
    romanization: 'p',
    category: 'final',
    notes: 'ㅂ, ㅍ are both pronounced as an unreleased [p] in final position',
  },
  {
    id: 'final-ng',
    hangul: 'ㅇ',
    romanization: 'ng',
    category: 'final',
    notes: 'Pronounced as [ng], silent as an initial consonant',
  },
]
