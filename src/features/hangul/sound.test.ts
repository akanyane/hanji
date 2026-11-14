import { describe, expect, it } from 'vitest'
import {
  consonants,
  finals,
  hangulData,
  syllables,
  vowels,
} from '../../content/hangul'
import { entrySound, soundKey } from './sound'

const byHangul = (list: typeof hangulData, h: string) => {
  const entry = list.find((e) => e.hangul === h)
  if (!entry) throw new Error(h)
  return entry
}

describe('entrySound', () => {
  it('speaks a syllable that shows the letter sound', () => {
    expect(entrySound(byHangul(consonants, 'ㄱ'))).toBe('가')
    expect(entrySound(byHangul(consonants, 'ㅇ'))).toBe('아')
    expect(entrySound(byHangul(vowels, 'ㅘ'))).toBe('와')
    expect(entrySound(byHangul(finals, 'ㄹ'))).toBe('알')
    expect(entrySound(byHangul(syllables, '하'))).toBe('하')
  })

  it('always produces a single precomposed syllable', () => {
    for (const entry of hangulData)
      expect(entrySound(entry)).toMatch(/^[가-힣]$/)
  })
})

describe('soundKey', () => {
  it('groups vowels that sound the same today', () => {
    const key = (h: string) => soundKey(byHangul(vowels, h))
    expect(key('ㅐ')).toBe(key('ㅔ'))
    expect(key('ㅒ')).toBe(key('ㅖ'))
    expect(key('ㅙ')).toBe(key('ㅚ'))
    expect(key('ㅚ')).toBe(key('ㅞ'))
    expect(key('ㅏ')).not.toBe(key('ㅓ'))
  })

  it('keeps every consonant distinct', () => {
    const keys = consonants.map(soundKey)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
