import { describe, expect, it } from 'vitest'
import { MEDIALS } from './jamo'
import { vowelOrientation } from './layout'

describe('vowelOrientation', () => {
  it('classifies every vowel', () => {
    for (const medial of MEDIALS)
      expect(vowelOrientation(medial)).not.toBeNull()
  })

  it('distinguishes vertical, horizontal and mixed vowels', () => {
    expect(vowelOrientation('ㅏ')).toBe('vertical')
    expect(vowelOrientation('ㅣ')).toBe('vertical')
    expect(vowelOrientation('ㅗ')).toBe('horizontal')
    expect(vowelOrientation('ㅡ')).toBe('horizontal')
    expect(vowelOrientation('ㅘ')).toBe('mixed')
    expect(vowelOrientation('ㅢ')).toBe('mixed')
  })

  it('returns null for non-vowels', () => {
    expect(vowelOrientation('ㄱ')).toBeNull()
  })
})
