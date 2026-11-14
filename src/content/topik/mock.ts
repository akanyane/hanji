import type { Localized } from '../../i18n/locales'
import { L } from '../grammar/types'

// TOPIK I-style mock exam. The questions are ORIGINAL (not taken from real
// exams); only the formats follow TOPIK I: listening items (answer, next
// line, place, topic, details) and reading items (topic, blanks, notice,
// details, main idea). Instructions are in Korean, as in the real test.
//
// Authoring rule: the correct choice is always written FIRST (`answer` is
// index 0); choices are shuffled when the exam starts.

export type ExamSection = 'listening' | 'reading'

export interface ExamInstruction {
  ko: string
  help: Localized
}

export interface ExamQuestion {
  id: string
  section: ExamSection
  instruction: ExamInstruction
  /** Listening: lines read aloud (speaker 0 and 1 use different voices). */
  audio?: { speaker: 0 | 1; text: string }[]
  /** Reading: the text to read (lines separated by \n). */
  passage?: string
  choices: [string, string, string, string]
  points: number
  /** Translation of the audio/passage, shown when reviewing. */
  translation: Localized
}

export interface MockExam {
  id: string
  title: Localized
  minutes: number
  questions: ExamQuestion[]
}

const I = (ko: string, pt: string, en: string): ExamInstruction => ({
  ko,
  help: L(pt, en),
})

const LISTEN_ANSWER = I(
  '다음을 듣고 알맞은 대답을 고르십시오.',
  'Ouça e escolha a resposta adequada.',
  'Listen and choose the appropriate answer.',
)
const LISTEN_NEXT = I(
  '다음을 듣고 이어지는 말을 고르십시오.',
  'Ouça e escolha a fala que vem a seguir.',
  'Listen and choose what comes next.',
)
const LISTEN_PLACE = I(
  '여기는 어디입니까? 알맞은 것을 고르십시오.',
  'Onde estão as pessoas? Escolha a opção adequada.',
  'Where are they? Choose the appropriate place.',
)
const LISTEN_TOPIC = I(
  '다음은 무엇에 대해 말하고 있습니까? 알맞은 것을 고르십시오.',
  'Sobre o que estão falando? Escolha a opção adequada.',
  'What are they talking about? Choose the appropriate topic.',
)
const LISTEN_MATCH = I(
  '다음을 듣고 대화 내용과 같은 것을 고르십시오.',
  'Ouça e escolha a frase que corresponde ao diálogo.',
  'Listen and choose the statement that matches the conversation.',
)
const READ_TOPIC = I(
  '무엇에 대한 이야기입니까? 알맞은 것을 고르십시오.',
  'Sobre o que é o texto? Escolha a opção adequada.',
  'What is the text about? Choose the appropriate topic.',
)
const READ_BLANK = I(
  '(    )에 들어갈 가장 알맞은 것을 고르십시오.',
  'Escolha o que melhor completa o espaço (    ).',
  'Choose what best fills the blank (    ).',
)
const READ_NOT_MATCH = I(
  '다음을 읽고 맞지 않는 것을 고르십시오.',
  'Leia e escolha a frase que NÃO corresponde ao texto.',
  'Read and choose the statement that does NOT match.',
)
const READ_MATCH = I(
  '다음을 읽고 내용이 같은 것을 고르십시오.',
  'Leia e escolha a frase que corresponde ao texto.',
  'Read and choose the statement that matches the text.',
)
const READ_MAIN = I(
  '다음을 읽고 중심 생각을 고르십시오.',
  'Leia e escolha a ideia principal.',
  'Read and choose the main idea.',
)

const listening = (
  id: string,
  instruction: ExamInstruction,
  audio: ExamQuestion['audio'],
  choices: ExamQuestion['choices'],
  translation: Localized,
): ExamQuestion => ({
  id,
  section: 'listening',
  instruction,
  audio,
  choices,
  points: 5,
  translation,
})

const reading = (
  id: string,
  instruction: ExamInstruction,
  passage: string,
  choices: ExamQuestion['choices'],
  translation: Localized,
): ExamQuestion => ({
  id,
  section: 'reading',
  instruction,
  passage,
  choices,
  points: 5,
  translation,
})

export const MOCK_EXAMS: MockExam[] = [
  {
    id: 'mock-1',
    title: L('Simulado TOPIK I nº 1', 'TOPIK I mock exam #1'),
    minutes: 30,
    questions: [
      listening(
        'l1',
        LISTEN_ANSWER,
        [{ speaker: 0, text: '우산이 있어요?' }],
        [
          '네, 우산이 있어요.',
          '네, 우산이 아니에요.',
          '아니요, 우산이 커요.',
          '아니요, 우산이 예뻐요.',
        ],
        L('Você tem guarda-chuva?', 'Do you have an umbrella?'),
      ),
      listening(
        'l2',
        LISTEN_ANSWER,
        [{ speaker: 1, text: '무엇을 먹어요?' }],
        [
          '비빔밥을 먹어요.',
          '식당에서 먹어요.',
          '친구하고 먹어요.',
          '저녁에 먹어요.',
        ],
        L('O que você come?', 'What are you eating?'),
      ),
      listening(
        'l3',
        LISTEN_ANSWER,
        [{ speaker: 0, text: '언제 한국에 왔어요?' }],
        [
          '작년에 왔어요.',
          '비행기로 왔어요.',
          '혼자 왔어요.',
          '서울에 왔어요.',
        ],
        L('Quando você veio para a Coreia?', 'When did you come to Korea?'),
      ),
      listening(
        'l4',
        LISTEN_NEXT,
        [{ speaker: 1, text: '생일 축하해요.' }],
        ['고마워요.', '괜찮아요.', '미안해요.', '잘 먹겠습니다.'],
        L('Feliz aniversário.', 'Happy birthday.'),
      ),
      listening(
        'l5',
        LISTEN_NEXT,
        [{ speaker: 0, text: '늦어서 죄송합니다.' }],
        ['괜찮아요.', '반가워요.', '축하해요.', '잘 지내요.'],
        L('Desculpe o atraso.', 'Sorry I am late.'),
      ),
      listening(
        'l6',
        LISTEN_PLACE,
        [
          { speaker: 0, text: '어서 오세요. 뭘 드릴까요?' },
          { speaker: 1, text: '아이스 아메리카노 한 잔 주세요.' },
        ],
        ['카페', '은행', '우체국', '도서관'],
        L(
          '— Bem-vindo. O que vai querer? — Um americano gelado, por favor.',
          '— Welcome. What can I get you? — One iced americano, please.',
        ),
      ),
      listening(
        'l7',
        LISTEN_PLACE,
        [
          { speaker: 1, text: '이 편지를 미국에 보내고 싶어요.' },
          { speaker: 0, text: '네, 여기에 올려 주세요.' },
        ],
        ['우체국', '서점', '약국', '공항'],
        L(
          '— Quero mandar esta carta para os Estados Unidos. — Certo, coloque-a aqui, por favor.',
          '— I would like to send this letter to the United States. — Sure, please put it here.',
        ),
      ),
      listening(
        'l8',
        LISTEN_TOPIC,
        [
          { speaker: 0, text: '형제가 있어요?' },
          { speaker: 1, text: '네, 언니하고 남동생이 있어요.' },
        ],
        ['가족', '친구', '나이', '직업'],
        L(
          '— Você tem irmãos? — Sim, tenho uma irmã mais velha e um irmão mais novo.',
          '— Do you have siblings? — Yes, an older sister and a younger brother.',
        ),
      ),
      listening(
        'l9',
        LISTEN_TOPIC,
        [
          { speaker: 1, text: '주말에 보통 뭐 해요?' },
          { speaker: 0, text: '등산을 좋아해서 산에 자주 가요.' },
        ],
        ['취미', '날씨', '계절', '교통'],
        L(
          '— O que você costuma fazer no fim de semana? — Gosto de fazer trilha, então vou muito à montanha.',
          '— What do you usually do on weekends? — I like hiking, so I often go to the mountains.',
        ),
      ),
      listening(
        'l10',
        LISTEN_MATCH,
        [
          { speaker: 1, text: '민수 씨, 내일 같이 영화 볼까요?' },
          {
            speaker: 0,
            text: '미안해요. 내일은 아르바이트가 있어요. 토요일은 어때요?',
          },
          { speaker: 1, text: '좋아요. 그럼 토요일에 봐요.' },
        ],
        [
          '두 사람은 토요일에 영화를 볼 겁니다.',
          '남자는 내일 영화를 봅니다.',
          '여자는 내일 아르바이트를 합니다.',
          '남자는 토요일에 아르바이트를 합니다.',
        ],
        L(
          '— Minsu, vamos ver um filme amanhã? — Desculpe, amanhã tenho trabalho de meio período. Que tal sábado? — Ótimo. Então até sábado.',
          '— Minsu, shall we watch a movie tomorrow? — Sorry, I have my part-time job tomorrow. How about Saturday? — Great. See you on Saturday, then.',
        ),
      ),

      reading(
        'r1',
        READ_TOPIC,
        '저는 사과를 좋아합니다. 딸기도 좋아합니다.',
        ['과일', '운동', '날씨', '공부'],
        L(
          'Eu gosto de maçã. Também gosto de morango.',
          'I like apples. I also like strawberries.',
        ),
      ),
      reading(
        'r2',
        READ_TOPIC,
        '오늘은 따뜻합니다. 바람도 불지 않습니다.',
        ['날씨', '시간', '장소', '휴일'],
        L(
          'Hoje está quente. Também não está ventando.',
          'It is warm today. There is no wind either.',
        ),
      ),
      reading(
        'r3',
        READ_BLANK,
        '저는 책을 좋아합니다. 그래서 (    )에 자주 갑니다.',
        ['도서관', '병원', '은행', '수영장'],
        L(
          'Eu gosto de livros. Por isso vou com frequência à (biblioteca).',
          'I like books. So I often go to the (library).',
        ),
      ),
      reading(
        'r4',
        READ_BLANK,
        '동생(    ) 같이 영화를 봤습니다.',
        ['하고', '에서', '을', '의'],
        L(
          'Vi um filme (com) meu irmão mais novo.',
          'I watched a movie (with) my younger sibling.',
        ),
      ),
      reading(
        'r5',
        READ_BLANK,
        '배가 아픕니다. (    )에 가야 합니다.',
        ['병원', '극장', '시장', '공원'],
        L(
          'Estou com dor de barriga. Preciso ir ao (hospital).',
          'My stomach hurts. I need to go to the (hospital).',
        ),
      ),
      reading(
        'r6',
        READ_BLANK,
        '방이 너무 (    ). 창문을 엽시다.',
        ['덥습니다', '큽니다', '조용합니다', '깨끗합니다'],
        L(
          'O quarto está (quente) demais. Vamos abrir a janela.',
          'The room is too (hot). Let’s open the window.',
        ),
      ),
      reading(
        'r7',
        READ_NOT_MATCH,
        '〈한국 도서관 이용 안내〉\n• 이용 시간: 오전 9시 ~ 오후 6시\n• 쉬는 날: 매주 월요일\n• 책은 한 번에 다섯 권까지 빌릴 수 있습니다.',
        [
          '월요일에도 도서관에 갈 수 있습니다.',
          '도서관은 오전 9시에 문을 엽니다.',
          '책을 다섯 권 빌릴 수 있습니다.',
          '도서관은 오후 6시에 문을 닫습니다.',
        ],
        L(
          'Guia da biblioteca — Horário: 9h às 18h. Fechada: toda segunda-feira. É possível pegar até cinco livros por vez.',
          'Library guide — Hours: 9 a.m. to 6 p.m. Closed: every Monday. You can borrow up to five books at a time.',
        ),
      ),
      reading(
        'r8',
        READ_MATCH,
        '저는 지난주에 친구와 부산에 갔습니다. 바다를 보고 맛있는 회를 먹었습니다. 다음에는 가족과 같이 가고 싶습니다.',
        [
          '저는 친구와 부산에 갔습니다.',
          '저는 가족과 부산에 갔습니다.',
          '저는 다음 주에 부산에 갑니다.',
          '저는 부산에서 고기를 먹었습니다.',
        ],
        L(
          'Semana passada fui a Busan com um amigo. Vimos o mar e comemos um peixe cru delicioso. Da próxima vez quero ir com a minha família.',
          'Last week I went to Busan with a friend. We saw the sea and ate delicious raw fish. Next time I want to go with my family.',
        ),
      ),
      reading(
        'r9',
        READ_MATCH,
        '우리 집 근처에 새 빵집이 생겼습니다. 빵이 싸고 맛있어서 사람이 많습니다. 저는 아침마다 그 빵집에서 빵을 삽니다.',
        [
          '저는 매일 아침 빵을 삽니다.',
          '빵집의 빵은 비쌉니다.',
          '빵집에는 사람이 적습니다.',
          '빵집은 집에서 멉니다.',
        ],
        L(
          'Abriu uma padaria nova perto de casa. O pão é barato e gostoso, então há muita gente. Eu compro pão lá todas as manhãs.',
          'A new bakery opened near my house. The bread is cheap and tasty, so it is crowded. I buy bread there every morning.',
        ),
      ),
      reading(
        'r10',
        READ_MAIN,
        '저는 요즘 한국어를 공부합니다. 한국어는 어렵지만 재미있습니다. 한국 친구와 한국어로 이야기하고 싶어서 매일 열심히 공부합니다.',
        [
          '한국 친구와 한국어로 이야기하고 싶습니다.',
          '한국어는 너무 어려워서 싫습니다.',
          '한국 친구가 많이 있습니다.',
          '한국어 공부를 그만두고 싶습니다.',
        ],
        L(
          'Ultimamente estudo coreano. O coreano é difícil, mas divertido. Estudo muito todos os dias porque quero conversar em coreano com amigos coreanos.',
          'These days I study Korean. Korean is hard but fun. I study hard every day because I want to talk with Korean friends in Korean.',
        ),
      ),
    ],
  },
]

export function getMockExam(id: string): MockExam | undefined {
  return MOCK_EXAMS.find((e) => e.id === id)
}

/**
 * TOPIK I grants level 1 from 80/200 and level 2 from 140/200; the mock
 * applies the same ratios (40% and 70%). An estimate, not a real result.
 */
export function estimateTopikLevel(score: number, max: number): 0 | 1 | 2 {
  const ratio = max > 0 ? score / max : 0
  if (ratio >= 0.7) return 2
  if (ratio >= 0.4) return 1
  return 0
}
