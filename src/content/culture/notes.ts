import type { Localized } from '../../i18n/locales'
import { example, L } from '../grammar/types'

export interface CultureNote {
  id: string
  icon: string
  title: Localized
  paragraphs: Localized[]
  phrases: Array<{ ko: string; translation: Localized }>
  /** Grammar lessons and dialogues where this note is shown. */
  relatedLessons?: string[]
  relatedDialogues?: string[]
}

export const CULTURE_NOTES: CultureNote[] = [
  {
    id: 'formality',
    icon: '🙇',
    title: L('Formal, educado e informal', 'Formal, polite and casual speech'),
    paragraphs: [
      L(
        'O coreano muda a terminação do verbo conforme a relação entre as pessoas. O 해요체 (-아요/어요) é o padrão seguro com quem você não conhece bem. O 합쇼체 (-습니다) é usado em situações formais, como trabalho, notícias e atendimento. O 반말 (informal, sem -요) é para amigos próximos, pessoas mais novas e crianças.',
        "Korean changes verb endings depending on the relationship between speakers. 해요체 (-아요/어요) is the safe default with people you don't know well. 합쇼체 (-습니다) is used in formal settings: work, news, customer service. 반말 (casual, no -요) is for close friends, younger people and children.",
      ),
      L(
        'Usar 반말 com alguém mais velho sem permissão soa rude. É comum perguntar: 말 놓을까요? ("Vamos falar informalmente?").',
        'Using 반말 with an older person without permission sounds rude. People often ask: 말 놓을까요? ("Shall we speak casually?").',
      ),
    ],
    phrases: [
      example(
        '말 놓을까요?',
        'Vamos falar de forma informal?',
        'Shall we speak casually?',
      ),
      example(
        '편하게 말하세요.',
        'Pode falar à vontade (informalmente).',
        'Feel free to speak casually.',
      ),
    ],
    relatedLessons: [
      'present-polite',
      'present-formal',
      'honorific-request-seyo',
    ],
  },
  {
    id: 'age-and-titles',
    icon: '🎂',
    title: L('Idade e formas de tratamento', 'Age and forms of address'),
    paragraphs: [
      L(
        'A idade define como as pessoas se tratam, por isso é comum perguntarem sua idade logo no começo. Em vez de "você", os coreanos usam o nome com 씨 (민수 씨), cargos (선생님, 팀장님) ou termos de família.',
        'Age shapes how people address each other, so Koreans often ask your age early on. Instead of "you", they use the name with 씨 (민수 씨), job titles (선생님, 팀장님) or family terms.',
      ),
      L(
        'Entre amigos, os mais novos chamam os mais velhos de 형/누나 (se quem fala é homem) ou 오빠/언니 (se quem fala é mulher). No trabalho e na escola, quem entrou antes é o 선배.',
        'Among friends, younger people call older ones 형/누나 (if the speaker is male) or 오빠/언니 (if the speaker is female). At work or school, whoever joined earlier is your 선배.',
      ),
    ],
    phrases: [
      example(
        '나이가 어떻게 되세요?',
        'Quantos anos o(a) senhor(a) tem? (educado)',
        'May I ask how old you are? (polite)',
      ),
      example('민수 씨, 안녕하세요.', 'Olá, Minsu.', 'Hello, Minsu.'),
    ],
    relatedDialogues: ['introductions', 'office'],
  },
  {
    id: 'everyday-expressions',
    icon: '💬',
    title: L('Expressões do dia a dia', 'Everyday expressions'),
    paragraphs: [
      L(
        'Algumas expressões não têm tradução direta. 수고하세요 é dito a quem está trabalhando, por exemplo ao sair de uma loja. Antes de comer se diz 잘 먹겠습니다, e depois, 잘 먹었습니다, agradecendo a quem preparou ou pagou a refeição.',
        'Some expressions have no direct translation. 수고하세요 is said to someone who is working, for example when leaving a shop. Before eating you say 잘 먹겠습니다, and afterwards 잘 먹었습니다, thanking whoever cooked or paid.',
      ),
      L(
        '화이팅! (ou 파이팅!) é usado para dar força: antes de uma prova, de um jogo ou de um desafio.',
        '화이팅! (or 파이팅!) is used to cheer someone on: before an exam, a game or any challenge.',
      ),
    ],
    phrases: [
      example(
        '수고하세요.',
        'Bom trabalho! (ao se despedir de quem está trabalhando)',
        'Keep up the good work! (to someone working)',
      ),
      example(
        '잘 먹었습니다.',
        'Obrigado(a) pela refeição. (depois de comer)',
        'Thank you for the meal. (after eating)',
      ),
      example('화이팅!', 'Força! Você consegue!', 'You can do it!'),
    ],
    relatedDialogues: ['cafe', 'restaurant'],
  },
  {
    id: 'slang',
    icon: '😎',
    title: L('Gírias básicas', 'Basic slang'),
    paragraphs: [
      L(
        'Algumas gírias aparecem em todo lugar, de dramas a mensagens. Use-as só com amigos: em situações formais soam infantis.',
        'Some slang words are everywhere, from dramas to text messages. Use them only with friends: in formal situations they sound childish.',
      ),
    ],
    phrases: [
      example('대박!', 'Incrível! / Que demais!', 'Awesome! / No way!'),
      example('헐.', 'Eita! / Nossa! (surpresa)', 'Whoa. / OMG. (surprise)'),
      example('진짜?', 'Sério?', 'Really?'),
      example(
        'ㅋㅋㅋ',
        'Risada escrita (como "kkkk")',
        'Written laughter (like "lol")',
      ),
      example('짱이에요!', 'É o máximo!', "It's the best!"),
    ],
  },
  {
    id: 'table-manners',
    icon: '🥢',
    title: L('Etiqueta à mesa', 'Table manners'),
    paragraphs: [
      L(
        'Espere a pessoa mais velha começar a comer. Ao servir ou receber uma bebida de alguém mais velho, use as duas mãos, e ao beber vire um pouco o rosto para o lado.',
        'Wait for the oldest person to start eating. When pouring for, or receiving a drink from, an older person, use both hands, and turn your head slightly away when drinking.',
      ),
      L(
        'Não espete os hashis em pé no arroz: lembra rituais para os mortos. Em restaurantes, chame o funcionário com 여기요! e não é costume dar gorjeta.',
        "Don't stick your chopsticks upright in rice: it recalls rituals for the dead. In restaurants, call the staff with 여기요!, and tipping isn't customary.",
      ),
    ],
    phrases: [
      example(
        '여기요!',
        'Com licença! (para chamar o garçom)',
        'Excuse me! (to call the server)',
      ),
      example(
        '맛있게 드세요.',
        'Bom apetite. (dito por quem serve)',
        'Enjoy your meal. (said by whoever serves)',
      ),
    ],
    relatedDialogues: ['restaurant'],
  },
  {
    id: 'bowing',
    icon: '🤝',
    title: L('Cumprimentos e as duas mãos', 'Bowing and using both hands'),
    paragraphs: [
      L(
        'Os coreanos se cumprimentam com uma leve inclinação da cabeça e do tronco; quanto mais formal a situação, mais profunda. Um aperto de mão também é comum, muitas vezes acompanhado de uma inclinação.',
        'Koreans greet each other with a slight bow of the head and upper body; the more formal the situation, the deeper the bow. Handshakes are common too, often with a small bow.',
      ),
      L(
        'Para entregar ou receber algo (um cartão de visita, dinheiro, um presente) de alguém mais velho, use as duas mãos ou apoie a mão livre no braço que segura o objeto.',
        'When giving or receiving something (a business card, money, a gift) to or from an older person, use both hands, or support the giving arm with your free hand.',
      ),
    ],
    phrases: [
      example(
        '처음 뵙겠습니다.',
        'Muito prazer. (muito formal)',
        'Pleased to meet you. (very formal)',
      ),
    ],
    relatedDialogues: ['introductions'],
  },
  {
    id: 'shoes-off',
    icon: '🏠',
    title: L('Sapatos fora de casa', 'Shoes off at home'),
    paragraphs: [
      L(
        'Nas casas coreanas, os sapatos ficam na entrada (현관). Isso também vale para alguns restaurantes tradicionais, onde se senta no chão, e para templos.',
        'In Korean homes, shoes stay at the entrance (현관). This also applies to some traditional restaurants, where people sit on the floor, and to temples.',
      ),
      L(
        'Muitas casas têm aquecimento pelo chão (온돌), por isso é comum sentar e até dormir no chão.',
        'Many homes have underfloor heating (온돌), so sitting and even sleeping on the floor is common.',
      ),
    ],
    phrases: [
      example(
        '신발을 벗으세요.',
        'Tire os sapatos, por favor.',
        'Please take off your shoes.',
      ),
    ],
  },
  {
    id: 'holidays',
    icon: '🌕',
    title: L('Seollal e Chuseok', 'Seollal and Chuseok'),
    paragraphs: [
      L(
        'Os dois maiores feriados seguem o calendário lunar. No 설날 (Ano-Novo lunar), as famílias se reúnem, os mais novos fazem uma reverência aos mais velhos (세배) e recebem dinheiro de presente.',
        'The two biggest holidays follow the lunar calendar. On 설날 (Lunar New Year), families gather, younger people bow deeply to their elders (세배) and receive money as a gift.',
      ),
      L(
        'O 추석 é a festa da colheita, no outono: as famílias visitam a cidade natal, homenageiam os antepassados e comem 송편, bolinhos de arroz.',
        '추석 is the autumn harvest festival: families travel to their hometown, honor their ancestors and eat 송편, rice cakes.',
      ),
    ],
    phrases: [
      example(
        '새해 복 많이 받으세요.',
        'Feliz Ano-Novo! (lit. "receba muita sorte no novo ano")',
        'Happy New Year! (lit. "receive many blessings this year")',
      ),
      example(
        '추석 잘 보내세요.',
        'Tenha um bom Chuseok.',
        'Have a happy Chuseok.',
      ),
    ],
  },
]

export function getCultureNote(id: string): CultureNote | undefined {
  return CULTURE_NOTES.find((n) => n.id === id)
}

export function notesForLesson(lessonId: string): CultureNote[] {
  return CULTURE_NOTES.filter((n) => n.relatedLessons?.includes(lessonId))
}

export function notesForDialogue(dialogueId: string): CultureNote[] {
  return CULTURE_NOTES.filter((n) => n.relatedDialogues?.includes(dialogueId))
}
