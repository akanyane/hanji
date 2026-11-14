import type { PronunciationRuleId } from '../../lib/pronunciation/pronounce'

export interface PronunciationRuleInfo {
  /** Rule name shown to the learner (pt-BR). */
  name: string
  /** Korean name of the rule. */
  korean: string
  /** Short explanation shown to the learner (pt-BR). */
  summary: string
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
    name: 'Ligação',
    korean: '연음',
    summary:
      'Quando a sílaba seguinte começa com ㅇ (som de vogal), o batchim "pula" para o lugar do ㅇ. Em batchim duplo, só a segunda consoante pula.',
    example: ['한국어', '한구거'],
  },
  finalSimplification: {
    name: 'Batchim duplo',
    korean: '겹받침 단순화',
    summary:
      'Antes de consoante ou no fim da palavra, só uma das duas consoantes do batchim duplo é pronunciada.',
    example: ['닭', '닥'],
  },
  finalNeutralization: {
    name: 'As 7 representações do batchim',
    korean: '받침의 대표음',
    summary:
      'Antes de consoante ou no fim da palavra, todo batchim se reduz a um destes 7 sons: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ. Ex.: ㅅ, ㅈ, ㅊ, ㅌ, ㅎ soam como ㄷ.',
    example: ['꽃', '꼳'],
  },
  nasalization: {
    name: 'Assimilação nasal',
    korean: '비음화',
    summary:
      'ㄱ, ㄷ, ㅂ antes de ㄴ ou ㅁ viram os nasais ㅇ, ㄴ, ㅁ. Além disso, ㄹ depois de ㅁ ou ㅇ (e de ㄱ, ㅂ) vira ㄴ, e o batchim ㅎ antes de ㄴ vira ㄴ.',
    example: ['국물', '궁물'],
  },
  lateralization: {
    name: 'Assimilação lateral',
    korean: '유음화',
    summary:
      'ㄴ encostado em ㄹ (antes ou depois dele) vira ㄹ, e o par soa como um "l" prolongado.',
    example: ['신라', '실라'],
  },
  tensification: {
    name: 'Tensificação',
    korean: '경음화',
    summary:
      'Depois de batchim com som de ㄱ, ㄷ ou ㅂ, as consoantes ㄱ, ㄷ, ㅂ, ㅅ, ㅈ ficam tensas: ㄲ, ㄸ, ㅃ, ㅆ, ㅉ.',
    example: ['학교', '학꾜'],
  },
  aspiration: {
    name: 'Aspiração',
    korean: '격음화',
    summary:
      'ㅎ encontrando ㄱ, ㄷ, ㅂ ou ㅈ (em qualquer ordem) se funde com elas, formando as aspiradas ㅋ, ㅌ, ㅍ, ㅊ.',
    example: ['축하', '추카'],
  },
  palatalization: {
    name: 'Palatalização',
    korean: '구개음화',
    summary:
      'Batchim ㄷ ou ㅌ seguido de 이 passa a soar como 지 / 치. O mesmo vale para ㄷ + 히.',
    example: ['같이', '가치'],
  },
  hDeletion: {
    name: 'Queda do ㅎ',
    korean: 'ㅎ 탈락',
    summary:
      'O batchim ㅎ não é pronunciado antes de vogal (e em ㄶ, ㅀ antes de ㄴ): só a outra consoante fica.',
    example: ['좋아', '조아'],
  },
  uiVowel: {
    name: 'Vogal ㅢ depois de consoante',
    korean: "'ㅢ' 발음",
    summary:
      'Quando a sílaba começa com consoante, ㅢ é pronunciado como ㅣ. No início da palavra (의) mantém o som original.',
    example: ['희망', '히망'],
  },
  jyeoVowel: {
    name: 'ㅈ, ㅉ, ㅊ + ㅕ',
    korean: "'져, 쪄, 쳐' 발음",
    summary: 'Depois de ㅈ, ㅉ ou ㅊ, a vogal ㅕ soa como ㅓ.',
    example: ['가져', '가저'],
  },
}

/** Cases the automatic engine can't detect, because they depend on meaning. */
export const PRONUNCIATION_LIMITATIONS: Array<
  [description: string, example: string]
> = [
  ['Inserção de ㄴ em palavras compostas', '꽃잎 → [꼰닙]'],
  ['Tensificação depois da terminação -(으)ㄹ', '할 거야 → [할 꺼야]'],
  ['Tensificação em palavras sino-coreanas com ㄹ', '갈등 → [갈뜽]'],
  [
    'Tensificação depois de radical verbal em ㄴ ou ㅁ',
    '신고 (calçar) → [신꼬]',
  ],
  ['Ligação entre duas palavras independentes', '맛없다 → [마덥따]'],
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
