import type { Messages } from './en'

// Brazilian Portuguese UI messages.
export const ptBR: Messages = {
  common: {
    appName: 'Aprenda Coreano',
    comingSoon: 'Em breve',
    silent: '(muda)',
    none: 'nenhum',
    examples: 'Exemplos',
    copy: 'Copiar',
    copied: 'Copiado!',
    result: 'Resultado',
    resultPlaceholder: 'O resultado aparece aqui.',
    previous: 'Anterior',
    next: 'Próximo',
    continue: 'Continuar',
  },
  nav: {
    main: 'Navegação principal',
    home: 'Início',
    hangul: 'Hangul',
    tools: 'Ferramentas',
    skipToContent: 'Pular para o conteúdo',
    homeLabel: 'Aprenda Coreano: página inicial',
    language: 'Idioma',
  },
  theme: {
    toLight: 'Mudar para o tema claro',
    toDark: 'Mudar para o tema escuro',
  },
  errors: {
    notFound: 'Página não encontrada.',
    backHome: 'Voltar ao início',
    generic: 'Algo deu errado.',
    tryAgain: 'Tentar de novo',
  },
  audio: {
    listen: 'Ouvir {{text}}',
    unsupported: 'Seu navegador não tem síntese de voz.',
    noKoreanVoice:
      'Nenhuma voz em coreano instalada: o navegador pode usar outra voz.',
  },
  home: {
    title: 'Aprenda coreano do zero',
    description:
      'Uma plataforma gratuita, do Hangul ao TOPIK II. Funciona no navegador e guarda seu progresso só no seu aparelho.',
    modules: {
      hangul: {
        title: 'Hangul',
        description:
          'Consoantes, vogais, batchim e os primeiros blocos silábicos.',
      },
      pronunciation: {
        title: 'Pronúncia',
        description:
          'Regras de mudança de som e a ferramenta "Como se pronuncia?".',
      },
      vocabulary: {
        title: 'Vocabulário',
        description: 'Palavras por nível TOPIK e tema, com repetição espaçada.',
      },
      grammar: {
        title: 'Gramática',
        description: 'Partículas, conjugação e conectivos, com o conjugador.',
      },
      listening: {
        title: 'Escuta',
        description:
          'Ditado e compreensão de diálogos com velocidade ajustável.',
      },
      speaking: {
        title: 'Fala',
        description: 'Repetição com reconhecimento de voz e modo shadowing.',
      },
      reading: {
        title: 'Leitura',
        description: 'Textos graduados com glossário clicável.',
      },
      writing: {
        title: 'Escrita e digitação',
        description: 'Teclado 두벌식, tradução e produção guiada.',
      },
      numbers: {
        title: 'Números e contadores',
        description:
          'Sino-coreanos, nativos, horas, datas, dinheiro e contadores.',
      },
      dialogues: {
        title: 'Diálogos',
        description: 'Situações reais: restaurante, metrô, compras, trabalho.',
      },
      culture: {
        title: 'Cultura',
        description: 'Formalidade, etiqueta, expressões comuns e gírias.',
      },
      progress: {
        title: 'Progresso',
        description:
          'Sequência de dias, XP, conquistas, nivelamento e simulados.',
      },
      tools: {
        title: 'Ferramentas',
        description:
          'Como se pronuncia?, conversor de romanização e decompositor de sílabas.',
      },
    },
  },
  hangul: {
    title: 'Hangul',
    description: 'O alfabeto coreano: toque num cartão para aprender a letra.',
    sections: 'Seções do Hangul',
    tabs: {
      browse: 'Explorar',
      builder: 'Construtor de sílabas',
      quiz: 'Quiz',
    },
    category: {
      all: 'Todas',
      vowel: 'Vogal',
      consonant: 'Consoante',
      final: 'Batchim (final)',
      syllable: 'Sílaba',
    },
    categoryLegend: 'Categoria',
    search: 'Buscar',
    searchPlaceholder: 'Buscar por hangul ou romanização...',
    results_one: '{{count}} resultado',
    results_other: '{{count}} resultados',
    noResults: 'Nenhum caractere corresponde à sua busca.',
    detail: {
      back: 'Todos os caracteres',
      strokeOrder: 'Ordem dos traços',
      strokes_one: '{{count}} traço',
      strokes_other: '{{count}} traços',
      replay: 'Repetir animação',
      origin: 'De onde vem a forma',
      howToSay: 'Como pronunciar',
      example: 'Exemplo',
      notes: 'Observações',
      practice: 'Pratique a escrita',
      composedOf: 'Formada por',
      openInBuilder: 'Abrir no construtor de sílabas',
      finalSound: 'No fim da sílaba, soa como {{sound}}.',
      strokeDiagram: 'Ordem dos traços de {{char}}',
    },
    builder: {
      description:
        'Escolha uma consoante inicial, uma vogal e, se quiser, um batchim para montar um bloco silábico.',
      initial: 'Consoante inicial',
      medial: 'Vogal',
      final: 'Batchim (opcional)',
      noFinal: 'Nenhum',
      random: 'Sílaba aleatória',
      pronunciation: 'Pronúncia',
      romanization: 'Romanização',
      layout: {
        vertical:
          'Vogal vertical: a consoante fica à esquerda e a vogal à direita.',
        horizontal:
          'Vogal horizontal: a consoante fica em cima e a vogal embaixo.',
        mixed:
          'Vogal composta: ela contorna a consoante, por baixo e pela direita.',
        final: 'O batchim (consoante final) sempre fica embaixo.',
      },
    },
    writing: {
      canvasLabel: 'Área de desenho para praticar {{char}}',
      clear: 'Limpar',
      check: 'Verificar',
      showGuide: 'Mostrar guia',
      hideGuide: 'Ocultar guia',
      empty: 'Desenhe a letra primeiro.',
      great: 'Ótimo! Muito parecido com o modelo.',
      close: 'Quase lá! Compare com o modelo e tente de novo.',
      retry: 'Tente de novo seguindo o traço-guia.',
      strokeCount: 'Você usou {{drawn}} traços; esta letra tem {{expected}}.',
      unsupported: 'Seu navegador não consegue desenhar aqui.',
    },
    quiz: {
      modes: 'Modo do quiz',
      recognize: {
        title: 'Reconhecer letras',
        description: 'Veja o caractere e escolha a romanização.',
      },
      listen: {
        title: 'Ouvir e escolher',
        description: 'Ouça o som e escolha o caractere.',
      },
      read: {
        title: 'Ler palavras',
        description: 'Leia palavras reais e escolha a romanização.',
      },
      listenUnsupported:
        'Seu navegador não tem síntese de voz, então este modo não está disponível.',
      summary: 'Melhor pontuação: {{best}} · Tentativas: {{attempts}}',
      start: 'Começar quiz',
      playAgain: 'Jogar de novo',
      notEnough: 'Não há caracteres suficientes nesta categoria para o quiz.',
      progress: 'Progresso do quiz',
      question: 'Questão {{current}} de {{total}} · Acertos: {{score}}',
      instructions:
        'Escolha a resposta correta. Use as teclas de 1 a {{count}}.',
      playSound: 'Ouvir o som de novo',
      correct: 'Correto!',
      incorrect: 'Quase. A resposta era {{answer}}.',
      meaning: 'Significado: {{meaning}}',
      finished: 'Você acertou {{score}} de {{total}}!',
      perfect: 'Pontuação perfeita!',
      good: 'Mandou bem! Continue praticando.',
      keepGoing: 'Continue: a prática leva à perfeição.',
      continueHint: 'Pressione Enter para continuar',
    },
  },
  tools: {
    title: 'Ferramentas',
    description:
      'Utilitários para consultar a qualquer momento. Tudo roda no seu navegador.',
    nav: 'Ferramentas',
    pronunciation: {
      title: 'Como se pronuncia?',
      description:
        'Digite uma palavra e veja a pronúncia real, com cada regra de mudança de som explicada.',
      inputLabel: 'Palavra ou frase em hangul',
      placeholder: 'Ex.: 국물',
      empty: 'Digite algo em hangul para ver como se pronuncia.',
      result: 'Pronúncia',
      noChanges:
        'Nenhuma mudança de som: aqui se pronuncia exatamente como se escreve.',
      steps: 'Passo a passo',
      rulesUsed: 'Regras usadas',
      example: 'Ex.:',
      limitationsTitle: 'O que a ferramenta não detecta',
      limitationsIntro:
        'As regras são aplicadas automaticamente a partir da escrita. Alguns casos dependem do significado da palavra e não são detectados:',
    },
    romanization: {
      title: 'Romanização',
      description:
        'Converta entre hangul e a Romanização Revisada oficial, nos dois sentidos.',
      direction: 'Direção da conversão',
      toLatin: 'Hangul → Latino',
      toHangul: 'Latino → Hangul',
      hangulLabel: 'Texto em hangul',
      latinLabel: 'Texto romanizado',
      hangulPlaceholder: 'Ex.: 안녕하세요',
      latinPlaceholder: 'Ex.: annyeonghaseyo',
      keepH:
        'É um substantivo: manter o h depois de ㄱ, ㄷ, ㅂ, como manda a regra oficial (묵호 → Mukho, em vez de Muko).',
      approximate:
        'A conversão é aproximada: a romanização representa a pronúncia, então "silla" vira 실라 (e não 신라). Use hífen para separar sílabas ambíguas: "jung-ang" → 중앙.',
      unrecognized: 'Não reconhecido como romanização: {{words}}',
    },
    decomposer: {
      title: 'Decompositor de sílabas',
      description:
        'Veja a consoante inicial, a vogal e o batchim de cada sílaba de um texto.',
      inputLabel: 'Texto em hangul',
      placeholder: 'Ex.: 한국어',
      hint: 'Mostra a consoante inicial, a vogal e o batchim de cada sílaba.',
      initial: 'Inicial',
      medial: 'Vogal',
      final: 'Batchim',
      consonant: 'Consoante',
      notHangul: 'Não é hangul.',
      truncated: 'Mostrando os primeiros {{shown}} de {{total}} caracteres.',
    },
  },
}
