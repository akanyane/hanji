import type { Localized } from '../../i18n/locales'
import type { PartOfSpeech, ThemeId } from './types'

export const THEMES: Record<ThemeId, { label: Localized; icon: string }> = {
  greetings: {
    label: { 'pt-BR': 'Cumprimentos', en: 'Greetings' },
    icon: '👋',
  },
  people: {
    label: { 'pt-BR': 'Pessoas e família', en: 'People and family' },
    icon: '👨‍👩‍👧',
  },
  food: {
    label: { 'pt-BR': 'Comida e bebida', en: 'Food and drink' },
    icon: '🍜',
  },
  places: { label: { 'pt-BR': 'Lugares', en: 'Places' }, icon: '🏙️' },
  transport: { label: { 'pt-BR': 'Transporte', en: 'Transport' }, icon: '🚇' },
  time: {
    label: { 'pt-BR': 'Tempo e datas', en: 'Time and dates' },
    icon: '⏰',
  },
  home: {
    label: { 'pt-BR': 'Casa e objetos', en: 'Home and objects' },
    icon: '🏠',
  },
  school: { label: { 'pt-BR': 'Escola', en: 'School' }, icon: '🎒' },
  work: { label: { 'pt-BR': 'Trabalho', en: 'Work' }, icon: '💼' },
  body: {
    label: { 'pt-BR': 'Corpo e saúde', en: 'Body and health' },
    icon: '🩺',
  },
  nature: {
    label: { 'pt-BR': 'Natureza e clima', en: 'Nature and weather' },
    icon: '🌸',
  },
  shopping: {
    label: { 'pt-BR': 'Compras e dinheiro', en: 'Shopping and money' },
    icon: '🛍️',
  },
  actions: {
    label: { 'pt-BR': 'Ações do dia a dia', en: 'Everyday actions' },
    icon: '🏃',
  },
  descriptions: {
    label: { 'pt-BR': 'Descrições', en: 'Descriptions' },
    icon: '🎨',
  },
  questions: {
    label: { 'pt-BR': 'Perguntas e advérbios', en: 'Questions and adverbs' },
    icon: '❓',
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
