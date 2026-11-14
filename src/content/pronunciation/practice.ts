import type { Localized } from '../../i18n/locales'
import type { PronunciationRuleId } from '../../lib/pronunciation/pronounce'
import { L } from '../grammar/types'
import { VOCABULARY } from '../vocabulary'

/**
 * Example words for each sound-change rule. A test checks that the
 * pronunciation engine really applies the rule to every word listed.
 */
export const RULE_EXAMPLES: Record<PronunciationRuleId, string[]> = {
  liaison: ['한국어', '음악', '읽어요', '앉아요', '있어요'],
  finalSimplification: ['닭', '값', '앉다', '없다', '읽다'],
  finalNeutralization: ['꽃', '옷', '부엌', '낮', '밖'],
  nasalization: ['국물', '입니다', '있는', '백만', '종로'],
  lateralization: ['신라', '설날', '연락', '물난리', '일년'],
  tensification: ['학교', '식당', '국밥', '숙제', '젓가락'],
  aspiration: ['축하', '좋다', '입학', '많고', '백화점'],
  palatalization: ['같이', '굳이', '해돋이', '밭이', '붙이다'],
  hDeletion: ['좋아요', '많이', '싫어요', '놓아요', '괜찮아요'],
  uiVowel: ['희망', '무늬', '띄우다'],
  jyeoVowel: ['가져요', '다쳐요', '쪄요'],
}

/** Display order of the rules in the pronunciation module. */
export const RULE_ORDER: PronunciationRuleId[] = [
  'finalNeutralization',
  'liaison',
  'finalSimplification',
  'nasalization',
  'lateralization',
  'tensification',
  'aspiration',
  'palatalization',
  'hDeletion',
  'uiVowel',
  'jyeoVowel',
]

export interface MinimalPairGroup {
  id: string
  /** The contrast, e.g. "ㄷ / ㄸ / ㅌ". */
  contrast: string
  description: Localized
  words: Array<{ word: string; meaning: Localized }>
}

// Real words that differ in a single sound. ㅐ/ㅔ are left out on purpose:
// most speakers pronounce them the same today.
export const MINIMAL_PAIRS: MinimalPairGroup[] = [
  {
    id: 'd-tt-t',
    contrast: 'ㄷ / ㄸ / ㅌ',
    description: L('Simples, tensa e aspirada.', 'Plain, tense and aspirated.'),
    words: [
      { word: '달', meaning: L('lua', 'moon') },
      { word: '딸', meaning: L('filha', 'daughter') },
      { word: '탈', meaning: L('máscara', 'mask') },
    ],
  },
  {
    id: 'b-pp-p',
    contrast: 'ㅂ / ㅃ / ㅍ',
    description: L('Simples, tensa e aspirada.', 'Plain, tense and aspirated.'),
    words: [
      { word: '불', meaning: L('fogo', 'fire') },
      { word: '뿔', meaning: L('chifre', 'horn') },
      { word: '풀', meaning: L('grama; cola', 'grass; glue') },
    ],
  },
  {
    id: 'j-jj-ch',
    contrast: 'ㅈ / ㅉ / ㅊ',
    description: L('Simples, tensa e aspirada.', 'Plain, tense and aspirated.'),
    words: [
      { word: '자다', meaning: L('dormir', 'to sleep') },
      { word: '짜다', meaning: L('ser salgado', 'to be salty') },
      { word: '차다', meaning: L('chutar; estar frio', 'to kick; to be cold') },
    ],
  },
  {
    id: 'g-kk',
    contrast: 'ㄱ / ㄲ',
    description: L('Simples e tensa.', 'Plain and tense.'),
    words: [
      { word: '굴', meaning: L('ostra; caverna', 'oyster; cave') },
      { word: '꿀', meaning: L('mel', 'honey') },
    ],
  },
  {
    id: 's-ss',
    contrast: 'ㅅ / ㅆ',
    description: L('Simples e tensa.', 'Plain and tense.'),
    words: [
      { word: '사다', meaning: L('comprar', 'to buy') },
      { word: '싸다', meaning: L('ser barato', 'to be cheap') },
    ],
  },
  {
    id: 'eo-o',
    contrast: 'ㅓ / ㅗ',
    description: L(
      'Boca aberta sem arredondar vs. lábios arredondados.',
      'Open unrounded vs. rounded lips.',
    ),
    words: [
      { word: '벌', meaning: L('abelha', 'bee') },
      { word: '볼', meaning: L('bochecha', 'cheek') },
    ],
  },
  {
    id: 'eu-u',
    contrast: 'ㅡ / ㅜ',
    description: L(
      'Lábios esticados vs. arredondados.',
      'Spread vs. rounded lips.',
    ),
    words: [
      { word: '들', meaning: L('campo', 'field') },
      { word: '둘', meaning: L('dois', 'two') },
    ],
  },
  {
    id: 'm-n-ng',
    contrast: 'ㅁ / ㄴ / ㅇ (final)',
    description: L('Os três finais nasais.', 'The three nasal finals.'),
    words: [
      { word: '감', meaning: L('caqui', 'persimmon') },
      { word: '간', meaning: L('fígado', 'liver') },
      { word: '강', meaning: L('rio', 'river') },
    ],
  },
  {
    id: 'k-p-final',
    contrast: 'ㄱ / ㅂ (final)',
    description: L('Finais sem soltar o ar.', 'Unreleased finals.'),
    words: [
      { word: '박', meaning: L('cabaça', 'gourd') },
      { word: '밥', meaning: L('arroz cozido', 'cooked rice') },
    ],
  },
]

export interface PracticeSentence {
  id: string
  ko: string
  translation: Localized
}

/** Short example sentences from the vocabulary bank, good for dictation and shadowing. */
export const PRACTICE_SENTENCES: PracticeSentence[] = VOCABULARY.filter(
  (w) => w.example.ko.length >= 6 && w.example.ko.length <= 18,
).map((w) => ({
  id: w.id,
  ko: w.example.ko,
  translation: w.example.translation,
}))
