import { describe, expect, it } from 'vitest'
import { attachParticle, type ParticleType, particleFor } from './particles'

describe('particleFor', () => {
  it.each<[string, ParticleType, string]>([
    ['책', 'topic', '은'],
    ['사과', 'topic', '는'],
    ['학생', 'subject', '이'],
    ['친구', 'subject', '가'],
    ['밥', 'object', '을'],
    ['커피', 'object', '를'],
    ['빵', 'and', '과'],
    ['우유', 'and', '와'],
    ['동생', 'with', '이랑'],
    ['엄마', 'with', '랑'],
    ['버스', 'direction', '로'],
    ['학교', 'direction', '로'],
    ['집', 'direction', '으로'],
    // ㄹ takes 로 for (으)로 only
    ['서울', 'direction', '로'],
    ['지하철', 'direction', '로'],
    ['서울', 'topic', '은'],
    ['민수', 'vocative', '야'],
    ['지민', 'vocative', '아'],
  ])('%s + %s → %s', (noun, type, expected) => {
    expect(particleFor(noun, type)).toBe(expected)
  })

  it('returns null without a Hangul ending', () => {
    expect(particleFor('TV', 'topic')).toBeNull()
    expect(particleFor('', 'topic')).toBeNull()
  })
})

describe('attachParticle', () => {
  it('joins noun and particle', () => {
    expect(attachParticle('책', 'object')).toBe('책을')
    expect(attachParticle(' 서울 ', 'direction')).toBe('서울로')
  })
})
