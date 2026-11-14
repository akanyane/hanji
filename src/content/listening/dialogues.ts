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
  {
    id: 'taxi',
    level: 2,
    title: L('No táxi', 'In a taxi'),
    speakers: [L('Passageiro(a)', 'Passenger'), L('Motorista', 'Driver')],
    lines: [
      line(
        0,
        '기사님, 인천공항으로 가 주세요.',
        'Motorista, para o aeroporto de Incheon, por favor.',
        'To Incheon Airport, please.',
      ),
      line(
        1,
        '네. 몇 터미널이세요?',
        'Certo. Qual terminal?',
        'Sure. Which terminal?',
      ),
      line(
        0,
        '1터미널이요. 얼마나 걸려요?',
        'Terminal 1. Quanto tempo leva?',
        'Terminal 1. How long does it take?',
      ),
      line(1, '한 시간쯤 걸려요.', 'Cerca de uma hora.', 'About an hour.'),
      line(0, '네, 감사합니다.', 'Certo, obrigado(a).', 'Okay, thank you.'),
    ],
    questions: [
      {
        question: L(
          'Para onde vai o passageiro?',
          'Where is the passenger going?',
        ),
        choices: [
          L('Para o aeroporto', 'To the airport'),
          L('Para a estação', 'To the station'),
          L('Para o hotel', 'To the hotel'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Quanto tempo leva a viagem?',
          'How long does the ride take?',
        ),
        choices: [
          L('Cerca de uma hora', 'About an hour'),
          L('Dez minutos', 'Ten minutes'),
          L('Duas horas', 'Two hours'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'pharmacy',
    level: 2,
    title: L('Na farmácia', 'At the pharmacy'),
    speakers: [L('Farmacêutico(a)', 'Pharmacist'), L('Cliente', 'Customer')],
    lines: [
      line(
        0,
        '어디가 아프세요?',
        'O que o(a) senhor(a) está sentindo?',
        'What seems to be the problem?',
      ),
      line(
        1,
        '머리가 아프고 열이 있어요.',
        'Estou com dor de cabeça e febre.',
        'I have a headache and a fever.',
      ),
      line(
        0,
        '감기 같아요. 이 약을 하루에 세 번 드세요.',
        'Parece resfriado. Tome este remédio três vezes ao dia.',
        'It looks like a cold. Take this medicine three times a day.',
      ),
      line(
        1,
        '식사 후에 먹어요?',
        'Tomo depois das refeições?',
        'Do I take it after meals?',
      ),
      line(
        0,
        '네, 식사 후에 드세요.',
        'Sim, tome depois das refeições.',
        'Yes, take it after meals.',
      ),
    ],
    questions: [
      {
        question: L(
          'O que o cliente está sentindo?',
          'What symptoms does the customer have?',
        ),
        choices: [
          L('Dor de cabeça e febre', 'A headache and a fever'),
          L('Dor de barriga', 'A stomachache'),
          L('Dor nas costas', 'Back pain'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Quantas vezes por dia deve tomar o remédio?',
          'How many times a day should they take the medicine?',
        ),
        choices: [
          L('Três vezes', 'Three times'),
          L('Uma vez', 'Once'),
          L('Duas vezes', 'Twice'),
        ],
        answer: 0,
      },
      {
        question: L('Quando deve tomar?', 'When should they take it?'),
        choices: [
          L('Depois das refeições', 'After meals'),
          L('Antes de dormir', 'Before bed'),
          L('Em jejum', 'On an empty stomach'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'hotel',
    level: 2,
    title: L('No hotel', 'At the hotel'),
    speakers: [L('Recepcionista', 'Receptionist'), L('Hóspede', 'Guest')],
    lines: [
      line(
        0,
        '어서 오세요. 예약하셨어요?',
        'Bem-vindo(a). O(a) senhor(a) tem reserva?',
        'Welcome. Do you have a reservation?',
      ),
      line(
        1,
        '네, 김지수로 예약했어요.',
        'Sim, reservei no nome de Kim Jisu.',
        'Yes, I booked under Kim Jisu.',
      ),
      line(
        0,
        '네, 2박 맞으세요?',
        'Certo, são duas noites, correto?',
        'Okay, two nights, is that right?',
      ),
      line(
        1,
        '네, 맞아요. 아침 식사는 몇 시예요?',
        'Isso. A que horas é o café da manhã?',
        "That's right. What time is breakfast?",
      ),
      line(
        0,
        '일곱 시부터 열 시까지예요. 방은 501호입니다.',
        'Das sete às dez. O quarto é o 501.',
        "It's from seven to ten. Your room is 501.",
      ),
    ],
    questions: [
      {
        question: L(
          'Quantas noites o hóspede vai ficar?',
          'How many nights is the guest staying?',
        ),
        choices: [L('Duas', 'Two'), L('Uma', 'One'), L('Cinco', 'Five')],
        answer: 0,
      },
      {
        question: L(
          'A que horas é o café da manhã?',
          'What time is breakfast?',
        ),
        choices: [
          L('Das 7 às 10', 'From 7 to 10'),
          L('Das 6 às 9', 'From 6 to 9'),
          L('Das 8 às 11', 'From 8 to 11'),
        ],
        answer: 0,
      },
      {
        question: L('Qual é o número do quarto?', 'What is the room number?'),
        choices: [L('501', '501'), L('105', '105'), L('510', '510')],
        answer: 0,
      },
    ],
  },
  {
    id: 'office',
    level: 2,
    title: L('No escritório', 'At the office'),
    speakers: [L('Chefe de equipe', 'Team leader'), L('Jimin', 'Jimin')],
    lines: [
      line(
        0,
        '지민 씨, 회의 자료 준비했어요?',
        'Jimin, você preparou o material da reunião?',
        'Jimin, did you prepare the materials for the meeting?',
      ),
      line(
        1,
        '네, 거의 다 했어요. 오후 두 시까지 드릴게요.',
        'Sim, está quase pronto. Entrego até as duas da tarde.',
        "Yes, it's almost done. I'll give it to you by two in the afternoon.",
      ),
      line(
        0,
        '좋아요. 회의는 세 시에 시작해요.',
        'Ótimo. A reunião começa às três.',
        'Great. The meeting starts at three.',
      ),
      line(
        1,
        '알겠습니다. 회의실은 어디예요?',
        'Entendido. Onde é a sala de reunião?',
        'Understood. Where is the meeting room?',
      ),
      line(
        0,
        '5층 회의실이에요.',
        'É a sala de reunião do quinto andar.',
        "It's the meeting room on the fifth floor.",
      ),
    ],
    questions: [
      {
        question: L(
          'Até que horas Jimin vai entregar o material?',
          'By what time will Jimin hand in the materials?',
        ),
        choices: [
          L('Até as duas da tarde', 'By two in the afternoon'),
          L('Até as três', 'By three'),
          L('Amanhã', 'Tomorrow'),
        ],
        answer: 0,
      },
      {
        question: L('Onde é a reunião?', 'Where is the meeting?'),
        choices: [
          L('No quinto andar', 'On the fifth floor'),
          L('No segundo andar', 'On the second floor'),
          L('Fora do escritório', 'Outside the office'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'doctor-appointment',
    level: 2,
    title: L(
      'Marcando consulta por telefone',
      'Booking a doctor’s appointment',
    ),
    speakers: [L('Recepcionista', 'Receptionist'), L('Paciente', 'Patient')],
    lines: [
      line(
        0,
        '네, 서울병원입니다.',
        'Alô, Hospital Seul.',
        'Hello, Seoul Hospital.',
      ),
      line(
        1,
        '진료 예약을 하고 싶은데요.',
        'Eu queria marcar uma consulta.',
        "I'd like to book an appointment.",
      ),
      line(
        0,
        '어디가 불편하세요?',
        'O que o(a) senhor(a) está sentindo?',
        'What seems to be the problem?',
      ),
      line(
        1,
        '일주일 전부터 목이 아프고 기침이 나요.',
        'Estou com dor de garganta e tosse há uma semana.',
        'I have had a sore throat and a cough for a week.',
      ),
      line(
        0,
        '내일 오전 열 시에 오실 수 있으세요?',
        'O(A) senhor(a) pode vir amanhã às dez da manhã?',
        'Can you come tomorrow at ten a.m.?',
      ),
      line(
        1,
        '오전에는 일해야 해서요. 오후는 안 될까요?',
        'De manhã eu tenho que trabalhar. À tarde não daria?',
        'I have to work in the morning. Would the afternoon be possible?',
      ),
      line(
        0,
        '그럼 오후 세 시 반은 괜찮으세요?',
        'Então, três e meia da tarde está bom?',
        'Then would three thirty p.m. work for you?',
      ),
      line(
        1,
        '네, 좋아요. 그때 갈게요.',
        'Sim, ótimo. Vou nesse horário.',
        "Yes, great. I'll come then.",
      ),
    ],
    questions: [
      {
        question: L(
          'Qual é o problema do paciente?',
          "What is the patient's problem?",
        ),
        choices: [
          L('Dor de garganta e tosse', 'A sore throat and a cough'),
          L('Dor de cabeça', 'A headache'),
          L('Dor nas costas', 'Back pain'),
          L('Febre alta', 'A high fever'),
        ],
        answer: 0,
      },
      {
        question: L(
          'Por que ele não pode ir de manhã?',
          "Why can't he come in the morning?",
        ),
        choices: [
          L('Porque tem que trabalhar', 'He has to work'),
          L('Porque vai viajar', "He's traveling"),
          L('Porque o hospital está fechado', 'The hospital is closed'),
        ],
        answer: 0,
      },
      {
        question: L(
          'A que horas é a consulta?',
          'What time is the appointment?',
        ),
        choices: [
          L('15h30', '3:30 p.m.'),
          L('10h', '10 a.m.'),
          L('13h', '1 p.m.'),
          L('16h30', '4:30 p.m.'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'lost-and-found',
    level: 2,
    title: L('Achados e perdidos', 'Lost and found'),
    speakers: [L('Funcionário', 'Staff'), L('Passageira', 'Passenger')],
    lines: [
      line(
        1,
        '저기요, 지하철에서 지갑을 잃어버렸는데요.',
        'Com licença, perdi minha carteira no metrô.',
        'Excuse me, I lost my wallet on the subway.',
      ),
      line(
        0,
        '언제, 어디에서 잃어버리셨어요?',
        'Quando e onde a senhora perdeu?',
        'When and where did you lose it?',
      ),
      line(
        1,
        '한 시간 전쯤 2호선에서요. 강남역에서 내렸어요.',
        'Há mais ou menos uma hora, na linha 2. Desci na estação Gangnam.',
        'About an hour ago, on line 2. I got off at Gangnam Station.',
      ),
      line(
        0,
        '지갑이 어떻게 생겼어요?',
        'Como é a carteira?',
        'What does the wallet look like?',
      ),
      line(
        1,
        '작고 빨간 지갑이에요. 안에 카드하고 학생증이 있어요.',
        'É uma carteira pequena e vermelha. Dentro tem cartões e a carteirinha de estudante.',
        "It's a small red wallet. There are cards and a student ID inside.",
      ),
      line(
        0,
        '잠깐만 기다리세요… 이 지갑 맞아요?',
        'Espere um momento… É esta carteira?',
        'Wait a moment… Is this the wallet?',
      ),
      line(
        1,
        '네, 맞아요! 정말 감사합니다.',
        'Sim, é essa! Muito obrigada.',
        'Yes, that’s it! Thank you so much.',
      ),
      line(
        0,
        '신분증을 보여 주시겠어요?',
        'Pode me mostrar um documento de identidade?',
        'Could you show me your ID?',
      ),
    ],
    questions: [
      {
        question: L('O que ela perdeu?', 'What did she lose?'),
        choices: [
          L('A carteira', 'Her wallet'),
          L('O celular', 'Her phone'),
          L('A bolsa', 'Her bag'),
          L('O guarda-chuva', 'Her umbrella'),
        ],
        answer: 0,
      },
      {
        question: L('Como é a carteira?', 'What does the wallet look like?'),
        choices: [
          L('Pequena e vermelha', 'Small and red'),
          L('Grande e preta', 'Big and black'),
          L('Pequena e azul', 'Small and blue'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que o funcionário pede no final?',
          'What does the staff member ask for at the end?',
        ),
        choices: [
          L('Um documento de identidade', 'An ID'),
          L('Dinheiro', 'Money'),
          L('O número de telefone', 'A phone number'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'bank',
    level: 2,
    title: L('No banco', 'At the bank'),
    speakers: [L('Bancária', 'Bank teller'), L('Cliente', 'Customer')],
    lines: [
      line(
        0,
        '어서 오세요. 무엇을 도와드릴까요?',
        'Bem-vindo. Em que posso ajudar?',
        'Welcome. How can I help you?',
      ),
      line(
        1,
        '통장을 만들고 싶어요. 외국인도 만들 수 있어요?',
        'Quero abrir uma conta. Estrangeiro também pode abrir?',
        "I'd like to open an account. Can foreigners open one too?",
      ),
      line(
        0,
        '네, 외국인등록증이 있으면 만들 수 있어요.',
        'Sim, se tiver o cartão de registro de estrangeiro, pode.',
        'Yes, if you have an alien registration card, you can.',
      ),
      line(
        1,
        '여기 있어요. 체크카드도 같이 만들 수 있어요?',
        'Aqui está. Dá para fazer um cartão de débito junto?',
        'Here it is. Can I get a debit card at the same time?',
      ),
      line(
        0,
        '물론이죠. 이 서류에 이름하고 주소를 써 주세요.',
        'Claro. Escreva seu nome e endereço neste formulário, por favor.',
        'Of course. Please write your name and address on this form.',
      ),
      line(
        1,
        '주소를 한국어로 써야 해요?',
        'Tenho que escrever o endereço em coreano?',
        'Do I have to write the address in Korean?',
      ),
      line(
        0,
        '영어로 써도 돼요. 그리고 여기에 사인해 주세요.',
        'Pode escrever em inglês. E assine aqui, por favor.',
        'You can write it in English. And please sign here.',
      ),
    ],
    questions: [
      {
        question: L(
          'O que o cliente quer fazer?',
          'What does the customer want to do?',
        ),
        choices: [
          L('Abrir uma conta', 'Open an account'),
          L('Trocar dinheiro', 'Exchange money'),
          L('Pagar uma conta', 'Pay a bill'),
          L('Pedir um empréstimo', 'Ask for a loan'),
        ],
        answer: 0,
      },
      {
        question: L('Que documento é necessário?', 'Which document is needed?'),
        choices: [
          L(
            'O cartão de registro de estrangeiro',
            'The alien registration card',
          ),
          L('O passaporte', 'The passport'),
          L('A carteira de motorista', "The driver's license"),
        ],
        answer: 0,
      },
      {
        question: L(
          'Em que língua ele pode escrever o endereço?',
          'In which language can he write the address?',
        ),
        choices: [
          L('Em inglês', 'In English'),
          L('Só em coreano', 'Only in Korean'),
          L('Em japonês', 'In Japanese'),
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'apartment',
    level: 3,
    title: L('Procurando um apartamento', 'Looking for an apartment'),
    speakers: [L('Corretor', 'Real estate agent'), L('Cliente', 'Client')],
    lines: [
      line(
        1,
        '학교 근처에 원룸을 구하고 있는데요.',
        'Estou procurando uma quitinete perto da faculdade.',
        "I'm looking for a studio near the university.",
      ),
      line(
        0,
        '월세는 어느 정도 생각하세요?',
        'Quanto o senhor pensa em pagar de aluguel?',
        'How much are you thinking of paying in monthly rent?',
      ),
      line(
        1,
        '오십만 원 정도요. 너무 비싸면 안 돼요.',
        'Uns 500 mil wons. Não pode ser caro demais.',
        "Around 500,000 won. It can't be too expensive.",
      ),
      line(
        0,
        '이 방은 어떠세요? 지하철역에서 걸어서 오 분이에요.',
        'Que tal este? Fica a cinco minutos a pé da estação de metrô.',
        "How about this one? It's a five-minute walk from the subway station.",
      ),
      line(
        1,
        '밝고 깨끗한데 좀 좁네요. 보증금은 얼마예요?',
        'É claro e limpo, mas é meio pequeno. Quanto é o depósito?',
        "It's bright and clean, but a bit small. How much is the deposit?",
      ),
      line(
        0,
        '천만 원이에요. 대신 관리비가 포함돼 있어요.',
        'Dez milhões de wons. Em compensação, o condomínio está incluído.',
        'Ten million won. But the maintenance fee is included.',
      ),
      line(
        1,
        '그럼 다른 방도 한번 보고 결정할게요.',
        'Então vou ver outros também antes de decidir.',
        "Then I'll take a look at other places before deciding.",
      ),
    ],
    questions: [
      {
        question: L('Onde ele quer morar?', 'Where does he want to live?'),
        choices: [
          L('Perto da faculdade', 'Near the university'),
          L('Perto do trabalho', 'Near work'),
          L('No centro', 'Downtown'),
          L('Perto do aeroporto', 'Near the airport'),
        ],
        answer: 0,
      },
      {
        question: L(
          'O que ele achou do apartamento?',
          'What did he think of the apartment?',
        ),
        choices: [
          L('Claro e limpo, mas pequeno', 'Bright and clean, but small'),
          L('Grande, mas escuro', 'Big, but dark'),
          L('Barato e espaçoso', 'Cheap and spacious'),
        ],
        answer: 0,
      },
      {
        question: L('O que ele decide fazer?', 'What does he decide to do?'),
        choices: [
          L('Ver outros apartamentos', 'Look at other places'),
          L('Alugar na hora', 'Rent it right away'),
          L('Desistir de se mudar', 'Give up on moving'),
        ],
        answer: 0,
      },
    ],
  },
]

export function getDialogue(id: string): Dialogue | undefined {
  return DIALOGUES.find((d) => d.id === id)
}
