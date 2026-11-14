import { describe, expect, it } from 'vitest'
import { particleFor } from '../../lib/particles/particles'
import { seededRng } from '../../test/rng'
import { makeParticleQuestion } from './particleQuiz'

describe('makeParticleQuestion', () => {
  it('always offers both forms and marks the engine-approved one as the answer', () => {
    const rng = seededRng(42)
    for (let i = 0; i < 200; i++) {
      const q = makeParticleQuestion(rng)
      expect(q.choices).toHaveLength(2)
      expect(q.choices).toContain(q.answer)
      expect(q.answer).toBe(particleFor(q.noun, q.type))
    }
  })

  it('uses names for the vocative', () => {
    const rng = seededRng(7)
    for (let i = 0; i < 200; i++) {
      const q = makeParticleQuestion(rng)
      if (q.type === 'vocative') expect(['아', '야']).toContain(q.answer)
    }
  })

  it('explains ㄹ with (으)로', () => {
    // Find a question with a ㄹ-final noun and the direction particle.
    const rng = seededRng(1)
    for (let i = 0; i < 2000; i++) {
      const q = makeParticleQuestion(rng)
      if (q.reason === 'rieul') {
        expect(q.type).toBe('direction')
        expect(q.answer).toBe('로')
        return
      }
    }
    throw new Error('no ㄹ + (으)로 question generated')
  })
})
