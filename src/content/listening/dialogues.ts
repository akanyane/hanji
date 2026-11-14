import type { Localized } from '../../i18n/locales'
import { L } from '../grammar/types'
import type { TopikLevel } from '../vocabulary/types'

export interface DialogueLine {
  /** Index into the dialogue's speakers. */
  speaker: number
  ko: string
  translation: Localized
}

export interface ComprehensionQuestion {
  question: Localized
  choices: Localized[]
  answer: number
}

export interface Dialogue {
  id: string
  level: TopikLevel
  title: Localized
  /** Speaker names; each gets a different voice pitch. */
  speakers: Localized[]
  lines: DialogueLine[]
  questions: ComprehensionQuestion[]
}

const line = (
  speaker: number,
  ko: string,
  pt: string,
  en: string,
): DialogueLine => ({
  speaker,
  ko,
  translation: L(pt, en),
})

export const DIALOGUES: Dialogue[] = [
  {
    id: 'cafe',
    level: 1,
    title: L('No café', 'At the café'),
    speakers: [L('Atendente', 'Barista'), L('Cliente', 'Customer')],
    lines: [
      line(
        0,
        '어서 오세요. 뭐 드릴까요?',
        'Bem-vindo(a). O que vai querer?',
        'Welcome. What can I get you?',
      ),
      line(
        1,
        '아이스 아메리카노 한 잔 주세요.',
        'Um americano gelado, por favor.',
        'One iced Americano, please.',
      ),
      line(
        0,
        '사이즈는 어떻게 해 드릴까요?',
        'Qual tamanho?',
        'What size would you like?',
      ),
      line(
        1,
        '큰 걸로 주세요.',
        'O grande, por favor.',
        'A large one, please.',
      ),
      line(
        0,
        '네, 사천오백 원입니다.',
        'Certo, são 4.500 wons.',
        "Okay, that's 4,500 won.",
      ),
      line(
        1,
        '카드로 계산할게요.',
        'Vou pagar com cartão.',
        "I'll pay by card.",
      ),
    ],
    questions: [
      {
        question: L('O que o cliente pediu?', 'What did the customer order?'),
        choices: [
          L('Um americano gelado', 'An iced Americano'),
          L('Um chá quente', 'A hot tea'),
          L('Um leite', 'A milk'),
          L('Um suco', 'A juice'),
        ],
        answer: 0,
      },
      {
        question: L('Quanto custou?', 'How much was it?'),
        choices: [
          L('4.500 wons', '4,500 won'),
          L('5.400 wons', '5,400 won'),
          L('4.000 wons', '4,000 won'),
          L('450 wons', '450 won'),
        ],
        answer: 0,
      },
      {
        question: L('Como o cliente pagou?', 'How did the customer pay?'),
        choices: [
          L('Com cartão', 'By card'),
          L('Em dinheiro', 'In cash'),
          L('Não pagou', "Didn't pay"),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'introductions',
    level: 1,
    title: L('Apresentações', 'Introductions'),
    speakers: [L('Minsu', 'Minsu'), L('Ana', 'Ana')],
    lines: [
      line(
        0,
        '안녕하세요. 저는 김민수예요.',
        'Olá. Eu sou Kim Minsu.',
        "Hello. I'm Kim Minsu.",
      ),
      line(
        1,
        '안녕하세요. 저는 아나예요. 만나서 반가워요.',
        'Olá. Eu sou Ana. Prazer em te conhecer.',
        "Hello. I'm Ana. Nice to meet you.",
      ),
      line(
        0,
        '아나 씨는 어느 나라 사람이에요?',
        'De que país você é, Ana?',
        'What country are you from, Ana?',
      ),
      line(
        1,
        '브라질 사람이에요. 민수 씨는 학생이에요?',
        'Sou brasileira. Você é estudante, Minsu?',
        "I'm Brazilian. Are you a student, Minsu?",
      ),
      line(
        0,
        '아니요, 저는 회사원이에요.',
        'Não, eu trabalho numa empresa.',
        'No, I work at a company.',
      ),
    ],
    questions: [
      {
        question: L('De onde a Ana é?', 'Where is Ana from?'),
        choices: [
          L('Do Brasil', 'Brazil'),
          L('Da Coreia', 'Korea'),
          L('Do Japão', 'Japan'),
          L('Dos Estados Unidos', 'The United States'),
        ],
        answer: 0,
      },
      {
        question: L('O que o Minsu faz?', 'What does Minsu do?'),
        choices: [
          L('Trabalha numa empresa', 'He works at a company'),
          L('É estudante', "He's a student"),
          L('É professor', "He's a teacher"),
          L('É médico', "He's a doctor"),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'directions',
    level: 1,
    title: L(
      'Pedindo informação no metrô',
      'Asking for directions on the subway',
    ),
    speakers: [L('Turista', 'Tourist'), L('Pedestre', 'Passer-by')],
    lines: [
      line(
        0,
        '실례합니다. 서울역에 어떻게 가요?',
        'Com licença. Como chego à estação de Seul?',
        'Excuse me. How do I get to Seoul Station?',
      ),
      line(
        1,
        '4호선을 타세요. 두 정거장이에요.',
        'Pegue a linha 4. São duas estações.',
        "Take line 4. It's two stops.",
      ),
      line(0, '여기서 멀어요?', 'É longe daqui?', 'Is it far from here?'),
      line(
        1,
        '아니요, 안 멀어요. 10분쯤 걸려요.',
        'Não, não é longe. Leva uns 10 minutos.',
        "No, it's not far. It takes about 10 minutes.",
      ),
      line(0, '감사합니다!', 'Obrigado(a)!', 'Thank you!'),
    ],
    questions: [
      {
        question: L(
          'Qual linha o turista deve pegar?',
          'Which line should the tourist take?',
        ),
        choices: [
          L('Linha 4', 'Line 4'),
          L('Linha 2', 'Line 2'),
          L('Linha 1', 'Line 1'),
          L('Linha 10', 'Line 10'),
        ],
        answer: 0,
      },
      {
        question: L('Quanto tempo leva?', 'How long does it take?'),
        choices: [
          L('Uns 10 minutos', 'About 10 minutes'),
          L('Uns 2 minutos', 'About 2 minutes'),
          L('Uma hora', 'An hour'),
          L('Uns 4 minutos', 'About 4 minutes'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'shopping',
    level: 1,
    title: L('Comprando roupa', 'Buying clothes'),
    speakers: [L('Cliente', 'Customer'), L('Vendedor(a)', 'Clerk')],
    lines: [
      line(
        0,
        '이 티셔츠 얼마예요?',
        'Quanto custa esta camiseta?',
        'How much is this T-shirt?',
      ),
      line(1, '이만 원이에요.', 'São 20.000 wons.', "It's 20,000 won."),
      line(
        0,
        '좀 비싸요. 다른 색도 있어요?',
        'É um pouco caro. Tem em outras cores?',
        "It's a bit expensive. Do you have other colors?",
      ),
      line(
        1,
        '네, 검은색하고 흰색이 있어요.',
        'Sim, temos preto e branco.',
        'Yes, we have black and white.',
      ),
      line(
        0,
        '흰색으로 주세요.',
        'Quero a branca, por favor.',
        "I'll take the white one, please.",
      ),
    ],
    questions: [
      {
        question: L('Quanto custa a camiseta?', 'How much is the T-shirt?'),
        choices: [
          L('20.000 wons', '20,000 won'),
          L('2.000 wons', '2,000 won'),
          L('12.000 wons', '12,000 won'),
          L('200.000 wons', '200,000 won'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Que cor o cliente escolheu?',
          'Which color did the customer choose?',
        ),
        choices: [
          L('Branca', 'White'),
          L('Preta', 'Black'),
          L('Vermelha', 'Red'),
          L('Azul', 'Blue'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que o cliente achou do preço?',
          'What did the customer think of the price?',
        ),
        choices: [
          L('Um pouco caro', 'A bit expensive'),
          L('Barato', 'Cheap'),
          L('Justo', 'Fair'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'weekend',
    level: 2,
    title: L('Planos para o fim de semana', 'Weekend plans'),
    speakers: [L('Jisu', 'Jisu'), L('Junho', 'Junho')],
    lines: [
      line(
        0,
        '주말에 뭐 할 거예요?',
        'O que você vai fazer no fim de semana?',
        'What are you going to do this weekend?',
      ),
      line(
        1,
        '친구하고 영화를 볼 거예요. 지수 씨는요?',
        'Vou ver um filme com um amigo. E você, Jisu?',
        "I'm going to watch a movie with a friend. How about you, Jisu?",
      ),
      line(
        0,
        '저는 집에서 쉴 거예요. 요즘 너무 피곤해요.',
        'Vou descansar em casa. Ando muito cansada.',
        "I'm going to rest at home. I've been really tired lately.",
      ),
      line(
        1,
        '그래요? 푹 쉬세요.',
        'É mesmo? Descanse bem.',
        'Really? Get plenty of rest.',
      ),
    ],
    questions: [
      {
        question: L('O que o Junho vai fazer?', 'What is Junho going to do?'),
        choices: [
          L('Ver um filme com um amigo', 'Watch a movie with a friend'),
          L('Descansar em casa', 'Rest at home'),
          L('Trabalhar', 'Work'),
          L('Viajar', 'Travel'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Por que a Jisu vai ficar em casa?',
          'Why is Jisu staying home?',
        ),
        choices: [
          L('Porque anda cansada', "Because she's been tired"),
          L('Porque vai chover', "Because it's going to rain"),
          L('Porque não tem dinheiro', 'Because she has no money'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'restaurant',
    level: 2,
    title: L('No restaurante', 'At the restaurant'),
    speakers: [L('Garçom/garçonete', 'Server'), L('Cliente', 'Customer')],
    lines: [
      line(0, '몇 분이세요?', 'Quantas pessoas?', 'How many people?'),
      line(1, '두 명이에요.', 'Duas pessoas.', 'Two people.'),
      line(
        0,
        '이쪽으로 앉으세요. 메뉴 여기 있어요.',
        'Sentem-se aqui, por favor. Aqui está o cardápio.',
        'Please sit over here. Here is the menu.',
      ),
      line(
        1,
        '김치찌개 하나하고 불고기 하나 주세요.',
        'Um kimchi-jjigae e um bulgogi, por favor.',
        'One kimchi stew and one bulgogi, please.',
      ),
      line(0, '음료는요?', 'E para beber?', 'And to drink?'),
      line(1, '물만 주세요.', 'Só água, por favor.', 'Just water, please.'),
    ],
    questions: [
      {
        question: L('Quantas pessoas são?', 'How many people are there?'),
        choices: [
          L('Duas', 'Two'),
          L('Uma', 'One'),
          L('Três', 'Three'),
          L('Quatro', 'Four'),
        ],
        answer: 0,
      },
      {
        question: L('O que pediram para comer?', 'What did they order to eat?'),
        choices: [
          L('Kimchi-jjigae e bulgogi', 'Kimchi stew and bulgogi'),
          L('Dois bulgogis', 'Two bulgogis'),
          L('Lámen e kimchi', 'Ramyeon and kimchi'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que pediram para beber?',
          'What did they order to drink?',
        ),
        choices: [
          L('Só água', 'Just water'),
          L('Cerveja', 'Beer'),
          L('Refrigerante', 'Soda'),
          L('Chá', 'Tea'),
        ],
        answer: 0,
      },
    ],
  },
]

export function getDialogue(id: string): Dialogue | undefined {
  return DIALOGUES.find((d) => d.id === id)
}
