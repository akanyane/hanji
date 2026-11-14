import type { LinkProps } from '@tanstack/react-router'

export interface PlatformModule {
  id: string
  title: string
  korean: string
  description: string
  /** Module route; absent while the module is not available yet. */
  to?: LinkProps['to']
}

// Platform module map. When a module ships, just fill in `to`.
export const PLATFORM_MODULES: PlatformModule[] = [
  {
    id: 'hangul',
    title: 'Hangul',
    korean: '한글',
    description: 'Consoantes, vogais, batchim e os primeiros blocos silábicos.',
    to: '/hangul',
  },
  {
    id: 'pronunciation',
    title: 'Pronúncia',
    korean: '발음',
    description:
      'Regras de mudança de som e a ferramenta "Como se pronuncia?".',
  },
  {
    id: 'vocabulary',
    title: 'Vocabulário',
    korean: '어휘',
    description: 'Palavras por nível TOPIK e tema, com repetição espaçada.',
  },
  {
    id: 'grammar',
    title: 'Gramática',
    korean: '문법',
    description: 'Partículas, conjugação e conectivos, com o conjugador.',
  },
  {
    id: 'listening',
    title: 'Escuta',
    korean: '듣기',
    description: 'Ditado e compreensão de diálogos com velocidade ajustável.',
  },
  {
    id: 'speaking',
    title: 'Fala',
    korean: '말하기',
    description: 'Repetição com reconhecimento de voz e modo shadowing.',
  },
  {
    id: 'reading',
    title: 'Leitura',
    korean: '읽기',
    description: 'Textos graduados com glossário clicável.',
  },
  {
    id: 'writing',
    title: 'Escrita e digitação',
    korean: '쓰기',
    description: 'Teclado 두벌식, tradução PT → KO e produção guiada.',
  },
  {
    id: 'numbers',
    title: 'Números e contadores',
    korean: '숫자',
    description: 'Sino-coreanos, nativos, horas, datas, dinheiro e contadores.',
  },
  {
    id: 'dialogues',
    title: 'Diálogos',
    korean: '대화',
    description: 'Situações reais: restaurante, metrô, compras, trabalho.',
  },
  {
    id: 'culture',
    title: 'Cultura',
    korean: '문화',
    description: 'Formalidade, etiqueta, expressões comuns e gírias.',
  },
  {
    id: 'progress',
    title: 'Progresso',
    korean: '진도',
    description: 'Sequência de dias, XP, conquistas, nivelamento e simulados.',
  },
  {
    id: 'tools',
    title: 'Ferramentas',
    korean: '도구',
    description: 'Dicionário, conversor de romanização e decompositor.',
  },
]
