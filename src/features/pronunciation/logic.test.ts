import { describe, expect, it } from 'vitest'
import { RULE_EXAMPLES } from '../../content/pronunciation/practice'
import { pronounce } from '../../lib/pronunciation/pronounce'
import { seededRng } from '../../test/rng'
import { pronunciationChoices, pronunciationStages } from './logic'

describe('pronunciationStages', () => {
  it('walks from the spelling to the pronunciation one rule at a time', () => {
    expect(pronunciationStages('읽는')).toEqual(['읽는', '익는', '잉는'])
    expect(pronunciationStages('굳이')).toEqual(['굳이', '구디', '구지'])
    expect(pronunciationStages('사람')).toEqual(['사람'])
  })

  it('ends with the engine pronunciation for every rule example', () => {
    for (const word of Object.values(RULE_EXAMPLES).flat()) {
      const stages = pronunciationStages(word)
      expect(stages[stages.length - 1]).toBe(pronounce(word).pronunciation)
    }
  })
})

describe('pronunciationChoices', () => {
  it('always includes the right answer, with distinct wrong ones', () => {
    for (const word of Object.values(RULE_EXAMPLES).flat()) {
      const choices = pronunciationChoices(word, 4, seededRng(word.length))
      expect(choices).toContain(pronounce(word).pronunciation)
      expect(new Set(choices).size).toBe(choices.length)
      expect(choices.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('offers the untensed form as a distractor', () => {
    expect(pronunciationChoices('학교', 4, seededRng(1))).toEqual(
      expect.arrayContaining(['학꾜', '학교']),
    )
  })
})
