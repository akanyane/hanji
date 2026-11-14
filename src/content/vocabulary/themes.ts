import type { Localized } from '../../i18n/locales'
import type { PartOfSpeech, ThemeId } from './types'

export const THEMES: Record<
  ThemeId,
  {
    label: Localized /** Korean word for the theme, shown as a small label. */
    icon: string
  }
> = {
  greetings: {
    label: { 'pt-BR': 'Cumprimentos', en: 'Greetings' },
    icon: '인사',
  },
  people: {
    label: { 'pt-BR': 'Pessoas e família', en: 'People and family' },
    icon: '사람',
  },
  food: {
    label: { 'pt-BR': 'Comida e bebida', en: 'Food and drink' },
    icon: '음식',
  },
  places: { label: { 'pt-BR': 'Lugares', en: 'Places' }, icon: '장소' },
  transport: {
    label: { 'pt-BR': 'Transporte', en: 'Transport' },
    icon: '교통',
  },
  time: {
    label: { 'pt-BR': 'Tempo e datas', en: 'Time and dates' },
    icon: '시간',
  },
  home: {
    label: { 'pt-BR': 'Casa e objetos', en: 'Home and objects' },
    icon: '집',
  },
  school: { label: { 'pt-BR': 'Escola', en: 'School' }, icon: '학교' },
  work: { label: { 'pt-BR': 'Trabalho', en: 'Work' }, icon: '일' },
  body: {
    label: { 'pt-BR': 'Corpo e saúde', en: 'Body and health' },
    icon: '몸',
  },
  nature: {
    label: { 'pt-BR': 'Natureza e clima', en: 'Nature and weather' },
    icon: '자연',
  },
  shopping: {
    label: { 'pt-BR': 'Compras e dinheiro', en: 'Shopping and money' },
    icon: '쇼핑',
  },
  actions: {
    label: { 'pt-BR': 'Ações do dia a dia', en: 'Everyday actions' },
    icon: '동작',
  },
  descriptions: {
    label: { 'pt-BR': 'Descrições', en: 'Descriptions' },
    icon: '묘사',
  },
  questions: {
    label: { 'pt-BR': 'Perguntas e advérbios', en: 'Questions and adverbs' },
    icon: '질문',
  },
}

export const PARTS_OF_SPEECH: Record<PartOfSpeech, Localized> = {
  noun: { 'pt-BR': 'substantivo', en: 'noun' },
  pronoun: { 'pt-BR': 'pronome', en: 'pronoun' },
  verb: { 'pt-BR': 'verbo', en: 'verb' },
  adjective: { 'pt-BR': 'adjetivo', en: 'adjective' },
  adverb: { 'pt-BR': 'advérbio', en: 'adverb' },
  determiner: { 'pt-BR': 'determinante', en: 'determiner' },
  counter: { 'pt-BR': 'contador', en: 'counter' },
  expression: { 'pt-BR': 'expressão', en: 'expression' },
}
