import { example, type GrammarLesson, L } from '../types'

export const basics: GrammarLesson[] = [
  {
    id: 'copula-ida',
    level: 1,
    pattern: '이에요/예요 · 입니다',
    title: L('Ser: 이다', 'To be: 이다'),
    summary: L(
      'Diga o que algo ou alguém é: "Eu sou estudante".',
      'Say what something or someone is: "I am a student".',
    ),
    explanation: [
      L(
        '이다 significa "ser" quando ligamos dois substantivos (A é B). Ele não é uma palavra separada: gruda no fim do substantivo.',
        '이다 means "to be" when linking two nouns (A is B). It is not a separate word: it attaches to the end of the noun.',
      ),
      L(
        'No nível educado do dia a dia, use 이에요 depois de consoante e 예요 depois de vogal. No nível formal, use 입니다 sempre.',
        'In everyday polite speech, use 이에요 after a consonant and 예요 after a vowel. In formal speech, always use 입니다.',
      ),
    ],
    formation: [
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '이에요',
        example: '학생이에요',
      },
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: '예요',
        example: '의사예요',
      },
      {
        when: L('Formal (qualquer final)', 'Formal (any ending)'),
        form: '입니다',
        example: '학생입니다',
      },
    ],
    examples: [
      example('저는 학생이에요.', 'Eu sou estudante.', 'I am a student.'),
      example('이건 사과예요.', 'Isto é uma maçã.', 'This is an apple.'),
      example('제 이름은 민수예요.', 'Meu nome é Minsu.', 'My name is Minsu.'),
      example(
        '저는 브라질 사람입니다.',
        'Eu sou brasileiro(a).',
        'I am Brazilian.',
      ),
    ],
    mistakes: [
      L(
        'Não use 이다 para dizer onde algo está: "Estou em casa" é 집에 있어요 (com 있다), não 집이에요.',
        'An English-speaker trap: 이다 is not used for location. "I am at home" is 집에 있어요 (with 있다), not 집이에요.',
      ),
      L(
        'Em português "ser" vem antes; em coreano 이다 gruda no final do substantivo: 학생이에요, nunca 이에요 학생.',
        'Unlike "am/is/are", 이다 never stands alone or comes first: it always attaches to the noun (학생이에요).',
      ),
    ],
    exercises: [
      {
        prompt: '저는 학생___.',
        choices: ['이에요', '예요'],
        answer: 0,
        translation: L('Eu sou estudante.', 'I am a student.'),
        check: { kind: 'copula', noun: '학생' },
      },
      {
        prompt: '이건 커피___.',
        choices: ['이에요', '예요'],
        answer: 1,
        translation: L('Isto é café.', 'This is coffee.'),
        check: { kind: 'copula', noun: '커피' },
      },
      {
        prompt: '저는 의사___. (formal)',
        choices: ['입니다', '습니다'],
        answer: 0,
        translation: L('Eu sou médico(a).', 'I am a doctor.'),
      },
    ],
  },
  {
    id: 'topic-eun-neun',
    level: 1,
    pattern: '은/는',
    title: L('Partícula de tópico 은/는', 'Topic particle 은/는'),
    summary: L(
      'Marque do que a frase fala ("quanto a…") ou faça um contraste.',
      'Mark what the sentence is about ("as for…") or make a contrast.',
    ),
    explanation: [
      L(
        '은/는 marca o tópico: aquilo sobre o qual você vai falar. Pense em "quanto a…": 저는 학생이에요 = "quanto a mim, sou estudante".',
        '은/는 marks the topic: what you are going to talk about. Think "as for…": 저는 학생이에요 = "as for me, I am a student".',
      ),
      L(
        'Também indica contraste: 커피는 좋아해요 sugere "café eu gosto (outras coisas, talvez não)".',
        'It also shows contrast: 커피는 좋아해요 suggests "coffee I like (other things, maybe not)".',
      ),
    ],
    formation: [
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '은',
        example: '책은',
      },
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: '는',
        example: '저는',
      },
    ],
    examples: [
      example('저는 학생이에요.', 'Eu sou estudante.', 'I am a student.'),
      example('오늘은 바빠요.', 'Hoje estou ocupado(a).', "Today I'm busy."),
      example('한국어는 재미있어요.', 'Coreano é divertido.', 'Korean is fun.'),
      example(
        '커피는 좋아해요. 차는 안 마셔요.',
        'Café eu gosto. Chá eu não bebo.',
        "Coffee I like. Tea I don't drink.",
      ),
    ],
    mistakes: [
      L(
        '은/는 não é artigo ("o/a"). Brasileiros tendem a pensar nele como "o", mas ele marca o tema da frase.',
        '은/는 is not "the". It marks what the sentence is about, which English shows with word order or stress.',
      ),
      L(
        'Para apresentar uma informação nova ou responder "quem?", use 이/가, não 은/는.',
        'To introduce new information or answer "who?", use 이/가, not 은/는.',
      ),
    ],
    exercises: [
      {
        prompt: '책___ 재미있어요.',
        choices: ['은', '는'],
        answer: 0,
        translation: L('O livro é interessante.', 'The book is interesting.'),
        check: { kind: 'particle', noun: '책', type: 'topic' },
      },
      {
        prompt: '저___ 브라질 사람이에요.',
        choices: ['은', '는'],
        answer: 1,
        translation: L('Eu sou brasileiro(a).', 'I am Brazilian.'),
        check: { kind: 'particle', noun: '저', type: 'topic' },
      },
      {
        prompt: '오늘___ 바빠요.',
        choices: ['은', '는'],
        answer: 0,
        translation: L('Hoje estou ocupado(a).', "Today I'm busy."),
        check: { kind: 'particle', noun: '오늘', type: 'topic' },
      },
    ],
  },
  {
    id: 'subject-i-ga',
    level: 1,
    pattern: '이/가',
    title: L('Partícula de sujeito 이/가', 'Subject particle 이/가'),
    summary: L(
      'Marque o sujeito, principalmente com informação nova.',
      'Mark the subject, especially for new information.',
    ),
    explanation: [
      L(
        '이/가 marca o sujeito gramatical. Use para informação nova, com 있다/없다 e para responder perguntas como "quem?" (누가).',
        '이/가 marks the grammatical subject. Use it for new information, with 있다/없다, and to answer questions like "who?" (누가).',
      ),
      L(
        'Alguns pronomes mudam: 나 + 가 → 내가, 저 + 가 → 제가, 누구 + 가 → 누가.',
        'Some pronouns change: 나 + 가 → 내가, 저 + 가 → 제가, 누구 + 가 → 누가.',
      ),
    ],
    formation: [
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '이',
        example: '사람이',
      },
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: '가',
        example: '친구가',
      },
      {
        when: L('Formas especiais', 'Special forms'),
        form: '제가 · 내가 · 누가',
        example: '제가 할게요',
      },
    ],
    examples: [
      example('비가 와요.', 'Está chovendo.', "It's raining."),
      example('고양이가 있어요.', 'Tem um gato.', 'There is a cat.'),
      example('누가 왔어요?', 'Quem veio?', 'Who came?'),
      example('제가 할게요.', 'Eu faço.', "I'll do it."),
    ],
    mistakes: [
      L(
        'Não diga 저가 nem 나가: as formas corretas são 제가 e 내가.',
        'Do not say 저가 or 나가: the correct forms are 제가 and 내가.',
      ),
      L(
        'Com adjetivos de gosto, o objeto do gosto leva 이/가: 커피가 좋아요 (eu gosto de café; literalmente "café é bom").',
        'With feeling adjectives, the liked thing takes 이/가: 커피가 좋아요 ("I like coffee", literally "coffee is good").',
      ),
    ],
    exercises: [
      {
        prompt: '비___ 와요.',
        choices: ['이', '가'],
        answer: 1,
        translation: L('Está chovendo.', "It's raining."),
        check: { kind: 'particle', noun: '비', type: 'subject' },
      },
      {
        prompt: '사람___ 많아요.',
        choices: ['이', '가'],
        answer: 0,
        translation: L('Tem muita gente.', 'There are a lot of people.'),
        check: { kind: 'particle', noun: '사람', type: 'subject' },
      },
      {
        prompt: '___ 할게요. (저 + 가)',
        choices: ['제가', '저가'],
        answer: 0,
        translation: L('Eu faço.', "I'll do it."),
      },
    ],
  },
  {
    id: 'object-eul-reul',
    level: 1,
    pattern: '을/를',
    title: L('Partícula de objeto 을/를', 'Object particle 을/를'),
    summary: L(
      'Marque o objeto direto: o que você come, vê, estuda.',
      'Mark the direct object: what you eat, see, study.',
    ),
    explanation: [
      L(
        '을/를 marca o objeto direto da ação. Como o verbo fica no final da frase em coreano, a partícula mostra quem faz e quem recebe a ação.',
        '을/를 marks the direct object. Since the verb comes last in Korean, particles show who does what to whom.',
      ),
    ],
    formation: [
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '을',
        example: '밥을',
      },
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: '를',
        example: '커피를',
      },
    ],
    examples: [
      example('밥을 먹어요.', 'Eu como.', 'I eat.'),
      example('커피를 마셔요.', 'Bebo café.', 'I drink coffee.'),
      example('한국어를 공부해요.', 'Estudo coreano.', 'I study Korean.'),
      example('음악을 들어요.', 'Ouço música.', 'I listen to music.'),
    ],
    mistakes: [
      L(
        'O verbo 좋아하다 (gostar de) usa 을/를: 커피를 좋아해요. Já o adjetivo 좋다 usa 이/가: 커피가 좋아요.',
        'The verb 좋아하다 (to like) takes 을/를: 커피를 좋아해요. The adjective 좋다 takes 이/가: 커피가 좋아요.',
      ),
      L(
        'Em português "gostar DE" tem preposição; em coreano o objeto de 좋아하다 leva 을/를, sem preposição.',
        'Word order differs from English: the object comes before the verb (커피를 마셔요 = "coffee drink").',
      ),
    ],
    exercises: [
      {
        prompt: '빵___ 먹어요.',
        choices: ['을', '를'],
        answer: 0,
        translation: L('Como pão.', 'I eat bread.'),
        check: { kind: 'particle', noun: '빵', type: 'object' },
      },
      {
        prompt: '영화___ 봐요.',
        choices: ['을', '를'],
        answer: 1,
        translation: L('Assisto a um filme.', 'I watch a movie.'),
        check: { kind: 'particle', noun: '영화', type: 'object' },
      },
      {
        prompt: '물___ 마셔요.',
        choices: ['을', '를'],
        answer: 0,
        translation: L('Bebo água.', 'I drink water.'),
        check: { kind: 'particle', noun: '물', type: 'object' },
      },
    ],
  },
  {
    id: 'negative-copula-anida',
    level: 1,
    pattern: '이/가 아니에요',
    title: L('Não ser: 아니다', 'Not to be: 아니다'),
    summary: L(
      'Negue uma identidade: "Não sou estudante".',
      'Deny an identity: "I am not a student".',
    ),
    explanation: [
      L(
        'A negação de 이다 é 아니다. O substantivo leva 이/가: 학생이 아니에요 (não sou estudante).',
        'The negative of 이다 is 아니다. The noun takes 이/가: 학생이 아니에요 (I am not a student).',
      ),
    ],
    formation: [
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '이 아니에요',
        example: '학생이 아니에요',
      },
      {
        when: L('Depois de vogal', 'After a vowel'),
        form: '가 아니에요',
        example: '의사가 아니에요',
      },
      {
        when: L('Formal', 'Formal'),
        form: '아닙니다',
        example: '학생이 아닙니다',
      },
    ],
    examples: [
      example(
        '저는 학생이 아니에요.',
        'Eu não sou estudante.',
        'I am not a student.',
      ),
      example(
        '이건 제 가방이 아니에요.',
        'Esta não é a minha bolsa.',
        'This is not my bag.',
      ),
      example(
        '그 사람은 의사가 아닙니다.',
        'Essa pessoa não é médica.',
        'That person is not a doctor.',
      ),
    ],
    mistakes: [
      L(
        'Não use 안 com 이다: 안 학생이에요 está errado. Use 학생이 아니에요.',
        'Do not use 안 with 이다: 안 학생이에요 is wrong. Use 학생이 아니에요.',
      ),
    ],
    exercises: [
      {
        prompt: '저는 의사___ 아니에요.',
        choices: ['이', '가'],
        answer: 1,
        translation: L('Eu não sou médico(a).', 'I am not a doctor.'),
        check: { kind: 'particle', noun: '의사', type: 'subject' },
      },
      {
        prompt: '이건 책___ 아니에요.',
        choices: ['이', '가'],
        answer: 0,
        translation: L('Isto não é um livro.', 'This is not a book.'),
        check: { kind: 'particle', noun: '책', type: 'subject' },
      },
      {
        prompt: '저는 ___.',
        choices: ['학생이 아니에요', '안 학생이에요'],
        answer: 0,
        translation: L('Eu não sou estudante.', 'I am not a student.'),
      },
    ],
  },
  {
    id: 'existence-itda-eopda',
    level: 1,
    pattern: '있다 / 없다',
    title: L(
      'Ter, haver, estar: 있다 e 없다',
      'To have, there is, to be somewhere: 있다 and 없다',
    ),
    summary: L(
      'Diga o que existe, o que você tem e onde algo está.',
      'Say what exists, what you have and where something is.',
    ),
    explanation: [
      L(
        '있다 cobre "ter", "haver" e "estar (em um lugar)". O oposto é 없다: "não ter", "não haver".',
        '있다 covers "to have", "there is" and "to be (somewhere)". The opposite is 없다: "not to have", "there isn\'t".',
      ),
      L(
        'A coisa que existe leva 이/가; o lugar leva 에: 집에 고양이가 있어요 (tem um gato em casa).',
        'The thing that exists takes 이/가; the place takes 에: 집에 고양이가 있어요 (there is a cat at home).',
      ),
    ],
    formation: [
      {
        when: L('Existe / tenho', 'There is / I have'),
        form: '이/가 있어요',
        example: '시간이 있어요',
      },
      {
        when: L('Não existe / não tenho', "There isn't / I don't have"),
        form: '이/가 없어요',
        example: '돈이 없어요',
      },
      {
        when: L('Onde algo está', 'Where something is'),
        form: '에 있어요',
        example: '집에 있어요',
      },
    ],
    examples: [
      example('시간이 있어요?', 'Você tem tempo?', 'Do you have time?'),
      example('돈이 없어요.', 'Não tenho dinheiro.', "I don't have any money."),
      example(
        '화장실은 저기에 있어요.',
        'O banheiro fica ali.',
        'The restroom is over there.',
      ),
    ],
    mistakes: [
      L(
        'Para "não ter", use 없어요, não 안 있어요.',
        'For "not to have", use 없어요, not 안 있어요.',
      ),
      L(
        'Português usa verbos diferentes (ter, haver, estar); em coreano é o mesmo 있다.',
        'English uses "have", "there is" and "be" for these; Korean uses 있다 for all three.',
      ),
    ],
    exercises: [
      {
        prompt: '시간___ 있어요?',
        choices: ['이', '가'],
        answer: 0,
        translation: L('Você tem tempo?', 'Do you have time?'),
        check: { kind: 'particle', noun: '시간', type: 'subject' },
      },
      {
        prompt: '돈이 ___.',
        choices: ['없어요', '안 있어요'],
        answer: 0,
        translation: L('Não tenho dinheiro.', "I don't have any money."),
        check: { kind: 'form', verb: '있다', form: 'negShort.present' },
      },
      {
        prompt: '집에 고양이___ 있어요.',
        choices: ['이', '가'],
        answer: 1,
        translation: L('Tem um gato em casa.', 'There is a cat at home.'),
        check: { kind: 'particle', noun: '고양이', type: 'subject' },
      },
    ],
  },
  {
    id: 'location-e',
    level: 1,
    pattern: '에',
    title: L(
      'Partícula 에: tempo, destino e lugar',
      'Particle 에: time, destination and place',
    ),
    summary: L(
      'Diga quando, para onde e onde algo está.',
      'Say when, where to, and where something is.',
    ),
    explanation: [
      L(
        '에 marca o momento (세 시에, 월요일에), o destino de verbos de movimento (학교에 가요) e o lugar onde algo está (집에 있어요).',
        '에 marks a point in time (세 시에, 월요일에), the destination of movement verbs (학교에 가요) and where something is (집에 있어요).',
      ),
      L(
        'Palavras como 오늘, 내일, 어제 e 지금 não levam 에.',
        'Words like 오늘, 내일, 어제 and 지금 do not take 에.',
      ),
    ],
    formation: [
      { when: L('Tempo', 'Time'), form: '에', example: '일곱 시에' },
      { when: L('Destino', 'Destination'), form: '에', example: '학교에 가요' },
      {
        when: L('Onde algo está', 'Where something is'),
        form: '에',
        example: '책상 위에 있어요',
      },
    ],
    examples: [
      example('학교에 가요.', 'Vou para a escola.', 'I go to school.'),
      example('일곱 시에 일어나요.', 'Acordo às sete.', 'I get up at seven.'),
      example(
        '책이 책상 위에 있어요.',
        'O livro está em cima da mesa.',
        'The book is on the desk.',
      ),
      example(
        '주말에 쉬어요.',
        'Descanso no fim de semana.',
        'I rest on weekends.',
      ),
    ],
    mistakes: [
      L(
        'Não use 에 com 오늘, 내일, 어제, 지금: diga 오늘 가요, não 오늘에 가요.',
        'Do not use 에 with 오늘, 내일, 어제, 지금: say 오늘 가요, not 오늘에 가요.',
      ),
      L(
        '에 vs 에서: 에 é o destino ou onde algo está; 에서 é onde uma ação acontece.',
        '에 vs 에서: 에 is the destination or where something is; 에서 is where an action happens.',
      ),
    ],
    exercises: [
      {
        prompt: '학교___ 가요.',
        choices: ['에', '에서'],
        answer: 0,
        translation: L('Vou para a escola.', 'I go to school.'),
      },
      {
        prompt: '___ 바빠요.',
        choices: ['오늘', '오늘에'],
        answer: 0,
        translation: L('Hoje estou ocupado(a).', "I'm busy today."),
      },
      {
        prompt: '월요일___ 시험이 있어요.',
        choices: ['에', '에서'],
        answer: 0,
        translation: L('Tenho prova na segunda.', 'I have an exam on Monday.'),
      },
    ],
  },
  {
    id: 'location-eseo',
    level: 1,
    pattern: '에서',
    title: L(
      'Partícula 에서: onde a ação acontece',
      'Particle 에서: where an action happens',
    ),
    summary: L(
      'Diga onde você faz algo, ou de onde algo vem.',
      'Say where you do something, or where something comes from.',
    ),
    explanation: [
      L(
        '에서 marca o lugar onde uma ação acontece (도서관에서 공부해요) e também o ponto de partida, "de" (서울에서 왔어요).',
        '에서 marks the place where an action happens (도서관에서 공부해요) and also the starting point, "from" (서울에서 왔어요).',
      ),
    ],
    formation: [
      {
        when: L('Lugar da ação', 'Place of the action'),
        form: '에서',
        example: '카페에서 공부해요',
      },
      {
        when: L('Origem ("de")', 'Origin ("from")'),
        form: '에서',
        example: '서울에서 왔어요',
      },
    ],
    examples: [
      example(
        '도서관에서 공부해요.',
        'Estudo na biblioteca.',
        'I study at the library.',
      ),
      example(
        '카페에서 커피를 마셔요.',
        'Bebo café no café.',
        'I drink coffee at the café.',
      ),
      example(
        '회사에서 일해요.',
        'Trabalho na empresa.',
        'I work at the company.',
      ),
      example('브라질에서 왔어요.', 'Vim do Brasil.', 'I came from Brazil.'),
    ],
    mistakes: [
      L(
        'Com 있다/없다, use 에, não 에서: 집에 있어요 (estou em casa).',
        'With 있다/없다, use 에, not 에서: 집에 있어요 (I am at home).',
      ),
    ],
    exercises: [
      {
        prompt: '식당___ 밥을 먹어요.',
        choices: ['에', '에서'],
        answer: 1,
        translation: L('Como no restaurante.', 'I eat at the restaurant.'),
      },
      {
        prompt: '지금 집___ 있어요.',
        choices: ['에', '에서'],
        answer: 0,
        translation: L('Estou em casa agora.', "I'm at home now."),
      },
      {
        prompt: '은행___ 일해요.',
        choices: ['에', '에서'],
        answer: 1,
        translation: L('Trabalho no banco.', 'I work at a bank.'),
      },
    ],
  },
]
