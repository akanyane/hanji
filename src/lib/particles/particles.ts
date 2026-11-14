// Particles whose form depends on whether the noun ends in a consonant
// (batchim). The choice is purely phonological, so it can be computed.

import { decompose } from '../hangul'

export type ParticleType =
  | 'topic'
  | 'subject'
  | 'object'
  | 'and'
  | 'with'
  | 'direction'
  | 'vocative'

/** [after a consonant, after a vowel]. */
export const PARTICLE_FORMS: Record<
  ParticleType,
  [afterConsonant: string, afterVowel: string]
> = {
  topic: ['은', '는'],
  subject: ['이', '가'],
  object: ['을', '를'],
  and: ['과', '와'],
  with: ['이랑', '랑'],
  direction: ['으로', '로'],
  vocative: ['아', '야'],
}

export const PARTICLE_TYPES = Object.keys(PARTICLE_FORMS) as ParticleType[]

/**
 * Picks the right particle form for a noun. (으)로 is special: a noun ending
 * in ㄹ takes 로, like a vowel (서울로, 지하철로). Returns null when the noun
 * doesn't end in a Hangul syllable (numbers, Latin letters).
 */
export function particleFor(noun: string, type: ParticleType): string | null {
  const last = decompose(noun.trim().slice(-1))
  if (!last) return null
  const [afterConsonant, afterVowel] = PARTICLE_FORMS[type]
  if (!last.final) return afterVowel
  if (type === 'direction' && last.final === 'ㄹ') return afterVowel
  return afterConsonant
}

/** Noun + particle, e.g. ("책", "object") → "책을". */
export function attachParticle(
  noun: string,
  type: ParticleType,
): string | null {
  const particle = particleFor(noun, type)
  return particle === null ? null : noun.trim() + particle
}
