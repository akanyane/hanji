import { VOCABULARY } from '../../content/vocabulary'
import { decompose } from '../../lib/hangul'
import {
  PARTICLE_FORMS,
  PARTICLE_TYPES,
  type ParticleType,
  particleFor,
} from '../../lib/particles/particles'

/** Names for the vocative (아/야 only makes sense when calling a person). */
const NAMES = ['민수', '지민', '수진', '현우', '서연', '준호', '하나', '태민']

/** Single-word nouns from the vocabulary bank. */
const NOUNS = VOCABULARY.filter(
  (w) => w.pos === 'noun' && !w.word.includes(' '),
).map((w) => w.word)

export type FinalReason = 'consonant' | 'vowel' | 'rieul'

export interface ParticleQuestion {
  noun: string
  type: ParticleType
  /** [after consonant, after vowel] — always shown in this order. */
  choices: [string, string]
  answer: string
  /** Why the answer is right, for the feedback message. */
  reason: FinalReason
}

/** Endless random particle questions (the rng is injectable for tests). */
export function makeParticleQuestion(
  rng: () => number = Math.random,
): ParticleQuestion {
  const type = PARTICLE_TYPES[Math.floor(rng() * PARTICLE_TYPES.length)]
  const pool = type === 'vocative' ? NAMES : NOUNS
  const noun = pool[Math.floor(rng() * pool.length)]
  const answer = particleFor(noun, type) ?? PARTICLE_FORMS[type][1]
  const final = decompose(noun.slice(-1))?.final ?? ''
  const reason: FinalReason = !final
    ? 'vowel'
    : type === 'direction' && final === 'ㄹ'
      ? 'rieul'
      : 'consonant'
  return { noun, type, choices: PARTICLE_FORMS[type], answer, reason }
}
