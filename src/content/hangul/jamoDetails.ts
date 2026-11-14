// Learning details for each basic jamo (keyed by the entry ids in
// consonants.ts / vowels.ts). Text is shown to the learner, in every
// supported language.
//
// - origin: how the letter's shape was designed (훈민정음 해례본, 1446):
//   consonants draw the speech organs, vowels combine sky (·), earth (ㅡ)
//   and person (ㅣ);
// - tip: how to pronounce it. Tips are written for speakers of each
//   language (they compare with sounds of that language), so they are not
//   literal translations of each other;
// - example: a common word containing the letter.

import type { Localized } from '../../i18n/locales'

export interface JamoDetail {
  origin: Localized
  tip: Localized
  example: { word: string; meaning: Localized }
  needsReview?: boolean
}

const TENSE: Localized = {
  'pt-BR':
    'Consoante tensa: contraia a garganta e solte o som sem nenhum sopro de ar.',
  en: 'Tense consonant: tighten your throat and release the sound with no puff of air, like the "k" in "sky" or the "t" in "stop".',
}

const doubled = (basic: string): Localized => ({
  'pt-BR': `Dois ${basic}: o mesmo som, só que tenso.`,
  en: `Two ${basic}: the same sound, but tense.`,
})

const sum = (a: string, b: string): Localized => ({
  'pt-BR': `${a} + ${b}.`,
  en: `${a} + ${b}.`,
})

export const JAMO_DETAILS: Record<string, JamoDetail> = {
  // Basic consonants
  'cons-g': {
    origin: {
      'pt-BR': 'Desenha a raiz da língua encostando no fundo do céu da boca.',
      en: 'It draws the back of the tongue touching the back of the roof of the mouth.',
    },
    tip: {
      'pt-BR':
        'Entre o "g" e o "k", sem sopro de ar. No fim da sílaba soa como um "k" preso.',
      en: 'Between "g" and "k", with no puff of air. At the end of a syllable it is an unreleased "k".',
    },
    example: { word: '가방', meaning: { 'pt-BR': 'bolsa', en: 'bag' } },
  },
  'cons-n': {
    origin: {
      'pt-BR':
        'Desenha a ponta da língua tocando a gengiva atrás dos dentes de cima.',
      en: 'It draws the tip of the tongue touching the ridge behind the upper teeth.',
    },
    tip: { 'pt-BR': 'Igual ao "n" do português.', en: 'Like the English "n".' },
    example: { word: '나무', meaning: { 'pt-BR': 'árvore', en: 'tree' } },
  },
  'cons-d': {
    origin: {
      'pt-BR':
        'É o ㄴ com um traço a mais: mesmo ponto da língua, som mais forte.',
      en: 'It is ㄴ with an extra stroke: same tongue position, stronger sound.',
    },
    tip: {
      'pt-BR': 'Entre o "d" e o "t". Cuidado: 디 é "di", nunca "dji".',
      en: 'Between "d" and "t", with no puff of air.',
    },
    example: {
      word: '다리',
      meaning: { 'pt-BR': 'perna; ponte', en: 'leg; bridge' },
    },
  },
  'cons-r': {
    origin: {
      'pt-BR': 'Derivada do ㄴ, também com a ponta da língua na gengiva.',
      en: 'Derived from ㄴ, also with the tip of the tongue on the gum ridge.',
    },
    tip: {
      'pt-BR':
        'Entre vogais soa como o "r" de "caro". No fim da sílaba, como um "l".',
      en: 'Between vowels, a quick tap like the "tt" in American "butter". At the end of a syllable, an "l".',
    },
    example: {
      word: '라면',
      meaning: { 'pt-BR': 'lámen', en: 'ramyeon (instant noodles)' },
    },
  },
  'cons-m': {
    origin: {
      'pt-BR': 'Desenha a boca fechada.',
      en: 'It draws a closed mouth.',
    },
    tip: { 'pt-BR': 'Igual ao "m" do português.', en: 'Like the English "m".' },
    example: { word: '머리', meaning: { 'pt-BR': 'cabeça', en: 'head' } },
  },
  'cons-b': {
    origin: {
      'pt-BR': 'É o ㅁ (boca) com traços a mais: os lábios se abrem com força.',
      en: 'It is ㅁ (mouth) with extra strokes: the lips burst open.',
    },
    tip: {
      'pt-BR':
        'Entre o "b" e o "p", sem sopro de ar. No fim da sílaba, um "p" preso.',
      en: 'Between "b" and "p", with no puff of air. At the end of a syllable, an unreleased "p".',
    },
    example: { word: '바다', meaning: { 'pt-BR': 'mar', en: 'sea' } },
  },
  'cons-s': {
    origin: { 'pt-BR': 'Desenha um dente.', en: 'It draws a tooth.' },
    tip: {
      'pt-BR':
        'Como o "s" de "sapo". Antes de ㅣ soa quase como "x": 시 é "xi".',
      en: 'Like the "s" in "sun". Before ㅣ it sounds close to "sh": 시 is "shi".',
    },
    example: { word: '사람', meaning: { 'pt-BR': 'pessoa', en: 'person' } },
  },
  'cons-ng': {
    origin: { 'pt-BR': 'Desenha a garganta.', en: 'It draws the throat.' },
    tip: {
      'pt-BR':
        'No início da sílaba é mudo (a sílaba começa pela vogal). No fim soa "ng", como em "manga".',
      en: 'Silent at the start of a syllable (the syllable starts with the vowel). At the end it is "ng", as in "sing".',
    },
    example: { word: '아이', meaning: { 'pt-BR': 'criança', en: 'child' } },
  },
  'cons-j': {
    origin: {
      'pt-BR':
        'É o ㅅ (dente) com um traço em cima: som mais forte no mesmo lugar.',
      en: 'It is ㅅ (tooth) with a stroke on top: a stronger sound in the same place.',
    },
    tip: {
      'pt-BR': 'Como o "dj" de "dia" no sotaque carioca, sem sopro de ar.',
      en: 'Like the "j" in "jam", but softer and with no puff of air.',
    },
    example: { word: '자동차', meaning: { 'pt-BR': 'carro', en: 'car' } },
  },
  'cons-ch': {
    origin: {
      'pt-BR': 'É o ㅈ com mais um traço: o som ganha um sopro de ar.',
      en: 'It is ㅈ with one more stroke: the sound gets a puff of air.',
    },
    tip: {
      'pt-BR':
        'Como o "tch" de "tia" no sotaque carioca, com um sopro forte de ar.',
      en: 'Like the "ch" in "church", with a strong puff of air.',
    },
    example: { word: '친구', meaning: { 'pt-BR': 'amigo', en: 'friend' } },
  },
  'cons-k': {
    origin: {
      'pt-BR': 'É o ㄱ com um traço a mais: o som ganha um sopro de ar.',
      en: 'It is ㄱ with an extra stroke: the sound gets a puff of air.',
    },
    tip: {
      'pt-BR': 'Um "k" com um sopro forte de ar.',
      en: 'A "k" with a strong puff of air, as in "kite".',
    },
    example: { word: '커피', meaning: { 'pt-BR': 'café', en: 'coffee' } },
  },
  'cons-t': {
    origin: {
      'pt-BR': 'É o ㄷ com um traço a mais: o som ganha um sopro de ar.',
      en: 'It is ㄷ with an extra stroke: the sound gets a puff of air.',
    },
    tip: {
      'pt-BR': 'Um "t" com sopro de ar. Cuidado: 티 é "ti", nunca "tchi".',
      en: 'A "t" with a strong puff of air, as in "top".',
    },
    example: { word: '토끼', meaning: { 'pt-BR': 'coelho', en: 'rabbit' } },
  },
  'cons-p': {
    origin: {
      'pt-BR': 'Derivada do ㅂ: os lábios se abrem com um sopro de ar.',
      en: 'Derived from ㅂ: the lips open with a puff of air.',
    },
    tip: {
      'pt-BR': 'Um "p" com um sopro forte de ar.',
      en: 'A "p" with a strong puff of air, as in "pie".',
    },
    example: { word: '포도', meaning: { 'pt-BR': 'uva', en: 'grape' } },
  },
  'cons-h': {
    origin: {
      'pt-BR':
        'É o ㅇ (garganta) com traços a mais: o ar passa com força pela garganta.',
      en: 'It is ㅇ (throat) with extra strokes: air rushes through the throat.',
    },
    tip: {
      'pt-BR':
        'Como o "h" do inglês "house": um sopro suave saindo da garganta.',
      en: 'Like the "h" in "house".',
    },
    example: {
      word: '하나',
      meaning: { 'pt-BR': 'um (número nativo)', en: 'one (native number)' },
    },
  },
  // Double consonants
  'cons-kk': {
    origin: doubled('ㄱ'),
    tip: TENSE,
    example: {
      word: '까치',
      meaning: { 'pt-BR': 'pega (pássaro)', en: 'magpie' },
    },
  },
  'cons-tt': {
    origin: doubled('ㄷ'),
    tip: TENSE,
    example: {
      word: '딸기',
      meaning: { 'pt-BR': 'morango', en: 'strawberry' },
    },
  },
  'cons-pp': {
    origin: doubled('ㅂ'),
    tip: TENSE,
    example: { word: '빵', meaning: { 'pt-BR': 'pão', en: 'bread' } },
  },
  'cons-ss': {
    origin: doubled('ㅅ'),
    tip: TENSE,
    example: {
      word: '쌀',
      meaning: { 'pt-BR': 'arroz (cru)', en: 'rice (uncooked)' },
    },
  },
  'cons-jj': {
    origin: doubled('ㅈ'),
    tip: TENSE,
    example: {
      word: '짜다',
      meaning: { 'pt-BR': 'ser salgado', en: 'to be salty' },
    },
  },
  // Basic vowels
  'vowel-a': {
    origin: {
      'pt-BR': 'Pessoa (ㅣ) com o céu (·) à direita, no lado de fora.',
      en: 'Person (ㅣ) with the sky (·) on the right, on the outside.',
    },
    tip: { 'pt-BR': 'Como o "a" de "casa".', en: 'Like the "a" in "father".' },
    example: { word: '아빠', meaning: { 'pt-BR': 'papai', en: 'dad' } },
  },
  'vowel-eo': {
    origin: {
      'pt-BR': 'Pessoa (ㅣ) com o céu (·) à esquerda, no lado de dentro.',
      en: 'Person (ㅣ) with the sky (·) on the left, on the inside.',
    },
    tip: {
      'pt-BR': 'Parecido com o "ó" de "avó", mas sem arredondar os lábios.',
      en: 'Like the "u" in "cup", with the mouth a bit more open.',
    },
    example: { word: '어머니', meaning: { 'pt-BR': 'mãe', en: 'mother' } },
  },
  'vowel-o': {
    origin: {
      'pt-BR': 'Terra (ㅡ) com o céu (·) em cima.',
      en: 'Earth (ㅡ) with the sky (·) above it.',
    },
    tip: {
      'pt-BR': 'Como o "ô" de "avô", com os lábios bem arredondados.',
      en: 'Like the "o" in "go", with rounded lips and no "w" glide at the end.',
    },
    example: { word: '오이', meaning: { 'pt-BR': 'pepino', en: 'cucumber' } },
  },
  'vowel-u': {
    origin: {
      'pt-BR': 'Terra (ㅡ) com o céu (·) embaixo.',
      en: 'Earth (ㅡ) with the sky (·) below it.',
    },
    tip: {
      'pt-BR': 'Como o "u" de "uva", com os lábios arredondados.',
      en: 'Like the "oo" in "moon".',
    },
    example: { word: '우유', meaning: { 'pt-BR': 'leite', en: 'milk' } },
  },
  'vowel-eu': {
    origin: {
      'pt-BR': 'A terra (ㅡ): uma linha plana.',
      en: 'The earth (ㅡ): a flat line.',
    },
    tip: {
      'pt-BR':
        'Não existe em português: diga "u" com os lábios esticados, como se sorrisse.',
      en: 'There is no English equivalent: say "oo" with your lips spread, as if smiling.',
    },
    example: {
      word: '그림',
      meaning: { 'pt-BR': 'desenho; pintura', en: 'drawing; painting' },
    },
  },
  'vowel-i': {
    origin: { 'pt-BR': 'A pessoa (ㅣ) em pé.', en: 'A person (ㅣ) standing.' },
    tip: { 'pt-BR': 'Como o "i" de "vida".', en: 'Like the "ee" in "see".' },
    example: { word: '이름', meaning: { 'pt-BR': 'nome', en: 'name' } },
  },
  'vowel-ae': {
    origin: sum('ㅏ', 'ㅣ'),
    tip: {
      'pt-BR':
        'Como o "é" de "pé". Hoje soa igual a ㅔ para a maioria dos coreanos.',
      en: 'Like the "e" in "bed". Most Koreans today pronounce it the same as ㅔ.',
    },
    example: { word: '개', meaning: { 'pt-BR': 'cachorro', en: 'dog' } },
  },
  'vowel-e': {
    origin: sum('ㅓ', 'ㅣ'),
    tip: {
      'pt-BR': 'Como o "é" de "pé" (ou o "ê" de "você"). Hoje soa igual a ㅐ.',
      en: 'Like the "e" in "bed". Today it sounds the same as ㅐ.',
    },
    example: { word: '게', meaning: { 'pt-BR': 'caranguejo', en: 'crab' } },
  },
  'vowel-ya': {
    origin: {
      'pt-BR': 'ㅏ com dois traços: o traço extra acrescenta um "i" antes.',
      en: 'ㅏ with two strokes: the extra stroke adds a "y" sound before it.',
    },
    tip: { 'pt-BR': 'Como o "iá" de "Iara".', en: 'Like the "ya" in "yacht".' },
    example: { word: '야구', meaning: { 'pt-BR': 'beisebol', en: 'baseball' } },
  },
  'vowel-yeo': {
    origin: {
      'pt-BR': 'ㅓ com dois traços: o traço extra acrescenta um "i" antes.',
      en: 'ㅓ with two strokes: the extra stroke adds a "y" sound before it.',
    },
    tip: {
      'pt-BR': 'Um "i" seguido do som de ㅓ: "ió" sem arredondar os lábios.',
      en: 'A "y" followed by ㅓ, like the "yu" in "yummy".',
    },
    example: { word: '여자', meaning: { 'pt-BR': 'mulher', en: 'woman' } },
  },
  'vowel-yo': {
    origin: {
      'pt-BR': 'ㅗ com dois traços: o traço extra acrescenta um "i" antes.',
      en: 'ㅗ with two strokes: the extra stroke adds a "y" sound before it.',
    },
    tip: { 'pt-BR': 'Como o "iô" de "ioiô".', en: 'Like the "yo" in "yoga".' },
    example: {
      word: '요리',
      meaning: { 'pt-BR': 'culinária; prato', en: 'cooking; dish' },
    },
  },
  'vowel-yu': {
    origin: {
      'pt-BR': 'ㅜ com dois traços: o traço extra acrescenta um "i" antes.',
      en: 'ㅜ with two strokes: the extra stroke adds a "y" sound before it.',
    },
    tip: { 'pt-BR': 'Como o "iu" de "Iuri".', en: 'Like the word "you".' },
    example: { word: '유리', meaning: { 'pt-BR': 'vidro', en: 'glass' } },
  },
  'vowel-yae': {
    origin: sum('ㅑ', 'ㅣ'),
    tip: {
      'pt-BR': 'Um "i" seguido de "é": "ié". Vogal rara.',
      en: 'Like the "ye" in "yes". A rare vowel.',
    },
    example: {
      word: '얘기',
      meaning: { 'pt-BR': 'conversa; história', en: 'talk; story' },
    },
  },
  'vowel-ye': {
    origin: sum('ㅕ', 'ㅣ'),
    tip: {
      'pt-BR':
        'Um "i" seguido de "é": "ié". Depois de consoante costuma soar só "é" (시계 → "xi-gue").',
      en: 'Like the "ye" in "yes". After a consonant it usually sounds like plain "e" (시계 → "shi-ge").',
    },
    example: {
      word: '시계',
      meaning: { 'pt-BR': 'relógio', en: 'clock; watch' },
    },
  },
  // Compound vowels
  'vowel-wa': {
    origin: sum('ㅗ', 'ㅏ'),
    tip: {
      'pt-BR': 'Como o "uá" de "água" (rápido, numa sílaba só).',
      en: 'Like the "wa" in "wand".',
    },
    example: { word: '사과', meaning: { 'pt-BR': 'maçã', en: 'apple' } },
  },
  'vowel-oe': {
    origin: sum('ㅗ', 'ㅣ'),
    tip: {
      'pt-BR': 'Hoje se pronuncia "ué", quase igual a ㅙ e ㅞ.',
      en: 'Today it is pronounced like the "we" in "wet", almost the same as ㅙ and ㅞ.',
    },
    example: { word: '회사', meaning: { 'pt-BR': 'empresa', en: 'company' } },
  },
  'vowel-wae': {
    origin: sum('ㅗ', 'ㅐ'),
    tip: { 'pt-BR': 'Como "ué".', en: 'Like the "we" in "wet".' },
    example: { word: '왜', meaning: { 'pt-BR': 'por quê', en: 'why' } },
  },
  'vowel-wo': {
    origin: sum('ㅜ', 'ㅓ'),
    tip: {
      'pt-BR': 'Um "u" rápido seguido do som de ㅓ: "uó".',
      en: 'Like the "wo" in "won".',
    },
    example: { word: '뭐', meaning: { 'pt-BR': 'o quê', en: 'what' } },
  },
  'vowel-wi': {
    origin: sum('ㅜ', 'ㅣ'),
    tip: {
      'pt-BR': 'Como o "ui" de "fui", numa sílaba só.',
      en: 'Like the word "we".',
    },
    example: { word: '귀', meaning: { 'pt-BR': 'orelha', en: 'ear' } },
  },
  'vowel-we': {
    origin: sum('ㅜ', 'ㅔ'),
    tip: {
      'pt-BR': 'Como "ué". Aparece pouco, mais em palavras estrangeiras.',
      en: 'Like the "we" in "wet". It shows up mostly in loanwords.',
    },
    example: { word: '스웨터', meaning: { 'pt-BR': 'suéter', en: 'sweater' } },
  },
  'vowel-ui': {
    origin: sum('ㅡ', 'ㅣ'),
    tip: {
      'pt-BR':
        'ㅡ seguido de ㅣ rápido. Depois de consoante soa só "i" (희 = "hi"); como partícula 의, soa "e".',
      en: 'ㅡ quickly followed by ㅣ. After a consonant it is just "i" (희 = "hi"); as the particle 의 it sounds like "e".',
    },
    example: { word: '의사', meaning: { 'pt-BR': 'médico', en: 'doctor' } },
  },
}
