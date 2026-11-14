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
  {
    id: 'jeju-trip',
    level: 2,
    title: L('Viagem a Jeju', 'A trip to Jeju'),
    paragraphs: [
      p(
        '저는 [작년](last-year) [여름](summer)에 [처음](first-time) 제주도에 [갔어요](go). [비행기](airplane)를 [타고](ride) 한 시간쯤 [걸렸어요](take-time). 제주도는 [바다](sea)가 정말 [예쁜데](pretty) [바람](wind)이 많이 [불어요](blow).',
        'No verão do ano passado fui a Jeju pela primeira vez. Fui de avião, e a viagem levou mais ou menos uma hora. O mar de Jeju é lindo, mas venta muito.',
        'Last summer I went to Jeju for the first time. I took a plane, and it took about an hour. The sea in Jeju is really beautiful, but it is very windy.',
      ),
      p(
        '[한라산](hallasan)에 [올라가 봤어요](climb). [힘들었지만](hard) [산](mountain) [위](top)에서 [본](see) [경치](view)가 [아주](very) [좋았어요](good). [그리고](and-then) [흑돼지](black-pork) [고기](meat)를 [먹어 봤는데](eat) 정말 [맛있었어요](delicious).',
        'Subi o Hallasan. Foi cansativo, mas a vista lá de cima era muito bonita. Também provei carne de porco preto, e estava deliciosa.',
        'I tried climbing Hallasan. It was tiring, but the view from the top was great. I also tried black pork, and it was delicious.',
      ),
      p(
        '[다음](next)에는 [가족](family)과 [같이](together) [가려고 해요](go). 제주도에 [가 본 적이 없으면](go) 꼭 [가 보세요](go)!',
        'Da próxima vez, pretendo ir com a minha família. Se você nunca foi a Jeju, vá sem falta!',
        'Next time I plan to go with my family. If you have never been to Jeju, you should definitely go!',
      ),
    ],
    glossary: {
      'last-year': g('작년', 'ano passado', 'last year'),
      'first-time': g(
        '처음',
        'primeira vez; começo',
        'the first time; the beginning',
      ),
      'take-time': g('걸리다', 'levar (tempo)', 'to take (time)'),
      blow: g('불다', 'soprar (vento)', 'to blow (wind)'),
      hallasan: g(
        '한라산',
        'Hallasan, a montanha mais alta da Coreia do Sul',
        'Hallasan, the highest mountain in South Korea',
      ),
      climb: g('올라가다', 'subir', 'to go up; to climb'),
      hard: g('힘들다', 'ser cansativo, difícil', 'to be tiring, hard'),
      top: g('위', 'cima; topo', 'top; above'),
      view: g('경치', 'paisagem, vista', 'scenery, view'),
      'and-then': g('그리고', 'e; e também', 'and; and also'),
      'black-pork': g(
        '흑돼지',
        'porco preto (especialidade de Jeju)',
        'black pork (a Jeju specialty)',
      ),
      next: g('다음', 'próximo; seguinte', 'next'),
    },
    questions: [
      {
        question: L(
          'Quando a pessoa foi a Jeju?',
          'When did the person go to Jeju?',
        ),
        choices: [
          L('No verão do ano passado', 'Last summer'),
          L('No inverno passado', 'Last winter'),
          L('Nesta primavera', 'This spring'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Como foi subir o Hallasan?',
          'What was climbing Hallasan like?',
        ),
        choices: [
          L(
            'Cansativo, mas a vista era bonita',
            'Tiring, but the view was great',
          ),
          L('Fácil e rápido', 'Easy and quick'),
          L('Ela não conseguiu subir', "She couldn't make it up"),
        ],
        answer: 0,
      },
      {
        question: L(
          'Com quem ela pretende ir da próxima vez?',
          'Who does she plan to go with next time?',
        ),
        choices: [
          L('Com a família', 'With her family'),
          L('Com os amigos', 'With friends'),
          L('Sozinha', 'Alone'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'at-the-clinic',
    level: 2,
    title: L('No médico', 'At the doctor'),
    paragraphs: [
      p(
        '[어제](yesterday)부터 [머리](head)가 [아프고](hurt) [열](fever)이 [났어요](rise). 그래서 [오늘](today) [아침](morning)에 [병원](hospital)에 [갔어요](go).',
        'Desde ontem estou com dor de cabeça e febre. Por isso, hoje de manhã fui ao médico.',
        'Since yesterday I have had a headache and a fever. So this morning I went to the doctor.',
      ),
      p(
        '[의사 선생님](doctor)이 "[감기](cold-illness)예요. 이 [약](medicine)을 [하루](a-day)에 세 번 [드세요](eat). 그리고 [물](water)을 많이 [마셔야 해요](drink)."라고 [말했어요](speak).',
        'O médico disse: "É um resfriado. Tome este remédio três vezes ao dia. E você precisa beber bastante água."',
        'The doctor said: "It\'s a cold. Take this medicine three times a day. And you need to drink plenty of water."',
      ),
      p(
        '"[술](alcohol)을 [마시면 안 돼요](drink). [푹](deeply) [쉬어야 해요](rest)." 저는 [집](house)에 [와서](come) [약](medicine)을 [먹고](eat) [잤어요](sleep). [지금](now)은 [조금](a-little) [괜찮아요](its-okay).',
        '"Não pode beber álcool. Você precisa descansar bem." Voltei para casa, tomei o remédio e dormi. Agora estou um pouco melhor.',
        '"You must not drink alcohol. You need to get plenty of rest." I came home, took the medicine and slept. Now I feel a little better.',
      ),
    ],
    glossary: {
      fever: g('열', 'febre', 'fever'),
      rise: g('나다', 'surgir; (febre) dar', 'to come out; (a fever) to start'),
      'a-day': g('하루', 'um dia', 'one day; a day'),
      deeply: g(
        '푹',
        '(descansar, dormir) bem, profundamente',
        '(rest, sleep) well, deeply',
      ),
      rest: g('쉬다', 'descansar', 'to rest'),
    },
    questions: [
      {
        question: L('Qual era o problema?', 'What was the problem?'),
        choices: [
          L('Um resfriado', 'A cold'),
          L('Dor de barriga', 'A stomach ache'),
          L('Uma perna quebrada', 'A broken leg'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Quantas vezes por dia ela deve tomar o remédio?',
          'How many times a day should she take the medicine?',
        ),
        choices: [L('Três', 'Three'), L('Duas', 'Two'), L('Uma', 'Once')],
        answer: 0,
      },
      {
        question: L(
          'O que o médico disse que ela não pode fazer?',
          'What did the doctor say she must not do?',
        ),
        choices: [
          L('Beber álcool', 'Drink alcohol'),
          L('Beber água', 'Drink water'),
          L('Dormir', 'Sleep'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'library-rules',
    level: 3,
    title: L('Regras da biblioteca', 'Library rules'),
    paragraphs: [
      p(
        '〈[도서관](library) [이용](use) [안내](guide)〉 [도서관](library)은 [평일](weekday)에는 [오전](am) 아홉 시부터 [오후](pm) 열 시까지, [주말](weekend)에는 [오후](pm) 여섯 시까지 [이용할 수 있습니다](use-v).',
        'Guia de uso da biblioteca. A biblioteca funciona nos dias úteis das 9h às 22h e, nos fins de semana, até as 18h.',
        'Library guide. The library is open on weekdays from 9 a.m. to 10 p.m., and on weekends until 6 p.m.',
      ),
      p(
        '[책](book)은 한 [사람](person)이 다섯 권까지 [빌릴 수 있고](borrow), 2주 [동안](during) [읽을 수 있습니다](read). [열람실](reading-room)에서 [음식](food)을 [먹으면 안 됩니다](eat). [물](water)은 [마셔도 됩니다](drink).',
        'Cada pessoa pode pegar até cinco livros emprestados e ficar com eles por duas semanas. Não é permitido comer na sala de leitura. Beber água é permitido.',
        'Each person can borrow up to five books and keep them for two weeks. Eating is not allowed in the reading room. Drinking water is allowed.',
      ),
      p(
        '[핸드폰](phone)은 [진동](vibrate)으로 [바꿔야 합니다](change). [전화](phone-call)를 [받을 때](receive)는 [밖](outside)으로 [나가 주세요](go-out). [조용한](quiet) [도서관](library)을 [함께](together-formal) [만들어요](make)!',
        'O celular deve ficar no modo vibrar. Para atender ligações, saia da sala. Vamos manter juntos uma biblioteca silenciosa!',
        'Phones must be set to vibrate. Please step outside to take calls. Let us keep the library quiet together!',
      ),
    ],
    glossary: {
      use: g('이용', 'uso, utilização', 'use, usage'),
      guide: g('안내', 'guia, informação', 'guide, information'),
      weekday: g('평일', 'dia útil', 'weekday'),
      am: g('오전', 'manhã (a.m.)', 'morning (a.m.)'),
      pm: g('오후', 'tarde (p.m.)', 'afternoon (p.m.)'),
      'use-v': g('이용하다', 'usar, utilizar', 'to use'),
      borrow: g('빌리다', 'pegar emprestado', 'to borrow'),
      during: g('동안', 'durante', 'during, for'),
      'reading-room': g('열람실', 'sala de leitura', 'reading room'),
      vibrate: g('진동', 'vibração; modo vibrar', 'vibration; vibrate mode'),
      change: g('바꾸다', 'mudar, trocar', 'to change'),
      receive: g('받다', 'receber; atender', 'to receive; to answer (a call)'),
      outside: g('밖', 'fora', 'outside'),
      'go-out': g('나가다', 'sair', 'to go out'),
      quiet: g('조용하다', 'ser silencioso', 'to be quiet'),
      'together-formal': g('함께', 'juntos', 'together'),
    },
    questions: [
      {
        question: L(
          'Até que horas a biblioteca abre no fim de semana?',
          'Until what time is the library open on weekends?',
        ),
        choices: [L('18h', '6 p.m.'), L('22h', '10 p.m.'), L('9h', '9 a.m.')],
        answer: 0,
      },
      {
        question: L(
          'Quantos livros cada pessoa pode pegar?',
          'How many books can each person borrow?',
        ),
        choices: [L('Cinco', 'Five'), L('Dois', 'Two'), L('Dez', 'Ten')],
        answer: 0,
      },
      {
        question: L(
          'O que é permitido na sala de leitura?',
          'What is allowed in the reading room?',
        ),
        choices: [
          L('Beber água', 'Drinking water'),
          L('Comer', 'Eating'),
          L('Falar ao telefone', 'Talking on the phone'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'moving-to-seoul',
    level: 3,
    title: L('Como acabei morando em Seul', 'How I ended up in Seoul'),
    paragraphs: [
      p(
        '저는 [브라질](brazil) [사람](person)이에요. [대학교](university)에서 [한국어](korean-language)를 [공부했는데](study) 3년 전에 [회사](company) 일 [때문에](because-of) [서울](seoul)에 [살게 됐어요](live).',
        'Sou brasileira. Estudei coreano na faculdade e, há três anos, por causa do trabalho, acabei vindo morar em Seul.',
        "I'm Brazilian. I studied Korean at university, and three years ago I ended up living in Seoul because of work.",
      ),
      p(
        '[처음](first-time)에는 [말](words)도 [잘](well) [못 하고](cannot-do) [음식](food)도 너무 [매워서](spicy) [힘들었어요](hard). [하지만](but) [친구](friend)들이 많이 [도와줬기 때문에](help) [금방](soon) [익숙해졌어요](get-used).',
        'No começo eu não falava bem e a comida era apimentada demais, então foi difícil. Mas, como meus amigos me ajudaram muito, logo me acostumei.',
        "At first I couldn't speak well and the food was too spicy, so it was hard. But because my friends helped me a lot, I soon got used to it.",
      ),
      p(
        '[지금](now)은 [김치찌개](kimchi-stew)를 제일 [좋아하게 됐어요](like). [나중에](later) [브라질](brazil)에 [돌아가면](return) [한국](korea) [음식](food)이 [그리울](miss) 것 같아요.',
        'Hoje o kimchi-jjigae virou meu prato favorito. Quando eu voltar ao Brasil, acho que vou sentir falta da comida coreana.',
        "Now kimchi stew has become my favorite food. When I go back to Brazil, I think I'll miss Korean food.",
      ),
    ],
    glossary: {
      brazil: g('브라질', 'Brasil', 'Brazil'),
      university: g('대학교', 'universidade, faculdade', 'university'),
      'because-of': g('때문에', 'por causa de', 'because of'),
      'first-time': g(
        '처음',
        'primeira vez; começo',
        'the first time; the beginning',
      ),
      words: g('말', 'fala; língua', 'speech; language'),
      well: g('잘', 'bem', 'well'),
      'cannot-do': g('못 하다', 'não conseguir fazer', 'to be unable to do'),
      hard: g('힘들다', 'ser difícil, cansativo', 'to be hard, tiring'),
      but: g('하지만', 'mas, porém', 'but, however'),
      help: g('도와주다', 'ajudar', 'to help'),
      soon: g('금방', 'logo, rapidamente', 'soon, quickly'),
      'get-used': g('익숙해지다', 'acostumar-se', 'to get used to'),
      'kimchi-stew': g(
        '김치찌개',
        'kimchi-jjigae (ensopado de kimchi)',
        'kimchi stew',
      ),
      return: g('돌아가다', 'voltar', 'to go back'),
      miss: g('그립다', 'sentir falta, ter saudade', 'to miss, to long for'),
    },
    questions: [
      {
        question: L(
          'Por que ela foi morar em Seul?',
          'Why did she move to Seoul?',
        ),
        choices: [
          L('Por causa do trabalho', 'Because of work'),
          L('Para estudar', 'To study'),
          L('Por causa da família', 'Because of family'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que a ajudou a se acostumar?',
          'What helped her get used to it?',
        ),
        choices: [
          L('Os amigos', 'Her friends'),
          L('A televisão', 'Television'),
          L('Um curso de coreano', 'A Korean course'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Qual é a comida favorita dela agora?',
          'What is her favorite food now?',
        ),
        choices: [
          L('Kimchi-jjigae', 'Kimchi stew'),
          L('Bibimbap', 'Bibimbap'),
          L('Ramyeon', 'Ramyeon'),
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
