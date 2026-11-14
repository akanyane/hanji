import { example, type GrammarLesson, L } from '../types'

export const verbs: GrammarLesson[] = [
  {
    id: 'present-polite',
    level: 1,
    pattern: '-아요/어요',
    title: L('Presente educado (해요체)', 'Polite present (해요체)'),
    summary: L(
      'A forma mais usada no dia a dia, educada sem ser formal.',
      'The most common everyday form: polite but not stiff.',
    ),
    explanation: [
      L(
        'Tire o 다 do verbo para obter o radical. Se a última vogal do radical for ㅏ ou ㅗ, acrescente 아요; senão, 어요. Verbos com 하다 viram 해요.',
        "Drop 다 to get the stem. If the stem's last vowel is ㅏ or ㅗ, add 아요; otherwise add 어요. 하다 verbs become 해요.",
      ),
      L(
        'Quando o radical termina em vogal, as vogais se fundem: 가+아요 → 가요, 보+아요 → 봐요, 마시+어요 → 마셔요. Os verbos irregulares mudam o radical: use o Conjugador para ver qualquer verbo.',
        'When the stem ends in a vowel, the vowels merge: 가+아요 → 가요, 보+아요 → 봐요, 마시+어요 → 마셔요. Irregular verbs change the stem: use the Conjugator to see any verb.',
      ),
    ],
    formation: [
      {
        when: L('Última vogal ㅏ ou ㅗ', 'Last vowel ㅏ or ㅗ'),
        form: '아요',
        example: '앉아요 · 좋아요',
      },
      {
        when: L('Outras vogais', 'Other vowels'),
        form: '어요',
        example: '먹어요 · 읽어요',
      },
      {
        when: L('Verbos com 하다', '하다 verbs'),
        form: '해요',
        example: '공부해요',
      },
    ],
    conjugationTable: {
      forms: ['present.polite'],
      verbs: [
        '가다',
        '먹다',
        '보다',
        '마시다',
        '하다',
        '듣다',
        '덥다',
        '모르다',
        '바쁘다',
        '살다',
      ],
    },
    examples: [
      example(
        '저는 매일 커피를 마셔요.',
        'Eu bebo café todo dia.',
        'I drink coffee every day.',
      ),
      example('친구를 만나요.', 'Encontro meu amigo.', 'I meet my friend.'),
      example('한국어를 공부해요.', 'Estudo coreano.', 'I study Korean.'),
      example('날씨가 좋아요.', 'O tempo está bom.', 'The weather is nice.'),
    ],
    mistakes: [
      L(
        'Não esqueça as contrações: 보아요 → 봐요, 마시어요 → 마셔요. A forma sem contração soa artificial.',
        'Remember the contractions: 보아요 → 봐요, 마시어요 → 마셔요. Uncontracted forms sound unnatural.',
      ),
      L(
        'O 해요체 serve para eu, você, ele e nós: o verbo não muda com a pessoa, como em português ("eu como, você come").',
        'The verb never changes for the person: 먹어요 is "I eat", "you eat", "she eats". There is no "-s" for he/she.',
      ),
    ],
    exercises: [
      {
        prompt: '매일 아침 커피를 ___. (마시다)',
        choices: ['마셔요', '마시어요', '마셔어요'],
        answer: 0,
        translation: L(
          'Bebo café toda manhã.',
          'I drink coffee every morning.',
        ),
        check: { kind: 'form', verb: '마시다', form: 'present.polite' },
      },
      {
        prompt: '친구를 ___. (만나다)',
        choices: ['만나요', '만나아요'],
        answer: 0,
        translation: L('Encontro meu amigo.', 'I meet my friend.'),
        check: { kind: 'form', verb: '만나다', form: 'present.polite' },
      },
      {
        prompt: '음악을 ___. (듣다)',
        choices: ['들어요', '듣어요'],
        answer: 0,
        translation: L('Ouço música.', 'I listen to music.'),
        check: { kind: 'form', verb: '듣다', form: 'present.polite' },
      },
    ],
  },
  {
    id: 'present-formal',
    level: 1,
    pattern: '-습니다/ㅂ니다',
    title: L('Formal (합쇼체)', 'Formal (합쇼체)'),
    summary: L(
      'Para apresentações, trabalho, notícias e situações formais.',
      'For presentations, work, the news and formal situations.',
    ),
    explanation: [
      L(
        'Depois de consoante, use 습니다; depois de vogal, ㅂ니다 (o ㅂ vira batchim). Para perguntas: 습니까/ㅂ니까.',
        'After a consonant, use 습니다; after a vowel, ㅂ니다 (ㅂ becomes the final consonant). Questions: 습니까/ㅂ니까.',
      ),
      L(
        'Radicais em ㄹ perdem o ㄹ: 살다 → 삽니다.',
        'Stems ending in ㄹ drop it: 살다 → 삽니다.',
      ),
    ],
    formation: [
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '습니다',
        example: '먹습니다',
      },
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: 'ㅂ니다',
        example: '갑니다',
      },
      {
        when: L('Pergunta', 'Question'),
        form: '습니까/ㅂ니까',
        example: '갑니까?',
      },
    ],
    conjugationTable: {
      forms: ['present.formal', 'past.formal'],
      verbs: ['가다', '먹다', '하다', '살다', '덥다'],
    },
    examples: [
      example('감사합니다.', 'Obrigado(a).', 'Thank you.'),
      example('저는 김민수입니다.', 'Eu sou Kim Minsu.', 'I am Kim Minsu.'),
      example(
        '회의가 세 시에 시작합니다.',
        'A reunião começa às três.',
        'The meeting starts at three.',
      ),
      example(
        '어디에 갑니까?',
        'Aonde o(a) senhor(a) vai?',
        'Where are you going?',
      ),
    ],
    mistakes: [
      L(
        'O formal não é "mais correto": no dia a dia ele soa distante. Use-o em apresentações, no trabalho e com desconhecidos em contextos oficiais.',
        'Formal is not "more correct": in daily life it sounds distant. Use it for presentations, work and official contexts.',
      ),
    ],
    exercises: [
      {
        prompt: '저는 학생___.',
        choices: ['입니다', '습니다'],
        answer: 0,
        translation: L('Eu sou estudante.', 'I am a student.'),
      },
      {
        prompt: '회의를 ___. (시작하다)',
        choices: ['시작합니다', '시작습니다'],
        answer: 0,
        translation: L('Começamos a reunião.', "We'll start the meeting."),
        check: { kind: 'form', verb: '시작하다', form: 'present.formal' },
      },
      {
        prompt: '서울에 ___. (살다)',
        choices: ['삽니다', '살습니다'],
        answer: 0,
        translation: L('Moro em Seul.', 'I live in Seoul.'),
        check: { kind: 'form', verb: '살다', form: 'present.formal' },
      },
    ],
  },
  {
    id: 'past-tense',
    level: 1,
    pattern: '-았/었-',
    title: L('Passado -았/었-', 'Past tense -았/었-'),
    summary: L(
      'Fale do que já aconteceu.',
      'Talk about what already happened.',
    ),
    explanation: [
      L(
        'Pegue a forma -아요/어요, troque 요 por ㅆ어요: 가요 → 갔어요, 먹어요 → 먹었어요, 해요 → 했어요.',
        'Take the -아요/어요 form and replace 요 with ㅆ어요: 가요 → 갔어요, 먹어요 → 먹었어요, 해요 → 했어요.',
      ),
    ],
    formation: [
      {
        when: L('Última vogal ㅏ ou ㅗ', 'Last vowel ㅏ or ㅗ'),
        form: '았어요',
        example: '앉았어요',
      },
      {
        when: L('Outras vogais', 'Other vowels'),
        form: '었어요',
        example: '먹었어요',
      },
      {
        when: L('Verbos com 하다', '하다 verbs'),
        form: '했어요',
        example: '공부했어요',
      },
    ],
    conjugationTable: {
      forms: ['past.polite'],
      verbs: [
        '가다',
        '먹다',
        '하다',
        '보다',
        '마시다',
        '듣다',
        '덥다',
        '바쁘다',
      ],
    },
    examples: [
      example(
        '어제 영화를 봤어요.',
        'Ontem vi um filme.',
        'I watched a movie yesterday.',
      ),
      example('점심을 먹었어요.', 'Almocei.', 'I had lunch.'),
      example(
        '주말에 공부했어요.',
        'Estudei no fim de semana.',
        'I studied on the weekend.',
      ),
      example(
        '어제는 정말 더웠어요.',
        'Ontem estava muito quente.',
        'It was really hot yesterday.',
      ),
    ],
    mistakes: [
      L(
        'O passado não muda com a pessoa: 갔어요 serve para eu, você e ele.',
        'There is no "did" and no change by person: 갔어요 is "I/you/she went".',
      ),
    ],
    exercises: [
      {
        prompt: '어제 친구를 ___. (만나다)',
        choices: ['만났어요', '만나었어요'],
        answer: 0,
        translation: L(
          'Ontem encontrei um amigo.',
          'I met a friend yesterday.',
        ),
        check: { kind: 'form', verb: '만나다', form: 'past.polite' },
      },
      {
        prompt: '점심을 ___. (먹다)',
        choices: ['먹었어요', '먹았어요'],
        answer: 0,
        translation: L('Almocei.', 'I had lunch.'),
        check: { kind: 'form', verb: '먹다', form: 'past.polite' },
      },
      {
        prompt: '주말에 ___. (공부하다)',
        choices: ['공부했어요', '공부하었어요'],
        answer: 0,
        translation: L(
          'Estudei no fim de semana.',
          'I studied on the weekend.',
        ),
        check: { kind: 'form', verb: '공부하다', form: 'past.polite' },
      },
    ],
  },
  {
    id: 'future-geoyeyo',
    level: 1,
    pattern: '-(으)ㄹ 거예요',
    title: L('Futuro -(으)ㄹ 거예요', 'Future -(으)ㄹ 거예요'),
    summary: L(
      'Fale de planos e previsões.',
      'Talk about plans and predictions.',
    ),
    explanation: [
      L(
        'Depois de vogal (ou ㄹ), use ㄹ 거예요; depois de consoante, 을 거예요. Também expressa suposição: 비가 올 거예요 (deve chover).',
        'After a vowel (or ㄹ), use ㄹ 거예요; after a consonant, 을 거예요. It also expresses a guess: 비가 올 거예요 (it will probably rain).',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal ou ㄹ', 'After a vowel or ㄹ'),
        form: 'ㄹ 거예요',
        example: '갈 거예요 · 살 거예요',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '을 거예요',
        example: '먹을 거예요',
      },
    ],
    conjugationTable: {
      forms: ['future.polite'],
      verbs: ['가다', '먹다', '하다', '듣다', '살다', '만들다'],
    },
    examples: [
      example(
        '내일 친구를 만날 거예요.',
        'Amanhã vou encontrar um amigo.',
        "I'm going to meet a friend tomorrow.",
      ),
      example(
        '주말에 집에서 쉴 거예요.',
        'No fim de semana vou descansar em casa.',
        "I'll rest at home this weekend.",
      ),
      example(
        '내년에 한국에 갈 거예요.',
        'Ano que vem vou à Coreia.',
        "I'm going to Korea next year.",
      ),
      example(
        '저녁은 뭐 먹을 거예요?',
        'O que você vai jantar?',
        'What are you going to have for dinner?',
      ),
    ],
    mistakes: [
      L(
        'Com radical em ㄹ, não acrescente 을: 만들 거예요, não 만들을 거예요.',
        'With ㄹ stems, do not add 을: 만들 거예요, not 만들을 거예요.',
      ),
    ],
    exercises: [
      {
        prompt: '내일 영화를 ___. (보다)',
        choices: ['볼 거예요', '보을 거예요'],
        answer: 0,
        translation: L(
          'Amanhã vou ver um filme.',
          "I'm going to watch a movie tomorrow.",
        ),
        check: { kind: 'form', verb: '보다', form: 'future.polite' },
      },
      {
        prompt: '저녁을 ___. (먹다)',
        choices: ['먹을 거예요', '먹울 거예요'],
        answer: 0,
        translation: L('Vou jantar.', "I'm going to have dinner."),
        check: { kind: 'form', verb: '먹다', form: 'future.polite' },
      },
      {
        prompt: '케이크를 ___. (만들다)',
        choices: ['만들 거예요', '만들을 거예요'],
        answer: 0,
        translation: L('Vou fazer um bolo.', "I'm going to make a cake."),
        check: { kind: 'form', verb: '만들다', form: 'future.polite' },
      },
    ],
  },
  {
    id: 'negation',
    level: 1,
    pattern: '안 · -지 않다',
    title: L('Negação: 안 e -지 않다', 'Negation: 안 and -지 않다'),
    summary: L(
      'Duas formas de dizer "não": curta e longa.',
      'Two ways to say "not": short and long.',
    ),
    explanation: [
      L(
        'Forma curta: 안 antes do verbo (안 가요). Forma longa: radical + 지 않아요 (가지 않아요). As duas significam o mesmo; a longa soa um pouco mais formal.',
        'Short form: 안 before the verb (안 가요). Long form: stem + 지 않아요 (가지 않아요). Both mean the same; the long one sounds a bit more formal.',
      ),
      L(
        'Em verbos "substantivo + 하다", o 안 vai antes de 하다: 공부 안 해요.',
        'With "noun + 하다" verbs, 안 goes right before 하다: 공부 안 해요.',
      ),
    ],
    formation: [
      { when: L('Curta', 'Short'), form: '안 + verbo', example: '안 가요' },
      { when: L('Longa', 'Long'), form: '-지 않아요', example: '가지 않아요' },
      {
        when: L('Substantivo + 하다', 'Noun + 하다'),
        form: '… 안 해요',
        example: '공부 안 해요',
      },
    ],
    conjugationTable: {
      forms: ['negShort.present', 'negLong.present'],
      verbs: ['가다', '먹다', '공부하다', '좋다'],
    },
    examples: [
      example(
        '오늘은 학교에 안 가요.',
        'Hoje não vou à escola.',
        "I'm not going to school today.",
      ),
      example('고기를 먹지 않아요.', 'Não como carne.', "I don't eat meat."),
      example(
        '요즘 운동 안 해요.',
        'Ultimamente não faço exercício.',
        "I don't work out these days.",
      ),
    ],
    mistakes: [
      L(
        'Não diga 안 공부해요: o certo é 공부 안 해요.',
        'Do not say 안 공부해요: the correct form is 공부 안 해요.',
      ),
      L(
        'Para "não ter" use 없다, não 안 있다; para "não saber", 모르다.',
        'For "not to have" use 없다, not 안 있다; for "not to know", 모르다.',
      ),
    ],
    exercises: [
      {
        prompt: '오늘은 ___. (공부하다)',
        choices: ['공부 안 해요', '안 공부해요'],
        answer: 0,
        translation: L('Hoje não estudo.', "I'm not studying today."),
        check: { kind: 'form', verb: '공부하다', form: 'negShort.present' },
      },
      {
        prompt: '커피를 ___. (마시다, forma longa)',
        choices: ['마시지 않아요', '마시 않아요'],
        answer: 0,
        translation: L('Não bebo café.', "I don't drink coffee."),
        check: { kind: 'form', verb: '마시다', form: 'negLong.present' },
      },
      {
        prompt: '학교에 ___. (가다, forma curta)',
        choices: ['안 가요', '가 안요'],
        answer: 0,
        translation: L('Não vou à escola.', "I don't go to school."),
        check: { kind: 'form', verb: '가다', form: 'negShort.present' },
      },
    ],
  },
  {
    id: 'want-go-sipda',
    level: 1,
    pattern: '-고 싶다',
    title: L('Querer: -고 싶다', 'Want to: -고 싶다'),
    summary: L('Diga o que você quer fazer.', 'Say what you want to do.'),
    explanation: [
      L(
        'Radical + 고 싶어요 = "quero (fazer)". Sem mudanças no radical: 가고 싶어요, 먹고 싶어요.',
        'Stem + 고 싶어요 = "I want to (do)". The stem never changes: 가고 싶어요, 먹고 싶어요.',
      ),
      L(
        'Para dizer o que outra pessoa quer, use -고 싶어하다: 동생이 가고 싶어해요.',
        'To say what someone else wants, use -고 싶어하다: 동생이 가고 싶어해요.',
      ),
    ],
    formation: [
      {
        when: L('Qualquer verbo', 'Any verb'),
        form: '-고 싶어요',
        example: '가고 싶어요',
      },
    ],
    examples: [
      example(
        '한국에 가고 싶어요.',
        'Quero ir à Coreia.',
        'I want to go to Korea.',
      ),
      example(
        '뭐 먹고 싶어요?',
        'O que você quer comer?',
        'What do you want to eat?',
      ),
      example(
        '친구가 보고 싶어요.',
        'Estou com saudade do meu amigo.',
        'I miss my friend.',
      ),
    ],
    mistakes: [
      L(
        '보고 싶어요 também quer dizer "estou com saudade": 엄마가 보고 싶어요.',
        '보고 싶어요 also means "I miss (someone)": 엄마가 보고 싶어요.',
      ),
    ],
    exercises: [
      {
        prompt: '김치를 ___. (먹다)',
        choices: ['먹고 싶어요', '먹어 싶어요'],
        answer: 0,
        translation: L('Quero comer kimchi.', 'I want to eat kimchi.'),
        check: { kind: 'form', verb: '먹다', form: 'want' },
      },
      {
        prompt: '한국에 ___. (가다)',
        choices: ['가고 싶어요', '가 싶어요'],
        answer: 0,
        translation: L('Quero ir à Coreia.', 'I want to go to Korea.'),
        check: { kind: 'form', verb: '가다', form: 'want' },
      },
      {
        prompt: '좀 ___. (쉬다)',
        choices: ['쉬고 싶어요', '쉬어 싶어요'],
        answer: 0,
        translation: L('Quero descansar um pouco.', 'I want to rest a bit.'),
        check: { kind: 'form', verb: '쉬다', form: 'want' },
      },
    ],
  },
  {
    id: 'progressive-go-itda',
    level: 1,
    pattern: '-고 있다',
    title: L('Ação em andamento: -고 있다', 'Ongoing action: -고 있다'),
    summary: L(
      'Diga o que está acontecendo agora: "estou comendo".',
      'Say what is happening right now: "I am eating".',
    ),
    explanation: [
      L(
        'Radical + 고 있어요 = "estou (fazendo)". Só funciona com verbos de ação, não com adjetivos.',
        'Stem + 고 있어요 = "I am (doing)". It only works with action verbs, not adjectives.',
      ),
    ],
    formation: [
      {
        when: L('Verbos de ação', 'Action verbs'),
        form: '-고 있어요',
        example: '먹고 있어요',
      },
    ],
    conjugationTable: {
      forms: ['progressive.polite', 'progressive.formal'],
      verbs: ['가다', '먹다', '하다', '듣다'],
    },
    examples: [
      example(
        '지금 밥을 먹고 있어요.',
        'Estou comendo agora.',
        "I'm eating right now.",
      ),
      example('비가 오고 있어요.', 'Está chovendo.', "It's raining."),
      example(
        '뭐 하고 있어요?',
        'O que você está fazendo?',
        'What are you doing?',
      ),
    ],
    mistakes: [
      L(
        'Em português usamos o gerúndio para quase tudo; em coreano o presente simples já cobre muitos casos: 학교에 가요 pode ser "vou" ou "estou indo".',
        'English uses "-ing" much more: Korean simple present often covers it (학교에 가요 = "I go" or "I\'m going").',
      ),
    ],
    exercises: [
      {
        prompt: '도서관에서 ___. (공부하다)',
        choices: ['공부하고 있어요', '공부해 있어요'],
        answer: 0,
        translation: L(
          'Estou estudando na biblioteca.',
          "I'm studying at the library.",
        ),
        check: { kind: 'form', verb: '공부하다', form: 'progressive.polite' },
      },
      {
        prompt: '친구를 ___. (기다리다)',
        choices: ['기다리고 있어요', '기다려고 있어요'],
        answer: 0,
        translation: L(
          'Estou esperando um amigo.',
          "I'm waiting for a friend.",
        ),
        check: { kind: 'form', verb: '기다리다', form: 'progressive.polite' },
      },
      {
        prompt: '동생은 지금 ___. (자다)',
        choices: ['자고 있어요', '자 있어요'],
        answer: 0,
        translation: L(
          'Meu irmão está dormindo agora.',
          'My little brother is sleeping now.',
        ),
        check: { kind: 'form', verb: '자다', form: 'progressive.polite' },
      },
    ],
  },
  {
    id: 'honorific-request-seyo',
    level: 1,
    pattern: '-(으)세요',
    title: L(
      'Pedido educado e honorífico: -(으)세요',
      'Polite request and honorific: -(으)세요',
    ),
    summary: L(
      'Peça algo com educação ou fale com respeito de alguém.',
      'Ask politely or speak respectfully about someone.',
    ),
    explanation: [
      L(
        '-(으)세요 é um pedido educado ("por favor, faça") e também o presente honorífico, usado para falar de pessoas mais velhas ou superiores.',
        '-(으)세요 is a polite request ("please do") and also the honorific present, used for older people or superiors.',
      ),
      L(
        'Depois de vogal: 세요 (가세요). Depois de consoante: 으세요 (앉으세요). Radicais em ㄹ perdem o ㄹ (사세요). Alguns verbos têm forma própria: 먹다 → 드세요, 자다 → 주무세요, 있다 → 계세요.',
        'After a vowel: 세요 (가세요). After a consonant: 으세요 (앉으세요). ㄹ stems drop ㄹ (사세요). Some verbs have their own form: 먹다 → 드세요, 자다 → 주무세요, 있다 → 계세요.',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: '세요',
        example: '가세요',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '으세요',
        example: '앉으세요',
      },
      {
        when: L('Radical em ㄹ', 'ㄹ stem'),
        form: '세요 (sem ㄹ)',
        example: '사세요',
      },
    ],
    conjugationTable: {
      forms: ['honorific.present', 'honorific.past'],
      verbs: ['가다', '앉다', '읽다', '살다', '듣다', '먹다'],
    },
    examples: [
      example(
        '여기 앉으세요.',
        'Sente-se aqui, por favor.',
        'Please sit here.',
      ),
      example('이거 드세요.', 'Coma isto, por favor.', 'Please have this.'),
      example(
        '잠깐만 기다리세요.',
        'Espere um momento.',
        'Please wait a moment.',
      ),
      example(
        '어디에 사세요?',
        'Onde o(a) senhor(a) mora?',
        'Where do you live?',
      ),
    ],
    mistakes: [
      L(
        'Não use -(으)세요 para falar de si mesmo: nunca 제가 가세요.',
        'Never use honorifics for yourself: not 제가 가세요.',
      ),
      L(
        'Com radical em ㄹ, não diga 살으세요: o certo é 사세요.',
        'With ㄹ stems, not 살으세요: the correct form is 사세요.',
      ),
    ],
    exercises: [
      {
        prompt: '여기 ___. (앉다)',
        choices: ['앉으세요', '앉세요'],
        answer: 0,
        translation: L('Sente-se aqui.', 'Please sit here.'),
        check: { kind: 'form', verb: '앉다', form: 'honorific.present' },
      },
      {
        prompt: '어디에 ___? (살다)',
        choices: ['사세요', '살으세요'],
        answer: 0,
        translation: L('Onde o(a) senhor(a) mora?', 'Where do you live?'),
        check: { kind: 'form', verb: '살다', form: 'honorific.present' },
      },
      {
        prompt: '잠깐만 ___. (기다리다)',
        choices: ['기다리세요', '기다리으세요'],
        answer: 0,
        translation: L('Espere um momento.', 'Please wait a moment.'),
        check: { kind: 'form', verb: '기다리다', form: 'honorific.present' },
      },
    ],
  },
]
