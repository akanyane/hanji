import type { HangulEntry } from './types'

// The 7 representative final sounds (받침). Every final consonant reduces to
// one of these when it doesn't link to the following syllable.
export const finals: HangulEntry[] = [
  {
    id: 'final-g',
    hangul: 'ㄱ',
    romanization: 'k',
    category: 'final',
    notes: {
      'pt-BR': 'ㄱ, ㅋ e ㄲ no final soam como um [k] sem soltar o ar.',
      en: 'ㄱ, ㅋ and ㄲ as finals all sound like an unreleased [k].',
    },
  },
  {
    id: 'final-n',
    hangul: 'ㄴ',
    romanization: 'n',
    category: 'final',
    notes: {
      'pt-BR': 'Soa como [n], igual ao som inicial.',
      en: 'Sounds like [n], same as at the start.',
    },
  },
  {
    id: 'final-d',
    hangul: 'ㄷ',
    romanization: 't',
    category: 'final',
    notes: {
      'pt-BR':
        'ㄷ, ㅅ, ㅆ, ㅈ, ㅊ, ㅌ e ㅎ no final soam como um [t] sem soltar o ar.',
      en: 'ㄷ, ㅅ, ㅆ, ㅈ, ㅊ, ㅌ and ㅎ as finals all sound like an unreleased [t].',
    },
  },
  {
    id: 'final-l',
    hangul: 'ㄹ',
    romanization: 'l',
    category: 'final',
    notes: {
      'pt-BR': 'Soa como [l], diferente do som inicial, mais próximo de [r].',
      en: 'Sounds like [l], unlike the initial sound, which is closer to [r].',
    },
  },
  {
    id: 'final-m',
    hangul: 'ㅁ',
    romanization: 'm',
    category: 'final',
    notes: {
      'pt-BR': 'Soa como [m], igual ao som inicial.',
      en: 'Sounds like [m], same as at the start.',
    },
  },
  {
    id: 'final-b',
    hangul: 'ㅂ',
    romanization: 'p',
    category: 'final',
    notes: {
      'pt-BR': 'ㅂ e ㅍ no final soam como um [p] sem soltar o ar.',
      en: 'ㅂ and ㅍ as finals both sound like an unreleased [p].',
    },
  },
  {
    id: 'final-ng',
    hangul: 'ㅇ',
    romanization: 'ng',
    category: 'final',
    notes: {
      'pt-BR': 'Soa como [ng]; no início da sílaba é mudo.',
      en: 'Sounds like [ng]; silent at the start of a syllable.',
    },
  },
]
