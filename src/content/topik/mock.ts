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

/** TOPIK I covers levels 1–2; TOPIK II covers levels 3–6. */
export type ExamKind = 'topik1' | 'topik2'

export interface MockExam {
  id: string
  kind: ExamKind
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

const LISTEN_CONTINUE = I(
  '다음을 듣고 이어질 수 있는 말로 가장 알맞은 것을 고르십시오.',
  'Ouça e escolha a fala que pode vir a seguir.',
  'Listen and choose what could come next.',
)
const LISTEN_WOMAN_ACTION = I(
  '다음을 듣고 여자가 이어서 할 행동으로 가장 알맞은 것을 고르십시오.',
  'Ouça e escolha o que a mulher vai fazer em seguida.',
  'Listen and choose what the woman will do next.',
)
const LISTEN_MATCH_HEARD = I(
  '다음을 듣고 들은 내용과 같은 것을 고르십시오.',
  'Ouça e escolha a frase que corresponde ao que você ouviu.',
  'Listen and choose the statement that matches what you heard.',
)
const LISTEN_MAN_IDEA = I(
  '다음을 듣고 남자의 중심 생각으로 가장 알맞은 것을 고르십시오.',
  'Ouça e escolha a ideia principal do homem.',
  "Listen and choose the man's main idea.",
)
const READ_GRAMMAR = I(
  '(    )에 들어갈 말로 가장 알맞은 것을 고르십시오.',
  'Escolha a expressão que melhor completa o espaço (    ).',
  'Choose the expression that best fills the blank (    ).',
)
const READ_SIMILAR = I(
  '〔  〕 안의 부분과 의미가 가장 비슷한 것을 고르십시오.',
  'Escolha a expressão de sentido mais parecido com a parte entre 〔  〕.',
  'Choose the expression closest in meaning to the part in 〔  〕.',
)
const READ_WHAT_ABOUT = I(
  '다음은 무엇에 대한 글인지 고르십시오.',
  'Escolha sobre o que é o texto.',
  'Choose what the text is about.',
)
const READ_THEME = I(
  '다음을 읽고 글의 주제로 가장 알맞은 것을 고르십시오.',
  'Leia e escolha o tema do texto.',
  'Read and choose the main theme of the text.',
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
    kind: 'topik1',
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
  {
    id: 'mock-2',
    kind: 'topik1',
    title: L('Simulado TOPIK I nº 2', 'TOPIK I mock exam #2'),
    minutes: 30,
    questions: [
      listening(
        'l1',
        LISTEN_ANSWER,
        [{ speaker: 1, text: '학생이에요?' }],
        [
          '네, 학생이에요.',
          '네, 학생이 없어요.',
          '아니요, 학생이 많아요.',
          '아니요, 학생을 좋아해요.',
        ],
        L('Você é estudante?', 'Are you a student?'),
      ),
      listening(
        'l2',
        LISTEN_ANSWER,
        [{ speaker: 0, text: '어디에 가요?' }],
        ['도서관에 가요.', '친구하고 가요.', '내일 가요.', '버스로 가요.'],
        L('Aonde você vai?', 'Where are you going?'),
      ),
      listening(
        'l3',
        LISTEN_ANSWER,
        [{ speaker: 1, text: '이 가방은 얼마예요?' }],
        ['삼만 원이에요.', '가방이 예뻐요.', '이 가방이에요.', '어제 샀어요.'],
        L('Quanto custa esta bolsa?', 'How much is this bag?'),
      ),
      listening(
        'l4',
        LISTEN_NEXT,
        [{ speaker: 0, text: '맛있게 드세요.' }],
        ['잘 먹겠습니다.', '처음 뵙겠습니다.', '안녕히 계세요.', '축하합니다.'],
        L('Bom apetite.', 'Enjoy your meal.'),
      ),
      listening(
        'l5',
        LISTEN_NEXT,
        [{ speaker: 1, text: '처음 뵙겠습니다.' }],
        ['반갑습니다.', '괜찮습니다.', '잘 먹겠습니다.', '다녀오겠습니다.'],
        L(
          'Muito prazer (é a primeira vez que nos vemos).',
          'Nice to meet you (for the first time).',
        ),
      ),
      listening(
        'l6',
        LISTEN_PLACE,
        [
          { speaker: 1, text: '이 책을 빌리고 싶은데요.' },
          { speaker: 0, text: '학생증 있으세요? 두 주 후에 돌려주세요.' },
        ],
        ['도서관', '은행', '식당', '공항'],
        L(
          '— Queria pegar este livro emprestado. — Tem carteirinha de estudante? Devolva em duas semanas.',
          '— I would like to borrow this book. — Do you have a student ID? Please return it in two weeks.',
        ),
      ),
      listening(
        'l7',
        LISTEN_PLACE,
        [
          { speaker: 0, text: '어디가 아프세요?' },
          { speaker: 1, text: '어제부터 열이 나고 목이 아파요.' },
        ],
        ['병원', '우체국', '미용실', '공항'],
        L(
          '— Onde está doendo? — Desde ontem estou com febre e dor de garganta.',
          '— Where does it hurt? — Since yesterday I have had a fever and a sore throat.',
        ),
      ),
      listening(
        'l8',
        LISTEN_TOPIC,
        [
          { speaker: 0, text: '오늘 정말 덥네요.' },
          { speaker: 1, text: '네, 내일은 비가 온대요.' },
        ],
        ['날씨', '쇼핑', '가족', '직업'],
        L(
          '— Está muito quente hoje. — É, e dizem que amanhã vai chover.',
          '— It is really hot today. — Yes, and they say it will rain tomorrow.',
        ),
      ),
      listening(
        'l9',
        LISTEN_TOPIC,
        [
          { speaker: 1, text: '몇 시에 만날까요?' },
          { speaker: 0, text: '여섯 시 어때요?' },
        ],
        ['약속', '음식', '고향', '취미'],
        L(
          '— A que horas vamos nos encontrar? — Que tal às seis?',
          '— What time shall we meet? — How about six?',
        ),
      ),
      listening(
        'l10',
        LISTEN_MATCH,
        [
          { speaker: 0, text: '수미 씨, 생일 선물로 뭐 받고 싶어요?' },
          { speaker: 1, text: '저는 책을 좋아해요. 소설책을 받고 싶어요.' },
          { speaker: 0, text: '그럼 이번 주말에 같이 서점에 가요.' },
        ],
        [
          '두 사람은 주말에 서점에 갈 겁니다.',
          '여자는 소설을 싫어합니다.',
          '남자는 생일 선물을 받았습니다.',
          '두 사람은 지금 서점에 있습니다.',
        ],
        L(
          '— Sumi, o que você quer ganhar de aniversário? — Eu gosto de livros. Queria ganhar um romance. — Então vamos juntos à livraria neste fim de semana.',
          '— Sumi, what would you like for your birthday? — I like books. I would like a novel. — Then let us go to the bookstore together this weekend.',
        ),
      ),

      reading(
        'r1',
        READ_TOPIC,
        '저는 서울에 삽니다. 동생은 부산에 삽니다.',
        ['장소', '나이', '취미', '계절'],
        L(
          'Eu moro em Seul. Meu irmão mais novo mora em Busan.',
          'I live in Seoul. My younger sibling lives in Busan.',
        ),
      ),
      reading(
        'r2',
        READ_TOPIC,
        '아버지는 의사입니다. 어머니는 선생님입니다.',
        ['직업', '주말', '공부', '운동'],
        L(
          'Meu pai é médico. Minha mãe é professora.',
          'My father is a doctor. My mother is a teacher.',
        ),
      ),
      reading(
        'r3',
        READ_BLANK,
        '목이 마릅니다. (    )을 마십니다.',
        ['물', '빵', '책', '옷'],
        L('Estou com sede. Bebo (água).', 'I am thirsty. I drink (water).'),
      ),
      reading(
        'r4',
        READ_BLANK,
        '저는 매일 아침 공원(    ) 운동을 합니다.',
        ['에서', '에게', '을', '와'],
        L(
          'Todas as manhãs eu me exercito (no) parque.',
          'Every morning I exercise (in) the park.',
        ),
      ),
      reading(
        'r5',
        READ_BLANK,
        '내일은 친구 생일입니다. 그래서 (    )을 삽니다.',
        ['선물', '우산', '약', '신문'],
        L(
          'Amanhã é aniversário de um amigo. Por isso compro um (presente).',
          "Tomorrow is a friend's birthday. So I am buying a (present).",
        ),
      ),
      reading(
        'r6',
        READ_BLANK,
        '배가 고픕니다. 그래서 밥을 (    ).',
        ['먹습니다', '잡니다', '씻습니다', '입습니다'],
        L('Estou com fome. Por isso (como).', 'I am hungry. So I (eat).'),
      ),
      reading(
        'r7',
        READ_NOT_MATCH,
        '〈수영장 이용 안내〉\n• 시간: 오전 6시 ~ 오후 9시\n• 쉬는 날: 매주 일요일\n• 수영 모자를 꼭 써야 합니다.',
        [
          '일요일에도 수영할 수 있습니다.',
          '아침 6시에 문을 엽니다.',
          '수영 모자가 필요합니다.',
          '저녁 9시까지 이용할 수 있습니다.',
        ],
        L(
          'Piscina — Horário: 6h às 21h. Fechada: todo domingo. É obrigatório usar touca.',
          'Swimming pool — Hours: 6 a.m. to 9 p.m. Closed: every Sunday. A swim cap is required.',
        ),
      ),
      reading(
        'r8',
        READ_MATCH,
        '저는 지난 주말에 동생과 영화관에 갔습니다. 영화가 아주 재미있었습니다. 영화를 보고 같이 저녁을 먹었습니다.',
        [
          '저는 동생과 영화를 봤습니다.',
          '저는 혼자 영화관에 갔습니다.',
          '영화가 재미없었습니다.',
          '영화를 보기 전에 저녁을 먹었습니다.',
        ],
        L(
          'No fim de semana passado fui ao cinema com meu irmão. O filme foi muito divertido. Depois do filme, jantamos juntos.',
          'Last weekend I went to the cinema with my younger sibling. The movie was a lot of fun. After the movie we had dinner together.',
        ),
      ),
      reading(
        'r9',
        READ_MATCH,
        '우리 회사는 아홉 시에 일을 시작합니다. 저는 집이 멀어서 일곱 시에 집에서 나옵니다. 지하철을 타고 회사에 갑니다.',
        [
          '저는 지하철로 회사에 갑니다.',
          '회사는 여덟 시에 시작합니다.',
          '저는 회사 근처에 삽니다.',
          '저는 버스를 타고 회사에 갑니다.',
        ],
        L(
          'Na minha empresa o trabalho começa às nove. Como moro longe, saio de casa às sete. Vou de metrô para o trabalho.',
          'At my company, work starts at nine. My home is far away, so I leave at seven. I take the subway to work.',
        ),
      ),
      reading(
        'r10',
        READ_MAIN,
        '저는 운동을 좋아합니다. 그런데 요즘 일이 많아서 운동을 못 합니다. 다음 달부터는 시간을 만들어서 다시 운동을 하고 싶습니다.',
        [
          '다시 운동을 하고 싶습니다.',
          '일을 그만두고 싶습니다.',
          '운동을 싫어합니다.',
          '다음 달에 회사에 갑니다.',
        ],
        L(
          'Eu gosto de me exercitar. Mas ultimamente tenho muito trabalho e não consigo. A partir do mês que vem quero arranjar tempo e voltar a me exercitar.',
          'I like exercising. But these days I have a lot of work, so I cannot. From next month I want to make time and exercise again.',
        ),
      ),
    ],
  },
  {
    id: 'mock-3',
    kind: 'topik2',
    title: L(
      'Simulado no formato TOPIK II nº 1',
      'TOPIK II-style mock exam #1',
    ),
    minutes: 40,
    questions: [
      listening(
        'l1',
        LISTEN_CONTINUE,
        [
          { speaker: 1, text: '이번 주말에 등산 갈래요?' },
          { speaker: 0, text: '좋아요. 그런데 주말에 비가 온다고 하던데요.' },
        ],
        [
          '그럼 날씨를 보고 다시 정해요.',
          '등산을 좋아하지 않아요.',
          '지난주에 비가 왔어요.',
          '우산을 안 가져왔어요.',
        ],
        L(
          '(Mulher) Vamos fazer trilha neste fim de semana? (Homem) Vamos. Mas ouvi dizer que vai chover no fim de semana.',
          '(Woman) Shall we go hiking this weekend? (Man) Sure. But I heard it is going to rain this weekend.',
        ),
      ),
      listening(
        'l2',
        LISTEN_CONTINUE,
        [
          { speaker: 0, text: '이 프린터가 또 고장 났네요.' },
          { speaker: 1, text: '어제 수리 기사님이 고쳐 주셨는데 왜 그럴까요?' },
        ],
        [
          '다시 연락해서 와 달라고 해야겠어요.',
          '프린터를 처음 사 봤어요.',
          '어제는 회사에 안 왔어요.',
          '종이를 많이 샀어요.',
        ],
        L(
          '(Homem) Esta impressora quebrou de novo. (Mulher) O técnico consertou ontem; por que será?',
          '(Man) This printer is broken again. (Woman) The technician fixed it yesterday; I wonder why.',
        ),
      ),
      listening(
        'l3',
        LISTEN_CONTINUE,
        [
          { speaker: 1, text: '주문한 책이 아직 안 왔는데요.' },
          { speaker: 0, text: '죄송합니다. 주문 번호를 알려 주시겠어요?' },
        ],
        [
          '네, 잠깐만요. 지금 찾아볼게요.',
          '책을 아주 좋아해요.',
          '다음 주에 주문할 거예요.',
          '서점이 문을 닫았어요.',
        ],
        L(
          '(Mulher) O livro que encomendei ainda não chegou. (Homem) Desculpe. Pode me passar o número do pedido?',
          '(Woman) The book I ordered has not arrived yet. (Man) I am sorry. Could you give me the order number?',
        ),
      ),
      listening(
        'l4',
        LISTEN_WOMAN_ACTION,
        [
          { speaker: 0, text: '회의 자료는 다 준비됐어요?' },
          { speaker: 1, text: '네, 그런데 복사를 아직 못 했어요.' },
          {
            speaker: 0,
            text: '회의가 삼십 분 후에 시작하니까 지금 해 주세요.',
          },
          { speaker: 1, text: '네, 바로 할게요.' },
        ],
        [
          '자료를 복사한다.',
          '회의실을 예약한다.',
          '회의를 시작한다.',
          '자료를 만든다.',
        ],
        L(
          '— Os materiais da reunião estão prontos? — Sim, mas ainda não consegui tirar as cópias. — A reunião começa em trinta minutos, então faça agora, por favor. — Certo, vou fazer já.',
          '— Are the meeting materials ready? — Yes, but I have not made the copies yet. — The meeting starts in thirty minutes, so please do it now. — Okay, right away.',
        ),
      ),
      listening(
        'l5',
        LISTEN_WOMAN_ACTION,
        [
          { speaker: 1, text: '손님, 이 바지는 지금 이 사이즈가 없는데요.' },
          { speaker: 0, text: '그럼 언제 들어와요?' },
          {
            speaker: 1,
            text: '내일 들어오는데 연락처를 남겨 주시면 전화 드릴게요.',
          },
          { speaker: 0, text: '네, 여기 제 번호예요.' },
        ],
        [
          '남자의 연락처를 받아 적는다.',
          '바지를 남자에게 준다.',
          '다른 가게에 전화한다.',
          '바지 사이즈를 바꾼다.',
        ],
        L(
          '— Senhor, não temos esta calça neste tamanho agora. — Quando chega? — Chega amanhã; se deixar seu contato, eu ligo. — Certo, aqui está meu número.',
          '— Sir, we do not have these trousers in this size right now. — When will they come in? — Tomorrow; if you leave your contact, I will call you. — Sure, here is my number.',
        ),
      ),
      listening(
        'l6',
        LISTEN_MATCH_HEARD,
        [
          {
            speaker: 0,
            text: '안내 말씀 드리겠습니다. 오늘 오후 두 시부터 네 시까지 엘리베이터 점검이 있습니다. 이 시간에는 계단을 이용해 주시기 바랍니다. 불편을 드려 죄송합니다.',
          },
        ],
        [
          '오후에 엘리베이터를 점검한다.',
          '엘리베이터 점검은 오전에 한다.',
          '점검 시간에도 엘리베이터를 탈 수 있다.',
          '점검 때문에 계단을 이용할 수 없다.',
        ],
        L(
          'Aviso: hoje, das 14h às 16h, haverá manutenção do elevador. Nesse horário, por favor, use as escadas. Pedimos desculpas pelo transtorno.',
          'Announcement: today from 2 to 4 p.m. the elevator will be inspected. Please use the stairs during that time. We apologize for the inconvenience.',
        ),
      ),
      listening(
        'l7',
        LISTEN_MATCH_HEARD,
        [
          { speaker: 1, text: '민수 씨, 요즘 회사 끝나고 뭐 해요?' },
          {
            speaker: 0,
            text: '수영을 배우고 있어요. 처음에는 물이 무서웠는데 지금은 재미있어요.',
          },
          { speaker: 1, text: '저도 배우고 싶었는데 같이 가도 돼요?' },
          {
            speaker: 0,
            text: '그럼요. 화요일하고 목요일 저녁에 수업이 있어요.',
          },
        ],
        [
          '남자는 저녁에 수영을 배운다.',
          '여자는 수영을 잘한다.',
          '남자는 지금도 물이 무섭다.',
          '수업은 주말에 있다.',
        ],
        L(
          '— Minsu, o que você faz depois do trabalho ultimamente? — Estou aprendendo a nadar. No começo eu tinha medo da água, mas agora é divertido. — Eu também queria aprender; posso ir junto? — Claro. As aulas são terça e quinta à noite.',
          '— Minsu, what do you do after work these days? — I am learning to swim. At first I was scared of the water, but now it is fun. — I wanted to learn too; may I come along? — Of course. Classes are on Tuesday and Thursday evenings.',
        ),
      ),
      listening(
        'l8',
        LISTEN_MAN_IDEA,
        [
          {
            speaker: 1,
            text: '요즘 아이들이 스마트폰을 너무 많이 하는 것 같아요.',
          },
          {
            speaker: 0,
            text: '맞아요. 하지만 무조건 못 하게 하는 것보다 사용 시간을 아이와 같이 정하는 게 더 좋다고 생각해요.',
          },
        ],
        [
          '아이와 함께 스마트폰 사용 시간을 정해야 한다.',
          '아이들은 스마트폰을 쓰면 안 된다.',
          '스마트폰은 공부에 꼭 필요하다.',
          '부모가 스마트폰을 더 많이 써야 한다.',
        ],
        L(
          '— Parece que as crianças usam o celular demais hoje em dia. — É verdade. Mas, em vez de simplesmente proibir, acho melhor definir o tempo de uso junto com a criança.',
          '— Children seem to use smartphones far too much these days. — True. But rather than simply forbidding it, I think it is better to set the screen time together with the child.',
        ),
      ),
      listening(
        'l9',
        LISTEN_MAN_IDEA,
        [
          {
            speaker: 0,
            text: '회사 근처로 이사하려고요. 출퇴근하는 데 두 시간이나 걸려서 너무 피곤해요.',
          },
          { speaker: 1, text: '그래도 지금 사는 동네가 조용하고 좋잖아요.' },
          {
            speaker: 0,
            text: '조용한 것도 좋지만 시간을 아끼는 게 저한테는 더 중요해요.',
          },
        ],
        [
          '출퇴근 시간을 줄이는 것이 더 중요하다.',
          '조용한 동네에서 사는 것이 가장 좋다.',
          '회사를 옮기는 것이 좋다.',
          '이사는 돈이 많이 든다.',
        ],
        L(
          '— Vou me mudar para perto da empresa. Levo duas horas no trajeto e fico muito cansado. — Mas o bairro onde você mora é tranquilo e bom. — Tranquilidade é bom, mas para mim economizar tempo é mais importante.',
          '— I am going to move near my office. My commute takes two hours and I am exhausted. — But your neighborhood is quiet and nice. — Quiet is nice, but saving time matters more to me.',
        ),
      ),
      listening(
        'l10',
        LISTEN_MATCH_HEARD,
        [
          {
            speaker: 1,
            text: '이번에 처음으로 책을 내셨는데요, 어떤 책인가요?',
          },
          {
            speaker: 0,
            text: '네, 제가 10년 동안 여러 나라를 여행하면서 먹은 음식에 대한 이야기예요. 음식을 통해 그 나라 사람들의 생활을 소개하고 싶었습니다.',
          },
        ],
        [
          '남자는 여행하면서 먹은 음식에 대한 책을 썼다.',
          '남자는 요리책을 여러 권 냈다.',
          '남자는 한 나라에서 10년 동안 살았다.',
          '이 책은 여행하는 방법을 소개한다.',
        ],
        L(
          '— O senhor acaba de lançar seu primeiro livro. Sobre o que é? — É sobre as comidas que provei viajando por vários países durante dez anos. Quis mostrar a vida das pessoas de cada país através da comida.',
          '— You have just published your first book. What is it about? — It is about the food I ate while traveling to many countries over ten years. I wanted to show how people live through their food.',
        ),
      ),

      reading(
        'r1',
        READ_GRAMMAR,
        '어제는 너무 피곤해서 집에 오자마자 (    ).',
        ['잠이 들었다', '잠이 들 것이다', '잠이 들려고 한다', '잠이 들고 싶다'],
        L(
          'Ontem eu estava tão cansado que (adormeci) assim que cheguei em casa.',
          'Yesterday I was so tired that I (fell asleep) as soon as I got home.',
        ),
      ),
      reading(
        'r2',
        READ_GRAMMAR,
        '시험에 (    ) 요즘 매일 도서관에서 공부하고 있다.',
        ['합격하려고', '합격해서', '합격하지만', '합격하거나'],
        L(
          '(Para passar) na prova, ultimamente estudo todos os dias na biblioteca.',
          '(In order to pass) the exam, I study at the library every day these days.',
        ),
      ),
      reading(
        'r3',
        READ_SIMILAR,
        '친구를 만나러 〔가는 길에〕 꽃집에 들러서 꽃을 샀다.',
        ['가다가', '가더니', '가자마자', '가려면'],
        L(
          '(No caminho) para encontrar um amigo, passei numa floricultura e comprei flores.',
          '(On the way) to meet a friend, I stopped by a florist and bought flowers.',
        ),
      ),
      reading(
        'r4',
        READ_SIMILAR,
        '내일 날씨가 좋으면 공원에 〔갈 생각이다〕.',
        ['가려고 한다', '간 적이 있다', '가도 된다', '갈 수 없다'],
        L(
          'Se amanhã fizer tempo bom, (pretendo ir) ao parque.',
          'If the weather is nice tomorrow, I (am planning to go) to the park.',
        ),
      ),
      reading(
        'r5',
        READ_WHAT_ABOUT,
        '깨끗한 물, 건강한 하루!\n하루에 여덟 잔, 잊지 말고 마시세요.',
        ['물', '운동', '병원', '음식'],
        L(
          'Água limpa, um dia saudável! Oito copos por dia, não se esqueça de beber.',
          'Clean water, a healthy day! Eight glasses a day, do not forget to drink.',
        ),
      ),
      reading(
        'r6',
        READ_WHAT_ABOUT,
        '책 속에 길이 있습니다.\n매달 둘째 주 토요일, 구립 도서관에서 작가와의 만남',
        ['도서관 행사 안내', '서점 할인 광고', '작가 모집 안내', '이사 안내'],
        L(
          'Há um caminho dentro dos livros. Todo segundo sábado do mês, encontro com autores na biblioteca municipal.',
          'There is a path inside books. Every second Saturday of the month, meet an author at the district library.',
        ),
      ),
      reading(
        'r7',
        READ_MATCH,
        '〈봄맞이 벼룩시장〉\n• 일시: 4월 12일(토) 오전 10시~오후 4시\n• 장소: 한강공원 주차장\n• 판매 물건: 옷, 책, 장난감 등 쓰던 물건\n• 비가 오면 다음 주 토요일로 연기됩니다.',
        [
          '비가 오면 행사가 다음 주로 미뤄진다.',
          '새 물건만 팔 수 있다.',
          '행사는 일요일에 열린다.',
          '행사는 밤늦게까지 한다.',
        ],
        L(
          'Feira de troca de primavera — 12 de abril (sábado), das 10h às 16h, no estacionamento do Parque Hangang. Itens à venda: roupas, livros, brinquedos e outros objetos usados. Em caso de chuva, fica para o sábado seguinte.',
          'Spring flea market — April 12 (Saturday), 10 a.m. to 4 p.m., Hangang Park parking lot. Items: clothes, books, toys and other used goods. If it rains, it is postponed to the following Saturday.',
        ),
      ),
      reading(
        'r8',
        READ_MATCH,
        '요즘 혼자 밥을 먹는 사람이 늘고 있다. 그래서 1인분 메뉴를 파는 식당도 많아졌다. 예전에는 혼자 식당에 가는 것을 어색하게 생각했지만 지금은 자연스러운 일이 되었다.',
        [
          '혼자 식당에 가는 것이 이제는 자연스럽다.',
          '1인분 메뉴를 파는 식당이 줄었다.',
          '혼자 밥을 먹는 사람이 줄고 있다.',
          '예전에도 혼자 식당에 가는 것이 자연스러웠다.',
        ],
        L(
          'Cada vez mais gente come sozinha. Por isso, também aumentaram os restaurantes com pratos individuais. Antes, ir sozinho a um restaurante parecia estranho; hoje é algo natural.',
          'More and more people eat alone these days, so more restaurants sell single portions. Going to a restaurant alone used to feel awkward, but now it is perfectly normal.',
        ),
      ),
      reading(
        'r9',
        READ_GRAMMAR,
        '잠을 잘 자려면 자기 전에 스마트폰을 보지 않는 것이 좋다. 스마트폰의 밝은 빛이 (    ) 때문이다.',
        [
          '잠을 방해하기',
          '잠이 잘 오게 하기',
          '눈을 쉬게 하기',
          '기분을 좋게 하기',
        ],
        L(
          'Para dormir bem, é melhor não olhar o celular antes de deitar. Isso porque a luz forte da tela (atrapalha o sono).',
          'To sleep well, it is better not to look at your phone before bed. That is because the bright light of the screen (disturbs sleep).',
        ),
      ),
      reading(
        'r10',
        READ_THEME,
        '실수는 누구나 한다. 중요한 것은 실수를 한 후에 어떻게 하느냐이다. 실수를 숨기기보다 인정하고 같은 실수를 다시 하지 않도록 노력하는 사람이 더 크게 성장할 수 있다.',
        [
          '실수를 인정하고 고치려고 노력하는 것이 중요하다.',
          '실수를 하지 않는 것이 가장 중요하다.',
          '실수는 다른 사람에게 숨기는 것이 좋다.',
          '실수를 많이 하는 사람은 성장할 수 없다.',
        ],
        L(
          'Todo mundo erra. O importante é o que se faz depois do erro. Quem reconhece o erro em vez de escondê-lo, e se esforça para não repeti-lo, pode crescer muito mais.',
          'Everyone makes mistakes. What matters is what you do afterwards. People who admit their mistakes instead of hiding them, and try not to repeat them, can grow much more.',
        ),
      ),
    ],
  },
]

export function getMockExam(id: string): MockExam | undefined {
  return MOCK_EXAMS.find((e) => e.id === id)
}

/**
 * Official cut-offs, applied as ratios to the shorter mocks:
 * TOPIK I (200 points): level 1 from 80, level 2 from 140.
 * TOPIK II (300 points, writing included): level 3 from 120, 4 from 150,
 * 5 from 190, 6 from 230.
 */
const CUTOFFS: Record<ExamKind, [level: number, ratio: number][]> = {
  topik1: [
    [2, 140 / 200],
    [1, 80 / 200],
  ],
  topik2: [
    [6, 230 / 300],
    [5, 190 / 300],
    [4, 150 / 300],
    [3, 120 / 300],
  ],
}

/** Estimated level (0 = below the exam's lowest level). Not a real result. */
export function estimateTopikLevel(
  score: number,
  max: number,
  kind: ExamKind = 'topik1',
): number {
  const ratio = max > 0 ? score / max : 0
  return CUTOFFS[kind].find(([, cutoff]) => ratio >= cutoff)?.[0] ?? 0
}

/** Lowest level an exam kind can certify. */
export const LOWEST_LEVEL: Record<ExamKind, number> = { topik1: 1, topik2: 3 }
