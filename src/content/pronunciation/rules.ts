import type { Localized } from '../../i18n/locales'
import type { PronunciationRuleId } from '../../lib/pronunciation/pronounce'

export interface PronunciationRuleInfo {
  /** Rule name shown to the learner. */
  name: Localized
  /** Korean name of the rule. */
  korean: string
  /** Short explanation shown to the learner. */
  summary: Localized
  /** A written word and how it is pronounced. */
  example: [written: string, pronounced: string]
}

// Explanations follow 표준 발음법 (Standard Pronunciation, National
// Institute of Korean Language).
export const PRONUNCIATION_RULES: Record<
  PronunciationRuleId,
  PronunciationRuleInfo
> = {
  liaison: {
    name: { 'pt-BR': 'Ligação', en: 'Liaison (linking)' },
    korean: '연음',
    summary: {
      'pt-BR':
        'Quando a sílaba seguinte começa com ㅇ (som de vogal), o batchim "pula" para o lugar do ㅇ. Em batchim duplo, só a segunda consoante pula.',
      en: 'When the next syllable starts with ㅇ (a vowel sound), the final consonant moves over to take the place of the ㅇ. With a double final, only the second consonant moves.',
    },
    example: ['한국어', '한구거'],
  },
  finalSimplification: {
    name: { 'pt-BR': 'Batchim duplo', en: 'Double final consonants' },
    korean: '겹받침 단순화',
    summary: {
      'pt-BR':
        'Antes de consoante ou no fim da palavra, só uma das duas consoantes do batchim duplo é pronunciada.',
      en: 'Before a consonant or at the end of a word, only one of the two consonants of a double final is pronounced.',
    },
    example: ['닭', '닥'],
  },
  finalNeutralization: {
    name: {
      'pt-BR': 'As 7 representações do batchim',
      en: 'The 7 final sounds',
    },
    korean: '받침의 대표음',
    summary: {
      'pt-BR':
        'Antes de consoante ou no fim da palavra, todo batchim se reduz a um destes 7 sons: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ. Ex.: ㅅ, ㅈ, ㅊ, ㅌ, ㅎ soam como ㄷ.',
      en: 'Before a consonant or at the end of a word, every final consonant reduces to one of these 7 sounds: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ. For example, ㅅ, ㅈ, ㅊ, ㅌ, ㅎ all sound like ㄷ.',
    },
    example: ['꽃', '꼳'],
  },
  nasalization: {
    name: { 'pt-BR': 'Assimilação nasal', en: 'Nasal assimilation' },
    korean: '비음화',
    summary: {
      'pt-BR':
        'ㄱ, ㄷ, ㅂ antes de ㄴ ou ㅁ viram os nasais ㅇ, ㄴ, ㅁ. Além disso, ㄹ depois de ㅁ ou ㅇ (e de ㄱ, ㅂ) vira ㄴ, e o batchim ㅎ antes de ㄴ vira ㄴ.',
      en: 'ㄱ, ㄷ, ㅂ before ㄴ or ㅁ become the nasals ㅇ, ㄴ, ㅁ. Also, ㄹ after ㅁ or ㅇ (and after ㄱ, ㅂ) becomes ㄴ, and a final ㅎ before ㄴ becomes ㄴ.',
    },
    example: ['국물', '궁물'],
  },
  lateralization: {
    name: { 'pt-BR': 'Assimilação lateral', en: 'Lateral assimilation' },
    korean: '유음화',
    summary: {
      'pt-BR':
        'ㄴ encostado em ㄹ (antes ou depois dele) vira ㄹ, e o par soa como um "l" prolongado.',
      en: 'ㄴ next to ㄹ (before or after it) becomes ㄹ, and the pair sounds like a long "l".',
    },
    example: ['신라', '실라'],
  },
  tensification: {
    name: { 'pt-BR': 'Tensificação', en: 'Tensification' },
    korean: '경음화',
    summary: {
      'pt-BR':
        'Depois de batchim com som de ㄱ, ㄷ ou ㅂ, as consoantes ㄱ, ㄷ, ㅂ, ㅅ, ㅈ ficam tensas: ㄲ, ㄸ, ㅃ, ㅆ, ㅉ.',
      en: 'After a final that sounds like ㄱ, ㄷ or ㅂ, the consonants ㄱ, ㄷ, ㅂ, ㅅ, ㅈ become tense: ㄲ, ㄸ, ㅃ, ㅆ, ㅉ.',
    },
    example: ['학교', '학꾜'],
  },
  aspiration: {
    name: { 'pt-BR': 'Aspiração', en: 'Aspiration' },
    korean: '격음화',
    summary: {
      'pt-BR':
        'ㅎ encontrando ㄱ, ㄷ, ㅂ ou ㅈ (em qualquer ordem) se funde com elas, formando as aspiradas ㅋ, ㅌ, ㅍ, ㅊ.',
      en: 'When ㅎ meets ㄱ, ㄷ, ㅂ or ㅈ (in either order), they merge into the aspirated ㅋ, ㅌ, ㅍ, ㅊ.',
    },
    example: ['축하', '추카'],
  },
  palatalization: {
    name: { 'pt-BR': 'Palatalização', en: 'Palatalization' },
    korean: '구개음화',
    summary: {
      'pt-BR':
        'Batchim ㄷ ou ㅌ seguido de 이 passa a soar como 지 / 치. O mesmo vale para ㄷ + 히.',
      en: 'A final ㄷ or ㅌ followed by 이 turns into 지 / 치. The same happens with ㄷ + 히.',
    },
    example: ['같이', '가치'],
  },
  hDeletion: {
    name: { 'pt-BR': 'Queda do ㅎ', en: 'ㅎ deletion' },
    korean: 'ㅎ 탈락',
    summary: {
      'pt-BR':
        'O batchim ㅎ não é pronunciado antes de vogal (e em ㄶ, ㅀ antes de ㄴ): só a outra consoante fica.',
      en: 'A final ㅎ is silent before a vowel (and in ㄶ, ㅀ before ㄴ): only the other consonant remains.',
    },
    example: ['좋아', '조아'],
  },
  uiVowel: {
    name: {
      'pt-BR': 'Vogal ㅢ depois de consoante',
      en: 'ㅢ after a consonant',
    },
    korean: "'ㅢ' 발음",
    summary: {
      'pt-BR':
        'Quando a sílaba começa com consoante, ㅢ é pronunciado como ㅣ. No início da palavra (의) mantém o som original.',
      en: 'When the syllable starts with a consonant, ㅢ is pronounced ㅣ. At the start of a word (의) it keeps its own sound.',
    },
    example: ['희망', '히망'],
  },
  jyeoVowel: {
    name: { 'pt-BR': 'ㅈ, ㅉ, ㅊ + ㅕ', en: 'ㅈ, ㅉ, ㅊ + ㅕ' },
    korean: "'져, 쪄, 쳐' 발음",
    summary: {
      'pt-BR': 'Depois de ㅈ, ㅉ ou ㅊ, a vogal ㅕ soa como ㅓ.',
      en: 'After ㅈ, ㅉ or ㅊ, the vowel ㅕ sounds like ㅓ.',
    },
    example: ['가져', '가저'],
  },
}

/** Cases the automatic engine can't detect, because they depend on meaning. */
export const PRONUNCIATION_LIMITATIONS: Array<{
  description: Localized
  example: Localized
}> = [
  {
    description: {
      'pt-BR': 'Inserção de ㄴ em palavras compostas',
      en: 'ㄴ insertion in compound words',
    },
    example: { 'pt-BR': '꽃잎 → [꼰닙]', en: '꽃잎 → [꼰닙]' },
  },
  {
    description: {
      'pt-BR': 'Tensificação depois da terminação -(으)ㄹ',
      en: 'Tensification after the -(으)ㄹ ending',
    },
    example: { 'pt-BR': '할 거야 → [할 꺼야]', en: '할 거야 → [할 꺼야]' },
  },
  {
    description: {
      'pt-BR': 'Tensificação em palavras sino-coreanas com ㄹ',
      en: 'Tensification in Sino-Korean words with ㄹ',
    },
    example: { 'pt-BR': '갈등 → [갈뜽]', en: '갈등 → [갈뜽]' },
  },
  {
    description: {
      'pt-BR': 'Tensificação depois de radical verbal em ㄴ ou ㅁ',
      en: 'Tensification after verb stems ending in ㄴ or ㅁ',
    },
    example: {
      'pt-BR': '신고 (calçar) → [신꼬]',
      en: '신고 (wearing shoes) → [신꼬]',
    },
  },
  {
    description: {
      'pt-BR': 'Ligação entre duas palavras independentes',
      en: 'Linking across two separate words',
    },
    example: { 'pt-BR': '맛없다 → [마덥따]', en: '맛없다 → [마덥따]' },
  },
]

export const PRONUNCIATION_EXAMPLES = [
  '국물',
  '신라',
  '같이',
  '좋다',
  '학교',
  '읽는',
  '축하해요',
  '감사합니다',
]
