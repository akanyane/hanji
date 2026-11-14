import type { Localized } from '../../i18n/locales'
import { L } from '../grammar/types'

export interface TranslationExercise {
  id: string
  /** The sentence to translate, in the learner's language. */
  prompt: Localized
  /**
   * Accepted Korean translations. Spacing and punctuation are ignored when
   * checking, so list only real variations (with/without 저는, 에/에서…).
   */
  answers: string[]
}

export const TRANSLATIONS: TranslationExercise[] = [
  {
    id: 'student',
    prompt: L('Eu sou estudante.', 'I am a student.'),
    answers: [
      '저는 학생이에요.',
      '학생이에요.',
      '저는 학생입니다.',
      '학생입니다.',
    ],
  },
  {
    id: 'water',
    prompt: L('Eu bebo água.', 'I drink water.'),
    answers: ['저는 물을 마셔요.', '물을 마셔요.', '물 마셔요.'],
  },
  {
    id: 'restroom',
    prompt: L('Onde fica o banheiro?', 'Where is the restroom?'),
    answers: [
      '화장실이 어디예요?',
      '화장실은 어디예요?',
      '화장실이 어디에 있어요?',
      '화장실은 어디에 있어요?',
    ],
  },
  {
    id: 'price',
    prompt: L('Quanto custa isto?', 'How much is this?'),
    answers: ['이거 얼마예요?', '이건 얼마예요?', '이것은 얼마예요?'],
  },
  {
    id: 'coffee',
    prompt: L('Eu gosto de café.', 'I like coffee.'),
    answers: ['저는 커피를 좋아해요.', '커피를 좋아해요.', '커피 좋아해요.'],
  },
  {
    id: 'seoul',
    prompt: L('Eu moro em Seul.', 'I live in Seoul.'),
    answers: [
      '저는 서울에 살아요.',
      '서울에 살아요.',
      '저는 서울에서 살아요.',
      '서울에서 살아요.',
    ],
  },
  {
    id: 'hot',
    prompt: L('Hoje está quente.', "It's hot today."),
    answers: [
      '오늘 더워요.',
      '오늘은 더워요.',
      '오늘 날씨가 더워요.',
      '오늘은 날씨가 더워요.',
    ],
  },
  {
    id: 'school-yesterday',
    prompt: L('Ontem eu fui à escola.', 'I went to school yesterday.'),
    answers: [
      '어제 학교에 갔어요.',
      '저는 어제 학교에 갔어요.',
      '어제 저는 학교에 갔어요.',
    ],
  },
  {
    id: 'korea',
    prompt: L('Eu quero ir à Coreia.', 'I want to go to Korea.'),
    answers: ['한국에 가고 싶어요.', '저는 한국에 가고 싶어요.'],
  },
  {
    id: 'no-time',
    prompt: L('Não tenho tempo.', "I don't have time."),
    answers: ['시간이 없어요.', '저는 시간이 없어요.'],
  },
  {
    id: 'eat-together',
    prompt: L('Vamos comer juntos.', "Let's eat together."),
    answers: ['같이 밥 먹어요.', '같이 밥을 먹어요.', '같이 먹어요.'],
  },
  {
    id: 'name',
    prompt: L('Meu nome é Ana.', 'My name is Ana.'),
    answers: [
      '제 이름은 아나예요.',
      '저는 아나예요.',
      '제 이름은 아나입니다.',
      '저는 아나입니다.',
    ],
  },
]

export interface WritingCheck {
  label: Localized
  /** At least one of these must appear in the text. */
  anyOf: string[]
}

export interface WritingPrompt {
  id: string
  title: Localized
  task: Localized
  minSentences: number
  checks: WritingCheck[]
  /** Useful patterns to get started. */
  hints: string[]
  modelAnswer: string
  modelTranslation: Localized
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'introduce-yourself',
    title: L('Apresente-se', 'Introduce yourself'),
    task: L(
      'Escreva 3 frases se apresentando: seu nome, de onde você é e o que faz.',
      'Write 3 sentences introducing yourself: your name, where you are from and what you do.',
    ),
    minSentences: 3,
    checks: [
      {
        label: L('Usa 이에요/예요 ou 입니다', 'Uses 이에요/예요 or 입니다'),
        anyOf: ['이에요', '예요', '입니다'],
      },
    ],
    hints: ['저는 ___이에요/예요.', '___ 사람이에요.', '저는 ___이에요.'],
    modelAnswer:
      '안녕하세요. 저는 아나예요. 브라질 사람이에요. 저는 학생이에요.',
    modelTranslation: L(
      'Olá. Eu sou a Ana. Sou brasileira. Sou estudante.',
      "Hello. I'm Ana. I'm Brazilian. I'm a student.",
    ),
  },
  {
    id: 'daily-routine',
    title: L('Sua rotina', 'Your routine'),
    task: L(
      'Descreva sua rotina em 3 frases, dizendo os horários.',
      'Describe your routine in 3 sentences, saying the times.',
    ),
    minSentences: 3,
    checks: [
      {
        label: L('Diz um horário com 시에', 'Says a time with 시에'),
        anyOf: ['시에'],
      },
    ],
    hints: [
      '___ 시에 일어나요.',
      '___ 시에 회사/학교에 가요.',
      '___ 시에 자요.',
    ],
    modelAnswer:
      '저는 일곱 시에 일어나요. 여덟 시에 회사에 가요. 열한 시에 자요.',
    modelTranslation: L(
      'Acordo às sete. Às oito vou para a empresa. Durmo às onze.',
      'I get up at seven. At eight I go to work. I go to bed at eleven.',
    ),
  },
  {
    id: 'likes',
    title: L('Do que você gosta', 'What you like'),
    task: L(
      'Escreva 3 frases sobre o que você gosta e o que não gosta.',
      "Write 3 sentences about what you like and don't like.",
    ),
    minSentences: 3,
    checks: [
      { label: L('Usa 좋아해요', 'Uses 좋아해요'), anyOf: ['좋아해요'] },
      {
        label: L(
          'Tem uma negação (안 / 지 않아요)',
          'Has a negative (안 / 지 않아요)',
        ),
        anyOf: ['안 ', '지 않아요'],
      },
    ],
    hints: ['저는 ___을/를 좋아해요.', '___은/는 안 좋아해요.'],
    modelAnswer:
      '저는 커피를 좋아해요. 차는 안 좋아해요. 한국 음식을 정말 좋아해요.',
    modelTranslation: L(
      'Eu gosto de café. Chá eu não gosto. Gosto muito de comida coreana.',
      "I like coffee. I don't like tea. I really like Korean food.",
    ),
  },
  {
    id: 'last-weekend',
    title: L('O fim de semana passado', 'Last weekend'),
    task: L(
      'Conte o que você fez no fim de semana passado, usando o passado.',
      'Tell what you did last weekend, using the past tense.',
    ),
    minSentences: 3,
    checks: [
      {
        label: L(
          'Usa o passado (-았/었어요)',
          'Uses the past tense (-았/었어요)',
        ),
        anyOf: [
          '았어요',
          '었어요',
          '했어요',
          '였어요',
          '봤어요',
          '갔어요',
          '왔어요',
        ],
      },
    ],
    hints: ['주말에 ___을/를 만났어요.', '___에 갔어요.', '정말 재미있었어요.'],
    modelAnswer:
      '주말에 친구를 만났어요. 같이 영화를 봤어요. 정말 재미있었어요.',
    modelTranslation: L(
      'No fim de semana encontrei um amigo. Vimos um filme juntos. Foi muito divertido.',
      'I met a friend on the weekend. We watched a movie together. It was really fun.',
    ),
  },
]
