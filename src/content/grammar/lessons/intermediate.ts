import { example, type GrammarLesson, L } from '../types'

// TOPIK 2–3 expressions. Every exercise is verified against the conjugation
// engine. Passive and causative verbs are lexical (no rule predicts 먹히다
// vs 먹이다): LEXICAL_VOICE lists them, a test ties each exercise to it, and
// the engine then checks how that verb is conjugated.

/** Passive (피동) and causative (사동) forms of common verbs. */
export const LEXICAL_VOICE: Record<
  string,
  { passive?: string; causative?: string }
> = {
  보다: { passive: '보이다', causative: '보이다' },
  듣다: { passive: '들리다' },
  열다: { passive: '열리다' },
  닫다: { passive: '닫히다' },
  잡다: { passive: '잡히다' },
  먹다: { passive: '먹히다', causative: '먹이다' },
  팔다: { passive: '팔리다' },
  쓰다: { passive: '쓰이다' },
  놓다: { passive: '놓이다' },
  안다: { passive: '안기다' },
  입다: { causative: '입히다' },
  읽다: { causative: '읽히다' },
  앉다: { causative: '앉히다' },
  울다: { causative: '울리다' },
  웃다: { causative: '웃기다' },
  신다: { causative: '신기다' },
  자다: { causative: '재우다' },
  알다: { causative: '알리다' },
}

export const intermediate: GrammarLesson[] = [
  {
    id: 'ability-su-itda',
    level: 2,
    pattern: '-(으)ㄹ 수 있다/없다',
    title: L(
      'Conseguir: -(으)ㄹ 수 있다/없다',
      'Can and cannot: -(으)ㄹ 수 있다/없다',
    ),
    summary: L(
      'Diga o que você consegue (ou não) fazer.',
      'Say what you can (or cannot) do.',
    ),
    explanation: [
      L(
        'Literalmente "existe/não existe a possibilidade de". Use para habilidade ("sei nadar") e para possibilidade ("dá para entrar?").',
        'Literally "the possibility of … exists/doesn\'t exist". It covers ability ("I can swim") and possibility ("can we go in?").',
      ),
      L(
        'Depois de vogal ou ㄹ: ㄹ 수 (갈 수, 만들 수). Depois de consoante: 을 수 (먹을 수). Irregulares mudam o radical: 듣다 → 들을 수, 돕다 → 도울 수.',
        'After a vowel or ㄹ: ㄹ 수 (갈 수, 만들 수). After a consonant: 을 수 (먹을 수). Irregulars change the stem: 듣다 → 들을 수, 돕다 → 도울 수.',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal ou ㄹ', 'After a vowel or ㄹ'),
        form: 'ㄹ 수 있다',
        example: '갈 수 있어요 · 만들 수 있어요',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '을 수 있다',
        example: '먹을 수 있어요',
      },
    ],
    conjugationTable: {
      forms: ['ability.can', 'ability.cannot'],
      verbs: ['가다', '먹다', '듣다', '만들다', '돕다'],
    },
    examples: [
      example(
        '저는 한국어를 읽을 수 있어요.',
        'Eu consigo ler coreano.',
        'I can read Korean.',
      ),
      example(
        '내일은 바빠서 만날 수 없어요.',
        'Amanhã estou ocupado(a), então não posso te encontrar.',
        "I'm busy tomorrow, so I can't meet.",
      ),
      example(
        '여기에서 사진을 찍을 수 있어요?',
        'Dá para tirar foto aqui?',
        'Can I take pictures here?',
      ),
    ],
    mistakes: [
      L(
        'Para "saber fazer" algo aprendido (nadar, dirigir), o coreano também usa -(으)ㄹ 줄 알다; mas -(으)ㄹ 수 있다 serve sempre e é o mais comum no início.',
        'For learned skills (swimming, driving) Korean also has -(으)ㄹ 줄 알다; -(으)ㄹ 수 있다 always works and is the one to learn first.',
      ),
      L(
        'Não esqueça o espaço: 갈 수 있어요, não 갈수있어요.',
        'Mind the spaces: 갈 수 있어요, not 갈수있어요.',
      ),
    ],
    exercises: [
      {
        prompt: '김치를 ___. (먹다)',
        choices: ['먹을 수 있어요', '먹 수 있어요', '먹는 수 있어요'],
        answer: 0,
        translation: L('Eu consigo comer kimchi.', 'I can eat kimchi.'),
        check: { kind: 'form', verb: '먹다', form: 'ability.can' },
      },
      {
        prompt: '너무 시끄러워서 잘 ___. (듣다)',
        choices: ['들을 수 없어요', '듣을 수 없어요', '들 수 없어요'],
        answer: 0,
        translation: L(
          'Está barulhento demais, não consigo ouvir direito.',
          "It's too noisy, so I can't hear well.",
        ),
        check: { kind: 'form', verb: '듣다', form: 'ability.cannot' },
      },
      {
        prompt: '저는 케이크를 ___. (만들다)',
        choices: ['만들 수 있어요', '만들을 수 있어요', '만드을 수 있어요'],
        answer: 0,
        translation: L('Eu sei fazer bolo.', 'I can make a cake.'),
        check: { kind: 'form', verb: '만들다', form: 'ability.can' },
      },
    ],
  },
  {
    id: 'obligation-aya-hada',
    level: 2,
    pattern: '-아/어야 하다',
    title: L('Ter que: -아/어야 하다', 'Have to: -아/어야 하다'),
    summary: L(
      'Obrigações e necessidades: "tenho que estudar".',
      'Obligations and needs: "I have to study".',
    ),
    explanation: [
      L(
        'Junte 야 à forma -아/어 do verbo (a mesma do presente educado sem 요) e depois 하다: 가 → 가야 해요, 먹어 → 먹어야 해요, 해 → 해야 해요.',
        'Add 야 to the -아/어 form of the verb (the polite present without 요), then 하다: 가 → 가야 해요, 먹어 → 먹어야 해요, 해 → 해야 해요.',
      ),
      L(
        'Na fala, 되다 também é muito comum no lugar de 하다: 가야 돼요.',
        'In speech, 되다 often replaces 하다: 가야 돼요.',
      ),
    ],
    formation: [
      {
        when: L('Última vogal ㅏ ou ㅗ', 'Last vowel ㅏ or ㅗ'),
        form: '아야 하다',
        example: '가야 해요 · 와야 해요',
      },
      {
        when: L('Outras vogais', 'Other vowels'),
        form: '어야 하다',
        example: '먹어야 해요',
      },
      {
        when: L('하다', '하다'),
        form: '해야 하다',
        example: '공부해야 해요',
      },
    ],
    conjugationTable: {
      forms: ['obligation'],
      verbs: ['가다', '먹다', '공부하다', '듣다', '모르다'],
    },
    examples: [
      example(
        '내일 시험이 있어서 공부해야 해요.',
        'Amanhã tem prova, então tenho que estudar.',
        'I have a test tomorrow, so I have to study.',
      ),
      example(
        '여권을 꼭 가져와야 해요.',
        'Você tem que trazer o passaporte sem falta.',
        'You must bring your passport.',
      ),
      example(
        '몇 시까지 가야 돼요?',
        'Até que horas eu tenho que ir?',
        'By what time do I have to go?',
      ),
    ],
    mistakes: [
      L(
        'Não junte 야 ao radical: é 먹어야, não 먹야 — use sempre a forma -아/어.',
        'Do not attach 야 to the bare stem: it is 먹어야, not 먹야. Always use the -아/어 form.',
      ),
      L(
        '"Não preciso" não é a negação disso: diga 안 가도 돼요 ("não precisa ir"), não 안 가야 해요.',
        '"Don\'t have to" is not the negative of this: say 안 가도 돼요 ("you don\'t need to go"), not 안 가야 해요 (which means "must not go").',
      ),
    ],
    exercises: [
      {
        prompt: '숙제를 ___. (하다)',
        choices: ['해야 해요', '하야 해요', '해야 돼서'],
        answer: 0,
        translation: L(
          'Tenho que fazer a lição de casa.',
          'I have to do my homework.',
        ),
        check: { kind: 'form', verb: '하다', form: 'obligation' },
      },
      {
        prompt: '약을 ___. (먹다)',
        choices: ['먹어야 해요', '먹야 해요', '먹아야 해요'],
        answer: 0,
        translation: L(
          'Você tem que tomar o remédio.',
          'You have to take the medicine.',
        ),
        check: { kind: 'form', verb: '먹다', form: 'obligation' },
      },
      {
        prompt: '일찍 ___. (자다)',
        choices: ['자야 해요', '자어야 해요', '잘야 해요'],
        answer: 0,
        translation: L('Tenho que dormir cedo.', 'I have to sleep early.'),
        check: { kind: 'form', verb: '자다', form: 'obligation' },
      },
    ],
  },
  {
    id: 'permission-prohibition',
    level: 2,
    pattern: '-아/어도 되다 · -(으)면 안 되다',
    title: L(
      'Pode e não pode: -아/어도 되다, -(으)면 안 되다',
      'May and must not: -아/어도 되다, -(으)면 안 되다',
    ),
    summary: L(
      'Pedir permissão e falar de proibições.',
      'Ask for permission and talk about rules.',
    ),
    explanation: [
      L(
        '-아/어도 되다 = "mesmo que faça, está tudo bem" → permissão: 앉아도 돼요? ("Posso sentar?").',
        '-아/어도 되다 = "even if you do it, it\'s fine" → permission: 앉아도 돼요? ("May I sit?").',
      ),
      L(
        '-(으)면 안 되다 = "se fizer, não está bem" → proibição: 여기에서 담배를 피우면 안 돼요.',
        '-(으)면 안 되다 = "if you do it, it\'s not OK" → prohibition: 여기에서 담배를 피우면 안 돼요.',
      ),
    ],
    formation: [
      {
        when: L(
          'Permissão: forma -아/어 + 도 되다',
          'Permission: -아/어 form + 도 되다',
        ),
        form: '아/어도 되다',
        example: '먹어도 돼요 · 써도 돼요',
      },
      {
        when: L(
          'Proibição: -(으)면 + 안 되다',
          'Prohibition: -(으)면 + 안 되다',
        ),
        form: '(으)면 안 되다',
        example: '찍으면 안 돼요 · 가면 안 돼요',
      },
    ],
    conjugationTable: {
      forms: ['permission', 'prohibition'],
      verbs: ['먹다', '쓰다', '찍다', '가다', '살다'],
    },
    examples: [
      example(
        '창문을 열어도 돼요?',
        'Posso abrir a janela?',
        'May I open the window?',
      ),
      example(
        '박물관에서 사진을 찍으면 안 돼요.',
        'Não pode tirar foto no museu.',
        "You can't take pictures in the museum.",
      ),
      example(
        '내일은 안 와도 돼요.',
        'Amanhã você não precisa vir.',
        "You don't have to come tomorrow.",
      ),
    ],
    mistakes: [
      L(
        'Para dizer "não precisa", negue o verbo antes de 도: 안 가도 돼요 (não precisa ir).',
        'For "you don\'t have to", negate the verb before 도: 안 가도 돼요 (you don\'t need to go).',
      ),
    ],
    exercises: [
      {
        prompt: '이 펜을 ___? (쓰다)',
        choices: ['써도 돼요', '쓰어도 돼요', '쓰도 돼요'],
        answer: 0,
        translation: L('Posso usar esta caneta?', 'May I use this pen?'),
        check: { kind: 'form', verb: '쓰다', form: 'permission' },
      },
      {
        prompt: '여기에서 사진을 ___. (찍다)',
        choices: ['찍으면 안 돼요', '찍면 안 돼요', '찍어면 안 돼요'],
        answer: 0,
        translation: L(
          'Não pode tirar foto aqui.',
          "You can't take pictures here.",
        ),
        check: { kind: 'form', verb: '찍다', form: 'prohibition' },
      },
      {
        prompt: '배고프면 먼저 ___. (먹다)',
        choices: ['먹어도 돼요', '먹아도 돼요', '먹도 돼요'],
        answer: 0,
        translation: L(
          'Se estiver com fome, pode comer primeiro.',
          "If you're hungry, you can eat first.",
        ),
        check: { kind: 'form', verb: '먹다', form: 'permission' },
      },
    ],
  },
  {
    id: 'background-neunde',
    level: 2,
    pattern: '-는데 / -(으)ㄴ데',
    title: L(
      'Contexto e contraste: -는데, -(으)ㄴ데',
      'Background and contrast: -는데, -(으)ㄴ데',
    ),
    summary: L(
      'Dê o contexto antes de pedir, sugerir ou contrastar.',
      'Set the scene before a request, a suggestion or a contrast.',
    ),
    explanation: [
      L(
        'Um dos conectivos mais usados na fala. A primeira parte dá o contexto e a segunda reage: "está chovendo; (por isso) leve guarda-chuva", "estou com fome; vamos comer?". Também pode contrastar: "é caro, mas é gostoso".',
        'One of the most common connectives in speech. The first part sets the scene and the second reacts: "it\'s raining, (so) take an umbrella", "I\'m hungry, shall we eat?". It can also contrast: "it\'s pricey, but tasty".',
      ),
      L(
        'Verbos (e 있다/없다) levam -는데: 가는데, 맛있는데. Adjetivos levam -(으)ㄴ데: 바쁜데, 추운데. No passado: -았/었는데 para os dois (갔는데, 추웠는데).',
        'Verbs (and 있다/없다) take -는데: 가는데, 맛있는데. Adjectives take -(으)ㄴ데: 바쁜데, 추운데. In the past, both take -았/었는데 (갔는데, 추웠는데).',
      ),
    ],
    formation: [
      {
        when: L('Verbos e 있다/없다', 'Verbs and 있다/없다'),
        form: '는데',
        example: '가는데 · 사는데 · 맛있는데',
      },
      {
        when: L('Adjetivos', 'Adjectives'),
        form: '(으)ㄴ데',
        example: '바쁜데 · 추운데 · 작은데',
      },
      {
        when: L('Passado (todos)', 'Past (all)'),
        form: '았/었는데',
        example: '갔는데 · 추웠는데',
      },
    ],
    conjugationTable: {
      forms: ['background', 'background.past'],
      verbs: ['가다', '살다', '있다', '바쁘다', '춥다'],
    },
    examples: [
      example(
        '비가 오는데 우산 있어요?',
        'Está chovendo; você tem guarda-chuva?',
        "It's raining; do you have an umbrella?",
      ),
      example(
        '배고픈데 밥 먹으러 갈까요?',
        'Estou com fome; vamos comer?',
        "I'm hungry; shall we go eat?",
      ),
      example(
        '이 식당은 비싼데 맛있어요.',
        'Este restaurante é caro, mas é gostoso.',
        'This restaurant is pricey, but tasty.',
      ),
    ],
    mistakes: [
      L(
        'Adjetivo não leva 는: é 바쁜데, não 바쁘는데. Exceção: palavras com 있다/없다 (맛있는데, 재미없는데).',
        'Adjectives do not take 는: 바쁜데, not 바쁘는데. Exception: words ending in 있다/없다 (맛있는데, 재미없는데).',
      ),
      L(
        'Não traduza sempre como "mas": muitas vezes é só contexto, como uma vírgula ou "é que…".',
        'Do not always translate it as "but": often it just sets context, like a comma or "so, …".',
      ),
    ],
    exercises: [
      {
        prompt: '지금 ___ 내일 전화할게요. (바쁘다)',
        choices: ['바쁜데', '바쁘는데', '바빠는데'],
        answer: 0,
        translation: L(
          'Agora estou ocupado(a); te ligo amanhã.',
          "I'm busy now; I'll call you tomorrow.",
        ),
        check: { kind: 'form', verb: '바쁘다', form: 'background' },
      },
      {
        prompt: '저는 서울에 ___ 부산에 자주 가요. (살다)',
        choices: ['사는데', '살는데', '산데'],
        answer: 0,
        translation: L(
          'Eu moro em Seul, mas vou muito a Busan.',
          'I live in Seoul, but I often go to Busan.',
        ),
        check: { kind: 'form', verb: '살다', form: 'background' },
      },
      {
        prompt: '어제는 ___ 오늘은 따뜻해요. (춥다)',
        choices: ['추웠는데', '추운데', '춥었는데'],
        answer: 0,
        translation: L(
          'Ontem estava frio, mas hoje está quente.',
          'It was cold yesterday, but today it is warm.',
        ),
        check: { kind: 'form', verb: '춥다', form: 'background.past' },
      },
    ],
  },
  {
    id: 'when-eul-ttae',
    level: 2,
    pattern: '-(으)ㄹ 때',
    title: L('Quando: -(으)ㄹ 때', 'When: -(으)ㄹ 때'),
    summary: L(
      'Fale do momento em que algo acontece.',
      'Talk about the time something happens.',
    ),
    explanation: [
      L(
        '때 é "momento, hora". -(으)ㄹ 때 transforma o verbo em "quando…": 밥을 먹을 때 ("quando como"). Com substantivos, use só 때: 방학 때 ("nas férias").',
        '때 means "time, moment". -(으)ㄹ 때 turns a verb into "when …": 밥을 먹을 때 ("when I eat"). With nouns, just add 때: 방학 때 ("during vacation").',
      ),
      L(
        'Para algo já concluído, -았/었을 때: 한국에 갔을 때 ("quando fui à Coreia").',
        'For something completed, use -았/었을 때: 한국에 갔을 때 ("when I went to Korea").',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal ou ㄹ', 'After a vowel or ㄹ'),
        form: 'ㄹ 때',
        example: '갈 때 · 살 때',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '을 때',
        example: '먹을 때 · 추울 때',
      },
    ],
    conjugationTable: {
      forms: ['when'],
      verbs: ['가다', '먹다', '살다', '춥다', '듣다'],
    },
    examples: [
      example(
        '심심할 때 음악을 들어요.',
        'Quando estou entediado(a), ouço música.',
        "When I'm bored, I listen to music.",
      ),
      example(
        '한국에 갔을 때 김치를 처음 먹었어요.',
        'Quando fui à Coreia, comi kimchi pela primeira vez.',
        'When I went to Korea, I ate kimchi for the first time.',
      ),
      example(
        '추울 때는 따뜻한 차가 좋아요.',
        'Quando está frio, um chá quente é bom.',
        "When it's cold, hot tea is nice.",
      ),
    ],
    mistakes: [
      L(
        'Com substantivos não use 을: 방학 때, não 방학을 때.',
        'Do not use 을 with nouns: 방학 때, not 방학을 때.',
      ),
    ],
    exercises: [
      {
        prompt: '밥을 ___ 텔레비전을 봐요. (먹다)',
        choices: ['먹을 때', '먹 때', '먹는 때'],
        answer: 0,
        translation: L('Quando como, vejo TV.', 'I watch TV when I eat.'),
        check: { kind: 'form', verb: '먹다', form: 'when' },
      },
      {
        prompt: '___ 코트를 입으세요. (춥다)',
        choices: ['추울 때', '춥을 때', '추운 때'],
        answer: 0,
        translation: L(
          'Quando estiver frio, use casaco.',
          "Wear a coat when it's cold.",
        ),
        check: { kind: 'form', verb: '춥다', form: 'when' },
      },
      {
        prompt: '학교에 ___ 버스를 타요. (가다)',
        choices: ['갈 때', '가을 때', '간 때'],
        answer: 0,
        translation: L(
          'Quando vou à escola, pego ônibus.',
          'I take the bus when I go to school.',
        ),
        check: { kind: 'form', verb: '가다', form: 'when' },
      },
    ],
  },
  {
    id: 'intention-ryeogo',
    level: 2,
    pattern: '-(으)려고 하다',
    title: L('Pretender: -(으)려고 하다', 'Intend to: -(으)려고 하다'),
    summary: L(
      'Planos e intenções: "estou pensando em viajar".',
      'Plans and intentions: "I\'m planning to travel".',
    ),
    explanation: [
      L(
        'Mostra a intenção de quem fala: 주말에 영화를 보려고 해요 ("pretendo ver um filme no fim de semana"). É mais suave e pessoal que -(으)ㄹ 거예요.',
        'It expresses the speaker\'s intention: 주말에 영화를 보려고 해요 ("I\'m planning to watch a movie this weekend"). It sounds softer and more personal than -(으)ㄹ 거예요.',
      ),
      L(
        'Sem 하다, -(으)려고 liga duas frases com o sentido de "para…": 한국어를 배우려고 한국에 왔어요 ("vim à Coreia para aprender coreano").',
        'Without 하다, -(으)려고 links two clauses meaning "in order to": 한국어를 배우려고 한국에 왔어요 ("I came to Korea to learn Korean").',
      ),
    ],
    formation: [
      {
        when: L('Depois de vogal ou ㄹ', 'After a vowel or ㄹ'),
        form: '려고 하다',
        example: '가려고 해요 · 만들려고 해요',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '으려고 하다',
        example: '먹으려고 해요 · 들으려고 해요',
      },
    ],
    conjugationTable: {
      forms: ['intention'],
      verbs: ['가다', '먹다', '만들다', '듣다', '배우다'],
    },
    examples: [
      example(
        '내년에 한국에 가려고 해요.',
        'Pretendo ir à Coreia no ano que vem.',
        "I'm planning to go to Korea next year.",
      ),
      example(
        '오늘은 집에서 쉬려고 해요.',
        'Hoje pretendo descansar em casa.',
        'Today I intend to rest at home.',
      ),
      example(
        '선물을 사려고 백화점에 갔어요.',
        'Fui à loja de departamentos para comprar um presente.',
        'I went to the department store to buy a present.',
      ),
    ],
    mistakes: [
      L(
        'Com radical em ㄹ não entra 으: 만들려고, não 만들으려고.',
        'With ㄹ stems there is no 으: 만들려고, not 만들으려고.',
      ),
      L(
        'Só com verbos de ação: não diga 예쁘려고 해요.',
        'Only with action verbs: you cannot say 예쁘려고 해요.',
      ),
    ],
    exercises: [
      {
        prompt: '저녁에 불고기를 ___. (만들다)',
        choices: ['만들려고 해요', '만들으려고 해요', '만드려고 해요'],
        answer: 0,
        translation: L(
          'À noite pretendo fazer bulgogi.',
          "I'm planning to make bulgogi tonight.",
        ),
        check: { kind: 'form', verb: '만들다', form: 'intention' },
      },
      {
        prompt: '점심을 일찍 ___. (먹다)',
        choices: ['먹으려고 해요', '먹려고 해요', '먹어려고 해요'],
        answer: 0,
        translation: L(
          'Pretendo almoçar cedo.',
          "I'm going to have lunch early.",
        ),
        check: { kind: 'form', verb: '먹다', form: 'intention' },
      },
      {
        prompt: '이 노래를 매일 ___. (듣다)',
        choices: ['들으려고 해요', '듣으려고 해요', '들려고 해요'],
        answer: 0,
        translation: L(
          'Pretendo ouvir esta música todo dia.',
          'I intend to listen to this song every day.',
        ),
        check: { kind: 'form', verb: '듣다', form: 'intention' },
      },
    ],
  },
  {
    id: 'experience-eun-jeok',
    level: 2,
    pattern: '-(으)ㄴ 적이 있다/없다',
    title: L(
      'Já fiz / nunca fiz: -(으)ㄴ 적이 있다',
      'Have you ever…?: -(으)ㄴ 적이 있다',
    ),
    summary: L(
      'Fale de experiências: "já comi", "nunca fui".',
      'Talk about experiences: "I\'ve eaten it", "I\'ve never been".',
    ),
    explanation: [
      L(
        '적 é "ocasião". -(으)ㄴ 적이 있다 = "existe uma ocasião em que fiz" → "já fiz". Com 없다: "nunca fiz".',
        '적 means "occasion". -(으)ㄴ 적이 있다 = "there is an occasion when I did it" → "I have done it". With 없다: "I have never done it".',
      ),
      L(
        'É muito comum com -아/어 보다: 가 본 적이 있어요 ("já experimentei ir, já estive lá").',
        'It is very often combined with -아/어 보다: 가 본 적이 있어요 ("I have been there").',
      ),
    ],
    formation: [
      {
        when: L(
          'Depois de vogal ou ㄹ (o ㄹ cai)',
          'After a vowel or ㄹ (ㄹ drops)',
        ),
        form: 'ㄴ 적이 있다',
        example: '간 적이 있어요 · 산 적이 있어요',
      },
      {
        when: L('Depois de consoante', 'After a consonant'),
        form: '은 적이 있다',
        example: '먹은 적이 있어요 · 들은 적이 있어요',
      },
    ],
    conjugationTable: {
      forms: ['experience'],
      verbs: ['가다', '먹다', '살다', '듣다', '보다'],
    },
    examples: [
      example(
        '한국 음식을 먹은 적이 있어요?',
        'Você já comeu comida coreana?',
        'Have you ever eaten Korean food?',
      ),
      example(
        '저는 제주도에 가 본 적이 없어요.',
        'Eu nunca fui à ilha de Jeju.',
        "I've never been to Jeju Island.",
      ),
      example(
        '그 노래를 들은 적이 있어요.',
        'Já ouvi essa música.',
        "I've heard that song before.",
      ),
    ],
    mistakes: [
      L(
        'Não use para hábitos de rotina: "já tomei café hoje" é só 커피를 마셨어요. A estrutura é para experiências na vida.',
        'Not for routine actions: "I had coffee this morning" is just 커피를 마셨어요. This pattern is for life experiences.',
      ),
      L(
        'Radical em ㄹ perde o ㄹ: 살다 → 산 적, não 살은 적.',
        'ㄹ stems drop the ㄹ: 살다 → 산 적, not 살은 적.',
      ),
    ],
    exercises: [
      {
        prompt: '외국에서 ___? (살다)',
        choices: ['산 적이 있어요', '살은 적이 있어요', '살 적이 있어요'],
        answer: 0,
        translation: L(
          'Você já morou no exterior?',
          'Have you ever lived abroad?',
        ),
        check: { kind: 'form', verb: '살다', form: 'experience' },
      },
      {
        prompt: '그 영화를 두 번 ___. (보다)',
        choices: ['본 적이 있어요', '보은 적이 있어요', '볼 적이 있어요'],
        answer: 0,
        translation: L(
          'Já vi esse filme duas vezes.',
          "I've seen that movie twice.",
        ),
        check: { kind: 'form', verb: '보다', form: 'experience' },
      },
      {
        prompt: '번데기를 ___? (먹다)',
        choices: ['먹은 적이 있어요', '먹는 적이 있어요', '먹ㄴ 적이 있어요'],
        answer: 0,
        translation: L(
          'Você já comeu beondegi (larva de bicho-da-seda)?',
          'Have you ever eaten beondegi (silkworm pupae)?',
        ),
        check: { kind: 'form', verb: '먹다', form: 'experience' },
      },
    ],
  },
  {
    id: 'try-a-boda',
    level: 2,
    pattern: '-아/어 보다',
    title: L('Experimentar: -아/어 보다', 'Try doing: -아/어 보다'),
    summary: L(
      'Experimente fazer algo: "prova esse!", "veste para ver".',
      'Try something out: "taste this!", "try it on".',
    ),
    explanation: [
      L(
        '보다 ("ver") depois da forma -아/어 significa "fazer para ver como é": 먹어 보세요 ("prove"), 입어 봐도 돼요? ("posso experimentar?").',
        '보다 ("see") after the -아/어 form means "do it and see": 먹어 보세요 ("give it a try"), 입어 봐도 돼요? ("may I try it on?").',
      ),
      L(
        'No passado vira experiência: 가 봤어요 = "já estive lá".',
        'In the past it expresses experience: 가 봤어요 = "I\'ve been there".',
      ),
    ],
    formation: [
      {
        when: L('Forma -아/어 + 보다', '-아/어 form + 보다'),
        form: '아/어 보다',
        example: '입어 봐요 · 해 봐요 · 가 봐요',
      },
    ],
    conjugationTable: {
      forms: ['try'],
      verbs: ['입다', '하다', '가다', '먹다', '듣다'],
    },
    examples: [
      example(
        '이 떡볶이 한번 먹어 보세요.',
        'Experimente este tteokbokki.',
        'Try this tteokbokki.',
      ),
      example(
        '이 옷 입어 봐도 돼요?',
        'Posso experimentar esta roupa?',
        'May I try these clothes on?',
      ),
      example(
        '부산에 가 봤어요?',
        'Você já foi a Busan?',
        'Have you been to Busan?',
      ),
    ],
    mistakes: [
      L(
        'Não é "olhar": 먹어 봐요 não quer dizer "olhe e coma", e sim "experimente comer".',
        'It is not about looking: 먹어 봐요 means "try eating it", not "look and eat".',
      ),
    ],
    exercises: [
      {
        prompt: '이 신발을 한번 ___. (신다)',
        choices: ['신어 봐요', '신아 봐요', '신 봐요'],
        answer: 0,
        translation: L('Experimente estes sapatos.', 'Try these shoes on.'),
        check: { kind: 'form', verb: '신다', form: 'try' },
      },
      {
        prompt: '케이블카를 한번 ___. (타다)',
        choices: ['타 봐요', '타아 봐요', '탈 봐요'],
        answer: 0,
        translation: L(
          'Experimente andar de teleférico.',
          'Give the cable car a try.',
        ),
        check: { kind: 'form', verb: '타다', form: 'try' },
      },
      {
        prompt: '한국 노래를 ___. (듣다)',
        choices: ['들어 봐요', '듣어 봐요', '들 봐요'],
        answer: 0,
        translation: L(
          'Experimente ouvir música coreana.',
          'Try listening to Korean songs.',
        ),
        check: { kind: 'form', verb: '듣다', form: 'try' },
      },
    ],
  },
  {
    id: 'reason-gi-ttaemune',
    level: 3,
    pattern: '-기 때문에',
    title: L('Porque: -기 때문에', 'Because: -기 때문에'),
    summary: L(
      'Um "porque" mais formal e enfático, comum na escrita.',
      'A more formal, emphatic "because", common in writing.',
    ),
    explanation: [
      L(
        'Junte 기 때문에 direto ao radical, sem mudanças: 아프기 때문에, 먹기 때문에. No passado: -았/었기 때문에 (늦었기 때문에).',
        'Add 기 때문에 straight to the stem, with no changes: 아프기 때문에, 먹기 때문에. In the past: -았/었기 때문에 (늦었기 때문에).',
      ),
      L(
        'Diferente de -(으)니까, não pode ser seguido de pedido ou convite: diga 비가 오니까 우산을 가져가세요, não …오기 때문에 가져가세요. Com substantivo: 때문에 sozinho (비 때문에 = "por causa da chuva").',
        'Unlike -(으)니까, it cannot be followed by a request or suggestion: say 비가 오니까 우산을 가져가세요, not …오기 때문에 가져가세요. After a noun, just 때문에 (비 때문에 = "because of the rain").',
      ),
    ],
    formation: [
      {
        when: L('Qualquer radical', 'Any stem'),
        form: '기 때문에',
        example: '아프기 때문에 · 먹기 때문에',
      },
      {
        when: L('Substantivo', 'Noun'),
        form: '때문에',
        example: '비 때문에 · 시험 때문에',
      },
    ],
    conjugationTable: {
      forms: ['reason.ttaemun'],
      verbs: ['아프다', '먹다', '바쁘다', '있다', '공부하다'],
    },
    examples: [
      example(
        '감기에 걸렸기 때문에 학교에 못 갔어요.',
        'Como peguei um resfriado, não pude ir à escola.',
        "Because I caught a cold, I couldn't go to school.",
      ),
      example(
        '이 식당은 싸기 때문에 학생이 많아요.',
        'Como este restaurante é barato, tem muitos estudantes.',
        'This restaurant is cheap, so there are many students.',
      ),
      example(
        '눈 때문에 비행기가 늦게 출발했어요.',
        'Por causa da neve, o avião saiu atrasado.',
        'Because of the snow, the plane left late.',
      ),
    ],
    mistakes: [
      L(
        'Não use antes de pedido ou convite (…때문에 가세요 ✗). Para isso, -(으)니까.',
        'Do not use it before a request or suggestion (…때문에 가세요 ✗). Use -(으)니까 instead.',
      ),
      L(
        'Substantivo + 이기 때문에 quer dizer "porque é…": 학생이기 때문에 ("porque sou estudante"); 학생 때문에 é "por causa do estudante".',
        'Noun + 이기 때문에 means "because (it) is …": 학생이기 때문에 ("because I\'m a student"); 학생 때문에 means "because of the student".',
      ),
    ],
    exercises: [
      {
        prompt: '머리가 ___ 일찍 잤어요. (아프다)',
        choices: ['아프기 때문에', '아파기 때문에', '아픈 때문에'],
        answer: 0,
        translation: L(
          'Como estava com dor de cabeça, dormi cedo.',
          'I had a headache, so I went to bed early.',
        ),
        check: { kind: 'form', verb: '아프다', form: 'reason.ttaemun' },
      },
      {
        prompt: '요즘 일이 ___ 운동을 못 해요. (많다)',
        choices: ['많기 때문에', '많아기 때문에', '많은 때문에'],
        answer: 0,
        translation: L(
          'Como tenho muito trabalho ultimamente, não consigo me exercitar.',
          "I have a lot of work these days, so I can't exercise.",
        ),
        check: { kind: 'form', verb: '많다', form: 'reason.ttaemun' },
      },
      {
        prompt: '시험이 ___ 도서관에 가요. (있다)',
        choices: ['있기 때문에', '있어기 때문에', '있는 때문에'],
        answer: 0,
        translation: L(
          'Como tenho prova, vou à biblioteca.',
          "I have an exam, so I'm going to the library.",
        ),
        check: { kind: 'form', verb: '있다', form: 'reason.ttaemun' },
      },
    ],
  },
  {
    id: 'become-ge-doeda',
    level: 3,
    pattern: '-게 되다',
    title: L('Acabar / passar a: -게 되다', 'End up / come to: -게 되다'),
    summary: L(
      'Mudanças que acontecem sem ser por escolha direta.',
      'Changes that happen rather than being directly chosen.',
    ),
    explanation: [
      L(
        'Junte 게 되다 ao radical: 가게 되다. Indica que uma situação levou a algo: 회사 때문에 서울에 살게 됐어요 ("por causa da empresa, acabei morando em Seul").',
        'Add 게 되다 to the stem: 가게 되다. It shows that circumstances led to something: 회사 때문에 서울에 살게 됐어요 ("because of work, I ended up living in Seoul").',
      ),
      L(
        'Também expressa mudança gradual: 김치를 좋아하게 됐어요 ("passei a gostar de kimchi"). Em geral aparece no passado: -게 됐어요.',
        'It also shows gradual change: 김치를 좋아하게 됐어요 ("I came to like kimchi"). It usually appears in the past: -게 됐어요.',
      ),
    ],
    formation: [
      {
        when: L('Radical do verbo', 'Verb stem'),
        form: '게 되다',
        example: '가게 돼요 · 알게 됐어요',
      },
    ],
    conjugationTable: {
      forms: ['become'],
      verbs: ['가다', '알다', '먹다', '좋아하다', '살다'],
    },
    examples: [
      example(
        '친구 덕분에 한국 드라마를 좋아하게 됐어요.',
        'Graças a um amigo, passei a gostar de dramas coreanos.',
        'Thanks to a friend, I came to like Korean dramas.',
      ),
      example(
        '다음 달부터 부산에서 일하게 돼요.',
        'A partir do mês que vem, vou trabalhar em Busan.',
        "Starting next month, I'll be working in Busan.",
      ),
      example(
        '그 사람을 어떻게 알게 됐어요?',
        'Como você conheceu essa pessoa?',
        'How did you get to know that person?',
      ),
    ],
    mistakes: [
      L(
        'Não confunda com -아/어지다 (com adjetivos: 예뻐졌어요 = "ficou bonita"). -게 되다 vai com verbos.',
        'Do not confuse it with -아/어지다 (used with adjectives: 예뻐졌어요 = "became pretty"). -게 되다 goes with verbs.',
      ),
    ],
    exercises: [
      {
        prompt: '회사 일 때문에 일본에 ___. (가다)',
        choices: ['가게 돼요', '가게 되요', '가기 돼요'],
        answer: 0,
        translation: L(
          'Por causa do trabalho, vou ter que ir ao Japão.',
          "Because of work, I'll be going to Japan.",
        ),
        check: { kind: 'form', verb: '가다', form: 'become' },
      },
      {
        prompt: '요즘 매운 음식을 잘 ___. (먹다)',
        choices: ['먹게 돼요', '먹기 돼요', '먹어게 돼요'],
        answer: 0,
        translation: L(
          'Ultimamente passei a comer bem comida apimentada.',
          "These days I've come to eat spicy food well.",
        ),
        check: { kind: 'form', verb: '먹다', form: 'become' },
      },
      {
        prompt: '이 일을 하면서 많은 것을 ___. (알다)',
        choices: ['알게 돼요', '아게 돼요', '알기 돼요'],
        answer: 0,
        translation: L(
          'Fazendo este trabalho, a gente aprende muita coisa.',
          'Doing this work, you come to learn a lot.',
        ),
        check: { kind: 'form', verb: '알다', form: 'become' },
      },
    ],
  },
  {
    id: 'passive-voice',
    level: 3,
    pattern: '-이/히/리/기-',
    title: L('Voz passiva (피동)', 'Passive voice (피동)'),
    summary: L(
      '"A porta se abriu", "a montanha é visível": verbos passivos.',
      '"The door opened", "the mountain can be seen": passive verbs.',
    ),
    explanation: [
      L(
        'Muitos verbos têm uma forma passiva com 이, 히, 리 ou 기 no radical: 보다 → 보이다, 닫다 → 닫히다, 열다 → 열리다, 안다 → 안기다. Não há regra para saber qual sufixo: aprenda como vocabulário.',
        'Many verbs have a passive form with 이, 히, 리 or 기 added to the stem: 보다 → 보이다, 닫다 → 닫히다, 열다 → 열리다, 안다 → 안기다. No rule tells you which suffix: learn them as vocabulary.',
      ),
      L(
        'O sujeito passa a ser quem sofre a ação, com 이/가: 문이 열렸어요 ("a porta se abriu"). Quem faz a ação, se aparecer, vem com 에게: 고양이가 개에게 쫓겼어요.',
        'The subject is what undergoes the action, marked with 이/가: 문이 열렸어요 ("the door opened"). The doer, if mentioned, takes 에게: 고양이가 개에게 쫓겼어요.',
      ),
      L(
        'Para verbos sem forma própria, usa-se -아/어지다 (만들어지다 "ser feito") ou 받다/되다 com substantivos (사랑받다, 사용되다).',
        'Verbs without their own passive use -아/어지다 (만들어지다 "be made") or, with nouns, 받다/되다 (사랑받다, 사용되다).',
      ),
    ],
    formation: [
      {
        when: L('이', '이'),
        form: '보이다 · 쓰이다 · 놓이다',
        example: '산이 보여요',
      },
      {
        when: L('히', '히'),
        form: '닫히다 · 잡히다 · 먹히다',
        example: '문이 닫혔어요',
      },
      {
        when: L('리', '리'),
        form: '열리다 · 들리다 · 팔리다',
        example: '소리가 들려요',
      },
      {
        when: L('기', '기'),
        form: '안기다',
        example: '아기가 엄마에게 안겼어요',
      },
    ],
    examples: [
      example(
        '창문으로 남산타워가 보여요.',
        'Dá para ver a Torre Namsan pela janela.',
        'You can see Namsan Tower from the window.',
      ),
      example(
        '바람 때문에 문이 열렸어요.',
        'A porta se abriu por causa do vento.',
        'The door opened because of the wind.',
      ),
      example(
        '이 책은 많이 팔렸어요.',
        'Este livro vendeu muito.',
        'This book sold a lot.',
      ),
    ],
    mistakes: [
      L(
        'Em português usamos "se" ("abriu-se", "vende-se") ou "ser + particípio"; em coreano o próprio verbo muda: 열리다, 팔리다.',
        'Do not build passives with an auxiliary like English "be + -ed": Korean changes the verb itself (열리다, 팔리다).',
      ),
      L(
        'Alguns passivos e causativos são iguais: 보이다 é "ser visto" e também "mostrar". O contexto (partícula 을/를 ou não) decide.',
        'Some passive and causative forms coincide: 보이다 means both "be seen" and "show". Context (whether there is an object with 을/를) decides.',
      ),
    ],
    exercises: [
      {
        prompt: '밖에서 이상한 소리가 ___. (듣다 → passivo)',
        choices: ['들려요', '들어요', '듣겨요'],
        answer: 0,
        translation: L(
          'Ouve-se um barulho estranho lá fora.',
          'A strange noise can be heard outside.',
        ),
        check: { kind: 'form', verb: '들리다', form: 'present.polite' },
      },
      {
        prompt: '은행 문이 벌써 ___. (닫다 → passivo, passado)',
        choices: ['닫혔어요', '닫았어요', '닫겼어요'],
        answer: 0,
        translation: L(
          'A porta do banco já está fechada.',
          'The bank is already closed.',
        ),
        check: { kind: 'form', verb: '닫히다', form: 'past.polite' },
      },
      {
        prompt: '도둑이 경찰에게 ___. (잡다 → passivo, passado)',
        choices: ['잡혔어요', '잡았어요', '잡렸어요'],
        answer: 0,
        translation: L(
          'O ladrão foi pego pela polícia.',
          'The thief was caught by the police.',
        ),
        check: { kind: 'form', verb: '잡히다', form: 'past.polite' },
      },
    ],
  },
  {
    id: 'causative-voice',
    level: 3,
    pattern: '-이/히/리/기/우-',
    title: L('Voz causativa (사동)', 'Causative voice (사동)'),
    summary: L(
      '"Dar de comer", "fazer chorar", "vestir alguém".',
      '"Feed", "make someone cry", "dress someone".',
    ),
    explanation: [
      L(
        'A forma causativa significa "fazer alguém fazer": 먹다 → 먹이다 ("dar de comer"), 입다 → 입히다 ("vestir alguém"), 울다 → 울리다 ("fazer chorar"), 웃다 → 웃기다 ("fazer rir"), 자다 → 재우다 ("pôr para dormir").',
        'The causative means "make someone do": 먹다 → 먹이다 ("feed"), 입다 → 입히다 ("dress someone"), 울다 → 울리다 ("make cry"), 웃다 → 웃기다 ("make laugh"), 자다 → 재우다 ("put to sleep").',
      ),
      L(
        'Como no passivo, o sufixo é lexical: aprenda cada verbo. Para os outros, use -게 하다: 동생을 공부하게 했어요 ("fiz meu irmão estudar").',
        'As with the passive, the suffix is lexical: learn each verb. For other verbs, use -게 하다: 동생을 공부하게 했어요 ("I made my sibling study").',
      ),
    ],
    formation: [
      {
        when: L('이', '이'),
        form: '먹이다 · 보이다',
        example: '아기에게 우유를 먹여요',
      },
      {
        when: L('히', '히'),
        form: '입히다 · 읽히다 · 앉히다',
        example: '아이에게 옷을 입혀요',
      },
      {
        when: L('리', '리'),
        form: '울리다 · 알리다',
        example: '친구를 울렸어요',
      },
      {
        when: L('기', '기'),
        form: '웃기다 · 신기다',
        example: '그 사람은 정말 웃겨요',
      },
      { when: L('우', '우'), form: '재우다', example: '아기를 재웠어요' },
    ],
    examples: [
      example(
        '엄마가 아기에게 밥을 먹여요.',
        'A mãe dá comida para o bebê.',
        'The mother feeds the baby.',
      ),
      example(
        '그 영화는 사람들을 많이 울렸어요.',
        'Esse filme fez muita gente chorar.',
        'That movie made a lot of people cry.',
      ),
      example(
        '결과를 이메일로 알려 주세요.',
        'Por favor, me informe o resultado por e-mail.',
        'Please let me know the results by email.',
      ),
    ],
    mistakes: [
      L(
        '웃기다 virou também adjetivo de uso diário: 이 영상 진짜 웃겨요 = "este vídeo é muito engraçado".',
        '웃기다 is also an everyday adjective: 이 영상 진짜 웃겨요 = "this video is really funny".',
      ),
      L(
        'Quem é levado a agir costuma vir com 에게 (ou 을/를): 아이에게 밥을 먹여요.',
        'The person made to act usually takes 에게 (or 을/를): 아이에게 밥을 먹여요.',
      ),
    ],
    exercises: [
      {
        prompt: '아빠가 아이에게 옷을 ___. (입다 → causativo)',
        choices: ['입혀요', '입어요', '입겨요'],
        answer: 0,
        translation: L(
          'O pai veste a criança.',
          'The father dresses the child.',
        ),
        check: { kind: 'form', verb: '입히다', form: 'present.polite' },
      },
      {
        prompt: '엄마가 아기를 ___. (자다 → causativo, passado)',
        choices: ['재웠어요', '잤어요', '자게웠어요'],
        answer: 0,
        translation: L(
          'A mãe pôs o bebê para dormir.',
          'The mother put the baby to sleep.',
        ),
        check: { kind: 'form', verb: '재우다', form: 'past.polite' },
      },
      {
        prompt: '시험 결과를 ___ 주세요. (알다 → causativo)',
        choices: ['알려', '알아', '알게'],
        answer: 0,
        translation: L(
          'Por favor, me informe o resultado da prova.',
          'Please let me know the exam results.',
        ),
        check: { kind: 'form', verb: '알리다', form: 'present.casual' },
      },
    ],
  },
]
