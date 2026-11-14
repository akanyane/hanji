import { example, type GrammarLesson, L } from '../types'

export const connectives: GrammarLesson[] = [
  {
    id: 'connective-go',
    level: 1,
    pattern: '-고',
    title: L('E (ligar frases): -고', 'And (joining clauses): -고'),
    summary: L(
      'Ligue duas ações ou características: "como e vou".',
      'Join two actions or descriptions: "I eat and go".',
    ),
    explanation: [
      L(
        'Radical + 고 liga duas frases: lista características (싸고 맛있어요) ou ações em sequência (밥을 먹고 학교에 가요).',
        'Stem + 고 joins two clauses: listing qualities (싸고 맛있어요) or actions in sequence (밥을 먹고 학교에 가요).',
      ),
    ],
    formation: [
      {
        when: L('Qualquer verbo ou adjetivo', 'Any verb or adjective'),
        form: '-고',
        example: '싸고 · 먹고',
      },
    ],
    examples: [
      example(
        '저는 밥을 먹고 학교에 가요.',
        'Eu como e vou para a escola.',
        'I eat and then go to school.',
      ),
      example(
        '이 식당은 싸고 맛있어요.',
        'Este restaurante é barato e gostoso.',
        'This restaurant is cheap and good.',
      ),
      example(
        '숙제를 하고 잤어요.',
        'Fiz a lição e dormi.',
        'I did my homework and went to bed.',
      ),
    ],
    mistakes: [
      L(
        'Em ações em sequência, normalmente só o último verbo leva o tempo: 먹고 갔어요 ("comi e fui").',
        'In a sequence of actions, usually only the last verb carries the tense: 먹고 갔어요 ("I ate and went").',
      ),
      L(
        '-고 liga frases, não substantivos. Para "pão e leite" use 와/과 ou 하고: 빵과 우유.',
        '-고 joins clauses, not nouns. For "bread and milk" use 와/과 or 하고: 빵과 우유.',
      ),
    ],
    exercises: [
      {
        prompt: '이 식당은 ___ 맛있어요. (싸다)',
        choices: ['싸고', '싸서'],
        answer: 0,
        translation: L(
          'Este restaurante é barato e gostoso.',
          'This restaurant is cheap and good.',
        ),
        check: { kind: 'form', verb: '싸다', form: 'connective.and' },
      },
      {
        prompt: '밥을 ___ 학교에 갔어요. (먹다)',
        choices: ['먹고', '먹었어요'],
        answer: 0,
        translation: L(
          'Comi e fui para a escola.',
          'I ate and went to school.',
        ),
        check: { kind: 'form', verb: '먹다', form: 'connective.and' },
      },
      {
        prompt: '언니는 키가 ___ 예뻐요. (크다)',
        choices: ['크고', '커고'],
        answer: 0,
        translation: L(
          'Minha irmã é alta e bonita.',
          'My older sister is tall and pretty.',
        ),
        check: { kind: 'form', verb: '크다', form: 'connective.and' },
      },
    ],
  },
  {
    id: 'connective-aseo',
    level: 2,
    pattern: '-아서/어서',
    title: L(
      'Causa e sequência: -아서/어서',
      'Reason and sequence: -아서/어서',
    ),
    summary: L(
      '"Porque…" ou "e então…" com ações ligadas.',
      '"Because…" or "and then…" for linked actions.',
    ),
    explanation: [
      L(
        'Pegue a forma -아요/어요 e troque 요 por 서: 바빠요 → 바빠서. Expressa causa (배가 고파서 먹었어요) ou ações ligadas, em que a segunda depende da primeira (친구를 만나서 영화를 봤어요).',
        'Take the -아요/어요 form and replace 요 with 서: 바빠요 → 바빠서. It expresses a reason (배가 고파서 먹었어요) or linked actions where the second depends on the first (친구를 만나서 영화를 봤어요).',
      ),
    ],
    formation: [
      {
        when: L('Última vogal ㅏ ou ㅗ', 'Last vowel ㅏ or ㅗ'),
        form: '아서',
        example: '좋아서',
      },
      {
        when: L('Outras vogais', 'Other vowels'),
        form: '어서',
        example: '먹어서',
      },
      {
        when: L('Verbos com 하다', '하다 verbs'),
        form: '해서',
        example: '피곤해서',
      },
    ],
    conjugationTable: {
      forms: ['connective.so'],
      verbs: ['가다', '먹다', '하다', '듣다', '바쁘다', '덥다'],
    },
    examples: [
      example(
        '배가 고파서 밥을 먹었어요.',
        'Estava com fome, então comi.',
        'I was hungry, so I ate.',
      ),
      example(
        '늦어서 죄송합니다.',
        'Desculpe pelo atraso.',
        'Sorry for being late.',
      ),
      example(
        '친구를 만나서 영화를 봤어요.',
        'Encontrei um amigo e vimos um filme.',
        'I met a friend and we watched a movie.',
      ),
      example(
        '비가 와서 집에 있었어요.',
        'Choveu, então fiquei em casa.',
        'It rained, so I stayed home.',
      ),
    ],
    mistakes: [
      L(
        '-아서/어서 não leva passado: 늦어서, não 늦었어서.',
        '-아서/어서 never takes the past: 늦어서, not 늦었어서.',
      ),
      L(
        'Não use -아서/어서 antes de pedidos ou convites (-(으)세요, -(으)ㅂ시다). Nesses casos use -(으)니까.',
        'Do not use -아서/어서 before requests or suggestions (-(으)세요, -(으)ㅂ시다). Use -(으)니까 instead.',
      ),
    ],
    exercises: [
      {
        prompt: '___ 못 갔어요. (바쁘다)',
        choices: ['바빠서', '바쁘서'],
        answer: 0,
        translation: L(
          'Estava ocupado(a), então não fui.',
          "I was busy, so I couldn't go.",
        ),
        check: { kind: 'form', verb: '바쁘다', form: 'connective.so' },
      },
      {
        prompt: '비가 ___ 집에 있었어요. (오다)',
        choices: ['와서', '오아서'],
        answer: 0,
        translation: L(
          'Choveu, então fiquei em casa.',
          'It rained, so I stayed home.',
        ),
        check: { kind: 'form', verb: '오다', form: 'connective.so' },
      },
      {
        prompt: '___ 죄송합니다. (늦다)',
        choices: ['늦어서', '늦었어서'],
        answer: 0,
        translation: L('Desculpe pelo atraso.', 'Sorry for being late.'),
        check: { kind: 'form', verb: '늦다', form: 'connective.so' },
      },
    ],
  },
  {
    id: 'connective-jiman',
    level: 1,
    pattern: '-지만',
    title: L('Mas: -지만', 'But: -지만'),
    summary: L(
      'Contraste duas ideias: "é difícil, mas é divertido".',
      'Contrast two ideas: "it is hard, but fun".',
    ),
    explanation: [
      L(
        'Radical + 지만 = "mas". O radical não muda: 어렵지만, 비싸지만.',
        'Stem + 지만 = "but". The stem never changes: 어렵지만, 비싸지만.',
      ),
    ],
    formation: [
      {
        when: L('Qualquer verbo ou adjetivo', 'Any verb or adjective'),
        form: '-지만',
        example: '어렵지만',
      },
    ],
    examples: [
      example(
        '한국어는 어렵지만 재미있어요.',
        'Coreano é difícil, mas é divertido.',
        'Korean is hard, but fun.',
      ),
      example(
        '비싸지만 맛있어요.',
        'É caro, mas é gostoso.',
        "It's expensive, but delicious.",
      ),
      example(
        '피곤하지만 운동했어요.',
        'Estava cansado(a), mas malhei.',
        'I was tired, but I worked out.',
      ),
    ],
    mistakes: [
      L(
        'No passado, o tempo vai no primeiro verbo também: 먹었지만 ("comi, mas…").',
        'For the past, the first verb also takes the tense: 먹었지만 ("I ate, but…").',
      ),
    ],
    exercises: [
      {
        prompt: '한국어는 ___ 재미있어요. (어렵다)',
        choices: ['어렵지만', '어려워지만'],
        answer: 0,
        translation: L(
          'Coreano é difícil, mas é divertido.',
          'Korean is hard, but fun.',
        ),
        check: { kind: 'form', verb: '어렵다', form: 'connective.but' },
      },
      {
        prompt: '___ 맛있어요. (비싸다)',
        choices: ['비싸지만', '비싸만'],
        answer: 0,
        translation: L(
          'É caro, mas é gostoso.',
          "It's expensive, but delicious.",
        ),
        check: { kind: 'form', verb: '비싸다', form: 'connective.but' },
      },
      {
        prompt: '방은 ___ 깨끗해요. (작다)',
        choices: ['작지만', '작아지만'],
        answer: 0,
        translation: L(
          'O quarto é pequeno, mas é limpo.',
          'The room is small, but clean.',
        ),
        check: { kind: 'form', verb: '작다', form: 'connective.but' },
      },
    ],
  },
  {
    id: 'connective-myeon',
    level: 2,
    pattern: '-(으)면',
    title: L('Se / quando: -(으)면', 'If / when: -(으)면'),
    summary: L(
      'Condições: "se tiver tempo, vamos nos ver".',
      'Conditions: "if you have time, let\'s meet".',
    ),
    explanation: [
      L(
        'Depois de vogal ou ㄹ: 면 (가면, 살면). Depois de consoante: 으면 (먹으면). Irregulares mudam o radical: 덥다 → 더우면, 듣다 → 들으면.',
        'After a vowel or ㄹ: 면 (가면, 살면). After a consonant: 으면 (먹으면). Irregulars change the stem: 덥다 → 더우면, 듣다 → 들으면.',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal ou ㄹ', 'After a vowel or ㄹ'),
        form: '면',
        example: '가면 · 살면',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '으면',
        example: '먹으면',
      },
    ],
    conjugationTable: {
      forms: ['connective.if'],
      verbs: ['가다', '먹다', '듣다', '살다', '덥다', '있다'],
    },
    examples: [
      example(
        '시간이 있으면 만나요.',
        'Se tiver tempo, vamos nos ver.',
        "If you have time, let's meet.",
      ),
      example(
        '비가 오면 집에 있을 거예요.',
        'Se chover, vou ficar em casa.',
        "If it rains, I'll stay home.",
      ),
      example(
        '피곤하면 쉬세요.',
        'Se estiver cansado(a), descanse.',
        "If you're tired, get some rest.",
      ),
    ],
    mistakes: [
      L(
        'Com radical em ㄹ, não acrescente 으: 살면, não 살으면.',
        'With ㄹ stems, do not add 으: 살면, not 살으면.',
      ),
    ],
    exercises: [
      {
        prompt: '시간이 ___ 만나요. (있다)',
        choices: ['있으면', '있면'],
        answer: 0,
        translation: L(
          'Se tiver tempo, vamos nos ver.',
          "If you have time, let's meet.",
        ),
        check: { kind: 'form', verb: '있다', form: 'connective.if' },
      },
      {
        prompt: '비가 ___ 안 갈 거예요. (오다)',
        choices: ['오면', '오으면'],
        answer: 0,
        translation: L('Se chover, não vou.', "If it rains, I won't go."),
        check: { kind: 'form', verb: '오다', form: 'connective.if' },
      },
      {
        prompt: '___ 에어컨을 켜세요. (덥다)',
        choices: ['더우면', '덥으면'],
        answer: 0,
        translation: L(
          'Se estiver quente, ligue o ar-condicionado.',
          "If it's hot, turn on the air conditioner.",
        ),
        check: { kind: 'form', verb: '덥다', form: 'connective.if' },
      },
    ],
  },
  {
    id: 'connective-eunikka',
    level: 2,
    pattern: '-(으)니까',
    title: L(
      'Porque (com pedidos): -(으)니까',
      'Because (with requests): -(으)니까',
    ),
    summary: L(
      'Dê um motivo, inclusive antes de pedidos e convites.',
      'Give a reason, even before requests and suggestions.',
    ),
    explanation: [
      L(
        '-(으)니까 dá um motivo, como -아서/어서, mas pode vir antes de pedidos e convites: 비가 오니까 우산을 가져가세요.',
        '-(으)니까 gives a reason, like -아서/어서, but it can come before requests and suggestions: 비가 오니까 우산을 가져가세요.',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal ou ㄹ', 'After a vowel or ㄹ'),
        form: '니까',
        example: '오니까 · 사니까',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '으니까',
        example: '없으니까',
      },
    ],
    conjugationTable: {
      forms: ['connective.because'],
      verbs: ['오다', '먹다', '살다', '춥다', '없다'],
    },
    examples: [
      example(
        '비가 오니까 우산을 가져가세요.',
        'Está chovendo, então leve guarda-chuva.',
        "It's raining, so take an umbrella.",
      ),
      example(
        '시간이 없으니까 빨리 가요.',
        'Não temos tempo, então vamos rápido.',
        "We don't have time, so let's hurry.",
      ),
      example(
        '추우니까 창문을 닫을까요?',
        'Está frio; fecho a janela?',
        "It's cold; shall I close the window?",
      ),
    ],
    mistakes: [
      L(
        'Para se desculpar, prefira -아서/어서: 늦어서 죄송합니다 (não 늦었으니까 죄송합니다).',
        'For apologies, use -아서/어서: 늦어서 죄송합니다 (not 늦었으니까 죄송합니다).',
      ),
    ],
    exercises: [
      {
        prompt: '비가 ___ 우산을 가져가세요. (오다)',
        choices: ['오니까', '와서'],
        answer: 0,
        translation: L(
          'Está chovendo, então leve guarda-chuva.',
          "It's raining, so take an umbrella.",
        ),
        check: { kind: 'form', verb: '오다', form: 'connective.because' },
      },
      {
        prompt: '___ 창문을 닫으세요. (춥다)',
        choices: ['추우니까', '춥으니까'],
        answer: 0,
        translation: L(
          'Está frio, então feche a janela.',
          "It's cold, so close the window.",
        ),
        check: { kind: 'form', verb: '춥다', form: 'connective.because' },
      },
      {
        prompt: '시간이 ___ 택시를 타요. (없다)',
        choices: ['없으니까', '없니까'],
        answer: 0,
        translation: L(
          'Não temos tempo, então vamos de táxi.',
          "We don't have time, so let's take a taxi.",
        ),
        check: { kind: 'form', verb: '없다', form: 'connective.because' },
      },
    ],
  },
  {
    id: 'indirect-speech-dago',
    level: 3,
    pattern: '-다고 하다',
    title: L('Discurso indireto: -다고 하다', 'Reported speech: -다고 하다'),
    summary: L(
      'Conte o que alguém disse: "ele disse que vem amanhã".',
      'Report what someone said: "he said he is coming tomorrow".',
    ),
    explanation: [
      L(
        'Para relatar uma afirmação, use a forma "simples" do verbo + 고 하다. Verbos no presente: -(느)ㄴ다고 (온다고, 먹는다고). Adjetivos: -다고 (바쁘다고). Passado: -았/었다고 (갔다고). Substantivos: -(이)라고 (학생이라고).',
        'To report a statement, use the plain form of the verb + 고 하다. Present verbs: -(느)ㄴ다고 (온다고, 먹는다고). Adjectives: -다고 (바쁘다고). Past: -았/었다고 (갔다고). Nouns: -(이)라고 (학생이라고).',
      ),
    ],
    formation: [
      {
        when: L('Verbo, depois de vogal', 'Verb, after a vowel'),
        form: 'ㄴ다고',
        example: '온다고 했어요',
      },
      {
        when: L('Verbo, depois de consoante', 'Verb, after a consonant'),
        form: '는다고',
        example: '먹는다고 했어요',
      },
      {
        when: L('Adjetivo', 'Adjective'),
        form: '다고',
        example: '바쁘다고 했어요',
      },
      {
        when: L('Passado', 'Past'),
        form: '았/었다고',
        example: '갔다고 했어요',
      },
      {
        when: L('Substantivo', 'Noun'),
        form: '(이)라고',
        example: '학생이라고 했어요',
      },
    ],
    examples: [
      example(
        '친구가 내일 온다고 했어요.',
        'Meu amigo disse que vem amanhã.',
        'My friend said he is coming tomorrow.',
      ),
      example(
        '민수 씨가 바쁘다고 했어요.',
        'O Minsu disse que está ocupado.',
        'Minsu said he is busy.',
      ),
      example(
        '지수 씨는 학생이라고 했어요.',
        'A Jisu disse que é estudante.',
        'Jisu said she is a student.',
      ),
      example(
        '어제 영화를 봤다고 했어요.',
        'Disse que viu um filme ontem.',
        'He said he watched a movie yesterday.',
      ),
    ],
    mistakes: [
      L(
        'Adjetivos não levam ㄴ/는: 바쁘다고, nunca 바쁜다고.',
        'Adjectives never take ㄴ/는: 바쁘다고, never 바쁜다고.',
      ),
      L(
        'Na fala, -다고 했어요 costuma encurtar para -대요: 바쁘대요 ("dizem que está ocupado").',
        'In speech, -다고 했어요 often shortens to -대요: 바쁘대요 ("he says he\'s busy").',
      ),
    ],
    exercises: [
      {
        prompt: '친구가 내일 ___ 했어요. (오다)',
        choices: ['온다고', '오다고'],
        answer: 0,
        translation: L(
          'Meu amigo disse que vem amanhã.',
          'My friend said he is coming tomorrow.',
        ),
      },
      {
        prompt: '민수 씨가 ___ 했어요. (바쁘다)',
        choices: ['바쁘다고', '바쁜다고'],
        answer: 0,
        translation: L(
          'O Minsu disse que está ocupado.',
          'Minsu said he is busy.',
        ),
      },
      {
        prompt: '지수 씨는 학생___ 했어요.',
        choices: ['이라고', '이다고'],
        answer: 0,
        translation: L(
          'A Jisu disse que é estudante.',
          'Jisu said she is a student.',
        ),
      },
    ],
  },
]
