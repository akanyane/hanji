import type { HangulEntry } from './types'

const TENSE = {
  'pt-BR': 'Consoante tensa (dupla): pronunciada com mais tensão, sem sopro.',
  en: 'Tense (double) consonant: said with a tight throat and no puff of air.',
}

export const consonants: HangulEntry[] = [
  {
    id: 'cons-g',
    hangul: 'ㄱ',
    romanization: 'g/k',
    category: 'consonant',
    notes: {
      'pt-BR': 'Romanizada como g antes de vogal e k no fim da sílaba.',
      en: 'Romanized as g before a vowel and k at the end of a syllable.',
    },
  },
  { id: 'cons-n', hangul: 'ㄴ', romanization: 'n', category: 'consonant' },
  {
    id: 'cons-d',
    hangul: 'ㄷ',
    romanization: 'd/t',
    category: 'consonant',
    notes: {
      'pt-BR': 'Romanizada como d antes de vogal e t no fim da sílaba.',
      en: 'Romanized as d before a vowel and t at the end of a syllable.',
    },
  },
  {
    id: 'cons-r',
    hangul: 'ㄹ',
    romanization: 'r/l',
    category: 'consonant',
    notes: {
      'pt-BR': 'Romanizada como r antes de vogal e l no fim da sílaba.',
      en: 'Romanized as r before a vowel and l at the end of a syllable.',
    },
  },
  { id: 'cons-m', hangul: 'ㅁ', romanization: 'm', category: 'consonant' },
  {
    id: 'cons-b',
    hangul: 'ㅂ',
    romanization: 'b/p',
    category: 'consonant',
    notes: {
      'pt-BR': 'Romanizada como b antes de vogal e p no fim da sílaba.',
      en: 'Romanized as b before a vowel and p at the end of a syllable.',
    },
  },
  { id: 'cons-s', hangul: 'ㅅ', romanization: 's', category: 'consonant' },
  {
    id: 'cons-ng',
    hangul: 'ㅇ',
    romanization: '',
    category: 'consonant',
    notes: {
      'pt-BR': 'Muda no início da sílaba; soa como "ng" no final (batchim).',
      en: 'Silent at the start of a syllable; sounds like "ng" as a final (batchim).',
    },
  },
  { id: 'cons-j', hangul: 'ㅈ', romanization: 'j', category: 'consonant' },
  { id: 'cons-ch', hangul: 'ㅊ', romanization: 'ch', category: 'consonant' },
  { id: 'cons-k', hangul: 'ㅋ', romanization: 'k', category: 'consonant' },
  { id: 'cons-t', hangul: 'ㅌ', romanization: 't', category: 'consonant' },
  { id: 'cons-p', hangul: 'ㅍ', romanization: 'p', category: 'consonant' },
  { id: 'cons-h', hangul: 'ㅎ', romanization: 'h', category: 'consonant' },
  {
    id: 'cons-kk',
    hangul: 'ㄲ',
    romanization: 'kk',
    category: 'consonant',
    notes: TENSE,
  },
  {
    id: 'cons-tt',
    hangul: 'ㄸ',
    romanization: 'tt',
    category: 'consonant',
    notes: TENSE,
  },
  {
    id: 'cons-pp',
    hangul: 'ㅃ',
    romanization: 'pp',
    category: 'consonant',
    notes: TENSE,
  },
  {
    id: 'cons-jj',
    hangul: 'ㅉ',
    romanization: 'jj',
    category: 'consonant',
    notes: TENSE,
  },
  {
    id: 'cons-ss',
    hangul: 'ㅆ',
    romanization: 'ss',
    category: 'consonant',
    notes: TENSE,
  },
]
