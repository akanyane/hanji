import type { Localized } from '../../i18n/locales'
import { L } from '../grammar/types'
import type { ComprehensionQuestion } from '../listening/dialogues'
import type { TopikLevel } from '../vocabulary/types'

/**
 * A graded reading text. Paragraphs use a light markup for the clickable
 * glossary: `[surface](key)`, where `key` is a vocabulary word id (which can
 * then be added to spaced repetition) or a key of the text's own glossary.
 */
export interface ReadingText {
  id: string
  level: TopikLevel
  title: Localized
  paragraphs: Array<{ ko: string; translation: Localized }>
  /** Words not in the vocabulary bank. */
  glossary: Record<string, { base: string; meaning: Localized }>
  questions: ComprehensionQuestion[]
}

const p = (ko: string, pt: string, en: string) => ({
  ko,
  translation: L(pt, en),
})
const g = (base: string, pt: string, en: string) => ({
  base,
  meaning: L(pt, en),
})

export const READING_TEXTS: ReadingText[] = [
  {
    id: 'self-introduction',
    level: 1,
    title: L('Prazer, eu sou o Minsu', 'Hi, I am Minsu'),
    paragraphs: [
      p(
        '안녕하세요. 제 [이름](name)은 민수예요. 저는 [한국](korea) [사람](person)이에요. 저는 [학생](student)이에요. [서울](seoul)에 [살아요](live).',
        'Olá. Meu nome é Minsu. Sou coreano. Sou estudante. Moro em Seul.',
        "Hello. My name is Minsu. I'm Korean. I'm a student. I live in Seoul.",
      ),
      p(
        '우리 [가족](family)은 네 명이에요. [아버지](father), [어머니](mother), [동생](younger-sibling), [그리고](and-then) 저예요. 저는 [음악](music)을 [좋아해요](like). 만나서 [반가워요](nice-to-meet-you)!',
        'Minha família tem quatro pessoas: meu pai, minha mãe, meu irmão mais novo e eu. Eu gosto de música. Prazer em te conhecer!',
        'There are four people in my family: my father, my mother, my younger sibling and me. I like music. Nice to meet you!',
      ),
    ],
    glossary: { 'and-then': g('그리고', 'e; e também', 'and; and also') },
    questions: [
      {
        question: L('Onde o Minsu mora?', 'Where does Minsu live?'),
        choices: [
          L('Em Seul', 'In Seoul'),
          L('Em Busan', 'In Busan'),
          L('No Brasil', 'In Brazil'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Quantas pessoas há na família dele?',
          'How many people are in his family?',
        ),
        choices: [L('Quatro', 'Four'), L('Três', 'Three'), L('Cinco', 'Five')],
        answer: 0,
      },
      {
        question: L('Do que ele gosta?', 'What does he like?'),
        choices: [
          L('De música', 'Music'),
          L('De filmes', 'Movies'),
          L('De esportes', 'Sports'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'my-day',
    level: 1,
    title: L('O meu dia', 'My day'),
    paragraphs: [
      p(
        '저는 [매일](every-day) [아침](morning) 일곱 시에 [일어나요](get-up). [아침](morning)에 [빵](bread)을 [먹고](eat) [커피](coffee)를 [마셔요](drink). 여덟 시에 [버스](bus)를 [타고](ride) [회사](company)에 [가요](go).',
        'Todo dia acordo às sete da manhã. De manhã como pão e bebo café. Às oito pego o ônibus e vou para a empresa.',
        'I get up at seven every morning. In the morning I eat bread and drink coffee. At eight I take the bus to work.',
      ),
      p(
        '[점심](lunch)은 [회사](company) [근처](nearby) [식당](restaurant)에서 [먹어요](eat). [저녁](evening)에는 [집](house)에서 [요리](cooking)를 해요. [밤](night) 열한 시에 [자요](sleep).',
        'Almoço num restaurante perto da empresa. À noite cozinho em casa. Durmo às onze da noite.',
        'I have lunch at a restaurant near the office. In the evening I cook at home. I go to bed at eleven at night.',
      ),
    ],
    glossary: { nearby: g('근처', 'perto; arredores', 'nearby; vicinity') },
    questions: [
      {
        question: L(
          'A que horas a pessoa acorda?',
          'What time does the person get up?',
        ),
        choices: [
          L('Às sete', 'At seven'),
          L('Às oito', 'At eight'),
          L('Às onze', 'At eleven'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Como ela vai para o trabalho?',
          'How does the person go to work?',
        ),
        choices: [
          L('De ônibus', 'By bus'),
          L('De metrô', 'By subway'),
          L('A pé', 'On foot'),
        ],
        answer: 0,
      },
      {
        question: L('Onde ela janta?', 'Where does the person have dinner?'),
        choices: [
          L('Em casa', 'At home'),
          L('No restaurante', 'At a restaurant'),
          L('Na empresa', 'At the office'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'market-weekend',
    level: 2,
    title: L('Um fim de semana no mercado', 'A weekend at the market'),
    paragraphs: [
      p(
        '[지난](last) [주말](weekend)에 [친구](friend)하고 [시장](market)에 갔어요. [시장](market)에는 [사람](person)이 정말 [많았어요](many). 우리는 [과일](fruit)과 [옷](clothes)을 [샀어요](buy). [사과](apple)가 아주 [싸고](cheap) [맛있었어요](delicious).',
        'No fim de semana passado fui ao mercado com um amigo. Havia muita gente no mercado. Compramos frutas e roupas. As maçãs eram muito baratas e gostosas.',
        'Last weekend I went to the market with a friend. There were a lot of people there. We bought fruit and clothes. The apples were very cheap and tasty.',
      ),
      p(
        '[점심](lunch)에는 [떡볶이](tteokbokki)를 먹었어요. 조금 [매웠지만](spicy) [맛있었어요](delicious). 정말 [재미있는](fun) [하루](day)였어요.',
        'No almoço comemos tteokbokki. Estava um pouco apimentado, mas gostoso. Foi um dia muito divertido.',
        'For lunch we had tteokbokki. It was a little spicy, but delicious. It was a really fun day.',
      ),
    ],
    glossary: {
      last: g('지난', 'passado (o último)', 'last (the previous)'),
      tteokbokki: g(
        '떡볶이',
        'tteokbokki (bolinho de arroz apimentado)',
        'tteokbokki (spicy rice cakes)',
      ),
      day: g('하루', 'um dia', 'a day'),
    },
    questions: [
      {
        question: L(
          'Com quem a pessoa foi ao mercado?',
          'Who did the person go to the market with?',
        ),
        choices: [
          L('Com um amigo', 'With a friend'),
          L('Com a mãe', 'With their mother'),
          L('Sozinha', 'Alone'),
        ],
        answer: 0,
      },
      {
        question: L('O que eles compraram?', 'What did they buy?'),
        choices: [
          L('Frutas e roupas', 'Fruit and clothes'),
          L('Livros', 'Books'),
          L('Sapatos', 'Shoes'),
        ],
        answer: 0,
      },
      {
        question: L('Como estava o tteokbokki?', 'How was the tteokbokki?'),
        choices: [
          L(
            'Um pouco apimentado, mas gostoso',
            'A little spicy, but delicious',
          ),
          L('Frio', 'Cold'),
          L('Caro demais', 'Too expensive'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'seasons',
    level: 2,
    title: L('As estações na Coreia', 'Seasons in Korea'),
    paragraphs: [
      p(
        '[한국](korea)에는 [봄](spring), [여름](summer), [가을](autumn), [겨울](winter)이 있어요. [봄](spring)에는 [꽃](flower)이 많이 [피어요](bloom). [여름](summer)은 [덥고](hot) [비](rain)가 많이 와요.',
        'A Coreia tem primavera, verão, outono e inverno. Na primavera muitas flores desabrocham. O verão é quente e chove muito.',
        'Korea has spring, summer, autumn and winter. In spring, lots of flowers bloom. Summer is hot and rainy.',
      ),
      p(
        '[가을](autumn)에는 [날씨](weather)가 [좋아서](good) [산](mountain)에 가는 [사람](person)이 [많아요](many). [겨울](winter)은 아주 [추워요](cold). [눈](snow)도 와요.',
        'No outono o tempo é bom, então muita gente vai às montanhas. O inverno é muito frio. Também neva.',
        'In autumn the weather is nice, so many people go to the mountains. Winter is very cold. It also snows.',
      ),
    ],
    glossary: { bloom: g('피다', 'desabrochar; florescer', 'to bloom') },
    questions: [
      {
        question: L(
          'Em que estação chove muito?',
          'In which season does it rain a lot?',
        ),
        choices: [
          L('No verão', 'Summer'),
          L('No inverno', 'Winter'),
          L('Na primavera', 'Spring'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Por que muita gente vai às montanhas no outono?',
          'Why do many people go to the mountains in autumn?',
        ),
        choices: [
          L('Porque o tempo é bom', 'Because the weather is nice'),
          L('Porque neva', 'Because it snows'),
          L('Porque é feriado', "Because it's a holiday"),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'restaurant-manners',
    level: 2,
    title: L('Num restaurante coreano', 'At a Korean restaurant'),
    paragraphs: [
      p(
        '한국 [식당](restaurant)에서는 [물](water)이 [보통](usually) [무료](free)예요. [반찬](side-dishes)도 [무료](free)로 줘요. [반찬](side-dishes)이 더 [필요하면](need) "여기요!" 하고 [직원](staff)을 불러요.',
        'Em restaurantes coreanos, a água geralmente é de graça. Os acompanhamentos (banchan) também. Se precisar de mais banchan, chame o funcionário dizendo "Yeogiyo!".',
        'In Korean restaurants, water is usually free. Side dishes (banchan) are free too. If you need more, call the staff by saying "Yeogiyo!".',
      ),
      p(
        '[음식](food)을 다 [먹으면](eat) 카운터에서 [계산해요](pay). [팁](tip)은 주지 않아도 돼요.',
        'Depois de comer, você paga no caixa. Não é preciso dar gorjeta.',
        "When you finish eating, you pay at the counter. You don't need to tip.",
      ),
    ],
    glossary: {
      usually: g('보통', 'geralmente', 'usually'),
      free: g('무료', 'grátis', 'free (of charge)'),
      'side-dishes': g(
        '반찬',
        'acompanhamentos (banchan)',
        'side dishes (banchan)',
      ),
      need: g(
        '필요하다',
        'precisar; ser necessário',
        'to need; to be necessary',
      ),
      staff: g('직원', 'funcionário(a)', 'staff member'),
      pay: g('계산하다', 'pagar a conta', 'to pay the bill'),
      tip: g('팁', 'gorjeta', 'tip'),
    },
    questions: [
      {
        question: L(
          'A água nos restaurantes coreanos…',
          'Water in Korean restaurants is…',
        ),
        choices: [
          L('geralmente é grátis', 'usually free'),
          L('é sempre cara', 'always expensive'),
          L('não é servida', 'not served'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Como se chama o funcionário?',
          'How do you call the staff?',
        ),
        choices: [
          L('Dizendo "여기요!"', 'By saying "여기요!"'),
          L('Batendo palmas', 'By clapping'),
          L('Assobiando', 'By whistling'),
        ],
        answer: 0,
      },
      {
        question: L('E a gorjeta?', 'What about tipping?'),
        choices: [
          L('Não é preciso dar', "You don't need to tip"),
          L('É obrigatória', "It's mandatory"),
          L('É de 10%', "It's 10%"),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'letter',
    level: 3,
    title: L('Uma carta para a Ana', 'A letter to Ana'),
    paragraphs: [
      p(
        '보고 싶은 아나에게,',
        'Querida Ana (que estou com saudade),',
        'Dear Ana (whom I miss),',
      ),
      p(
        '잘 [지내요](get-along)? 저는 [요즘](these-days) 한국어 [수업](class) [때문에](because-of) [바빠요](busy). [수업](class)은 [어렵지만](difficult) 정말 [재미있어요](fun). [다음 달](next-month)에 [시험](exam)이 있어서 [매일](every-day) [도서관](library)에서 [공부해요](study).',
        'Como você está? Ando ocupado por causa das aulas de coreano. As aulas são difíceis, mas muito divertidas. Mês que vem tenho prova, então estudo na biblioteca todos os dias.',
        "How are you? I've been busy with my Korean classes lately. They're hard, but really fun. I have an exam next month, so I study at the library every day.",
      ),
      p(
        '[시험](exam)이 [끝나면](end) [같이](together) [여행](travel)을 가고 싶어요. [연락](contact) 기다릴게요. 민수가',
        'Quando a prova acabar, quero viajar com você. Fico esperando notícias. Do Minsu',
        "When the exam is over, I'd like us to travel together. I'll wait to hear from you. Minsu",
      ),
    ],
    glossary: {
      'get-along': g(
        '지내다',
        'passar (bem/mal); viver',
        'to get along; to be doing',
      ),
      'because-of': g('때문에', 'por causa de', 'because of'),
      'next-month': g('다음 달', 'mês que vem', 'next month'),
      end: g('끝나다', 'terminar', 'to end; to be over'),
      contact: g('연락', 'contato; notícia', 'contact; getting in touch'),
    },
    questions: [
      {
        question: L(
          'Por que o Minsu anda ocupado?',
          'Why has Minsu been busy?',
        ),
        choices: [
          L('Por causa das aulas de coreano', 'Because of his Korean classes'),
          L('Por causa do trabalho', 'Because of work'),
          L('Por causa de uma viagem', 'Because of a trip'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que acontece no mês que vem?',
          'What happens next month?',
        ),
        choices: [
          L('Uma prova', 'An exam'),
          L('Uma viagem', 'A trip'),
          L('Um aniversário', 'A birthday'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que ele quer fazer depois da prova?',
          'What does he want to do after the exam?',
        ),
        choices: [
          L('Viajar com a Ana', 'Travel with Ana'),
          L('Descansar sozinho', 'Rest alone'),
          L('Mudar de casa', 'Move house'),
        ],
        answer: 0,
      },
    ],
  },
]

export function getReadingText(id: string): ReadingText | undefined {
  return READING_TEXTS.find((t) => t.id === id)
}

export type ReadingToken =
  | { text: string; key?: undefined }
  | { text: string; key: string }

/** Splits glossary markup into plain and clickable tokens. */
export function parseReading(markup: string): ReadingToken[] {
  const tokens: ReadingToken[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  for (const match of markup.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ text: markup.slice(last, index) })
    tokens.push({ text: match[1], key: match[2] })
    last = index + match[0].length
  }
  if (last < markup.length) tokens.push({ text: markup.slice(last) })
  return tokens
}

/** The paragraph as plain Korean text (for audio). */
export function plainText(markup: string): string {
  return parseReading(markup)
    .map((t) => t.text)
    .join('')
}
