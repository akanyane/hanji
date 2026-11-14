import type { Localized } from '../../i18n/locales'
import { L } from '../grammar/types'

// Placement test: four questions per level. The learner's level is the
// number of consecutive levels passed (≥ 3 of 4 right), from 0 to 4.

export type PlacementLevel = 0 | 1 | 2 | 3

export interface PlacementQuestion {
  id: string
  level: PlacementLevel
  instruction: Localized
  /** Korean stimulus shown large (a syllable, a sentence, a short text). */
  ko?: string
  /** Korean (or romanized) strings, or translated sentences. */
  choices: (string | Localized)[]
  /** Script of string choices: Korean by default. */
  choiceScript?: 'ko' | 'latin'
  /** Index of the correct choice (choices are shuffled when shown). */
  answer: number
}

export const PLACEMENT_PASS = 3

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Level 0 — reading Hangul
  {
    id: 'read-ga',
    level: 0,
    instruction: L('Como se lê esta sílaba?', 'How is this syllable read?'),
    ko: '가',
    choices: ['ga', 'na', 'da', 'ra'],
    choiceScript: 'latin',
    answer: 0,
  },
  {
    id: 'read-meo',
    level: 0,
    instruction: L('Como se lê esta sílaba?', 'How is this syllable read?'),
    ko: '머',
    choices: ['meo', 'mo', 'mu', 'ma'],
    choiceScript: 'latin',
    answer: 0,
  },
  {
    id: 'find-hangeul',
    level: 0,
    instruction: L(
      'Qual destas palavras se lê “hangeul”?',
      'Which of these words is read “hangeul”?',
    ),
    choices: ['한글', '한국', '하늘', '학교'],
    answer: 0,
  },
  {
    id: 'find-bap',
    level: 0,
    instruction: L(
      'Qual destas sílabas se lê “bap”?',
      'Which of these syllables is read “bap”?',
    ),
    choices: ['밥', '반', '방', '법'],
    answer: 0,
  },

  // Level 1 — first words and particles
  {
    id: 'meaning-water',
    level: 1,
    instruction: L('O que significa?', 'What does it mean?'),
    ko: '물',
    choices: [
      L('água', 'water'),
      L('fogo', 'fire'),
      L('arroz', 'rice'),
      L('casa', 'house'),
    ],
    answer: 0,
  },
  {
    id: 'meaning-thanks',
    level: 1,
    instruction: L('O que significa?', 'What does it mean?'),
    ko: '감사합니다',
    choices: [
      L('Obrigado(a).', 'Thank you.'),
      L('Desculpe.', 'Sorry.'),
      L('Olá.', 'Hello.'),
      L('Tchau.', 'Goodbye.'),
    ],
    answer: 0,
  },
  {
    id: 'particle-topic',
    level: 1,
    instruction: L(
      'Complete com a partícula certa.',
      'Complete with the right particle.',
    ),
    ko: '저___ 학생이에요.',
    choices: ['는', '을', '에', '와'],
    answer: 0,
  },
  {
    id: 'particle-destination',
    level: 1,
    instruction: L(
      'Complete com a partícula certa.',
      'Complete with the right particle.',
    ),
    ko: '학교___ 가요.',
    choices: ['에', '를', '은', '이'],
    answer: 0,
  },

  // Level 2 — tenses, connectives, irregular verbs
  {
    id: 'past-tense',
    level: 2,
    instruction: L(
      'Complete a frase: “Ontem eu vi um filme.”',
      'Complete the sentence: “Yesterday I watched a movie.”',
    ),
    ko: '어제 영화를 ___.',
    choices: ['봤어요', '봐요', '볼 거예요', '보세요'],
    answer: 0,
  },
  {
    id: 'reason-aseo',
    level: 2,
    instruction: L('O que significa?', 'What does it mean?'),
    ko: '비가 와서 집에 있었어요.',
    choices: [
      L('Choveu, por isso fiquei em casa.', 'It rained, so I stayed home.'),
      L(
        'Embora chovesse, fiquei em casa.',
        'Although it rained, I stayed home.',
      ),
      L('Se chover, vou ficar em casa.', 'If it rains, I will stay home.'),
      L('Choveu e depois eu saí.', 'It rained and then I went out.'),
    ],
    answer: 0,
  },
  {
    id: 'irregular-b',
    level: 2,
    instruction: L(
      'Complete com a forma certa de 맵다 (apimentado).',
      'Complete with the right form of 맵다 (spicy).',
    ),
    ko: '이 김치는 너무 ___.',
    choices: ['매워요', '맵어요', '매와요', '맵아요'],
    answer: 0,
  },
  {
    id: 'future',
    level: 2,
    instruction: L(
      'Complete a frase: “Amanhã vou encontrar um amigo.”',
      'Complete the sentence: “Tomorrow I will meet a friend.”',
    ),
    ko: '내일 친구를 ___ 거예요.',
    choices: ['만날', '만난', '만나는', '만났'],
    answer: 0,
  },

  // Level 3 — honorifics, nuanced endings, reported speech, reading
  {
    id: 'honorific',
    level: 3,
    instruction: L(
      'Qual é a forma mais respeitosa de perguntar a um professor se ele já comeu?',
      'What is the most respectful way to ask a teacher whether they have eaten?',
    ),
    choices: [
      '선생님, 식사하셨어요?',
      '선생님, 밥 먹었어?',
      '선생님, 밥 먹어요?',
      '선생님, 식사했니?',
    ],
    answer: 0,
  },
  {
    id: 'background-neunde',
    level: 3,
    instruction: L('O que significa?', 'What does it mean?'),
    ko: '지금 비가 오는데 우산 있어요?',
    choices: [
      L(
        'Está chovendo agora; você tem guarda-chuva?',
        'It is raining now; do you have an umbrella?',
      ),
      L(
        'Se chover, você vai levar guarda-chuva?',
        'If it rains, will you take an umbrella?',
      ),
      L(
        'Choveu ontem, então comprei um guarda-chuva.',
        'It rained yesterday, so I bought an umbrella.',
      ),
      L(
        'Não está chovendo, não precisa de guarda-chuva.',
        'It is not raining; you do not need an umbrella.',
      ),
    ],
    answer: 0,
  },
  {
    id: 'reported-speech',
    level: 3,
    instruction: L(
      'Minsu disse: “내일 바빠요.” Complete o discurso indireto.',
      'Minsu said: “내일 바빠요.” Complete the reported speech.',
    ),
    ko: '민수가 내일 ___ 했어요.',
    choices: ['바쁘다고', '바쁘라고', '바쁘자고', '바쁘냐고'],
    answer: 0,
  },
  {
    id: 'reading-routine',
    level: 3,
    instruction: L(
      'Leia: o que a pessoa faz depois de se exercitar?',
      'Read: what does the person do after exercising?',
    ),
    ko: '저는 매일 아침 일곱 시에 일어나요. 그리고 공원에서 삼십 분 동안 운동해요. 그다음에 샤워하고 회사에 가요.',
    choices: [
      L(
        'Toma banho e vai para o trabalho.',
        'Takes a shower and goes to work.',
      ),
      L('Toma café da manhã no parque.', 'Has breakfast in the park.'),
      L('Volta a dormir até as sete.', 'Goes back to sleep until seven.'),
      L('Corre por mais trinta minutos.', 'Runs for another thirty minutes.'),
    ],
    answer: 0,
  },
]

export interface PlacementResult {
  /** 0 (start with Hangul) to 4 (ready for TOPIK practice). */
  level: number
  correct: number
  total: number
  at: number
}

/** Level = consecutive levels passed, from the easiest. */
export function placementLevel(
  correctByLevel: Record<PlacementLevel, number>,
): number {
  let level = 0
  for (const l of [0, 1, 2, 3] as const) {
    if (correctByLevel[l] < PLACEMENT_PASS) break
    level++
  }
  return level
}

/** Where to start for each placement level. */
export const PLACEMENT_RECOMMENDATIONS: {
  to: '/hangul' | '/vocabulary' | '/grammar' | '/reading' | '/progress/exam'
  module: 'hangul' | 'vocabulary' | 'grammar' | 'reading' | 'exam'
}[] = [
  { to: '/hangul', module: 'hangul' },
  { to: '/vocabulary', module: 'vocabulary' },
  { to: '/grammar', module: 'grammar' },
  { to: '/reading', module: 'reading' },
  { to: '/progress/exam', module: 'exam' },
]
