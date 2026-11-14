import { describe, expect, it } from 'vitest'
import {
  combineFinals,
  combineMedials,
  compose,
  decompose,
  FINALS,
  hasFinalConsonant,
  INITIALS,
  isSyllable,
  MEDIALS,
  splitCompound,
  toJamo,
} from './jamo'

describe('jamo tables', () => {
  it('has 19 initials, 21 medials and 28 finals (including "none")', () => {
    expect(INITIALS).toHaveLength(19)
    expect(MEDIALS).toHaveLength(21)
    expect(FINALS).toHaveLength(28)
  })
})

describe('compose', () => {
  it('builds syllables with the Unicode formula', () => {
    expect(compose('ㄱ', 'ㅏ')).toBe('가')
    expect(compose('ㅎ', 'ㅏ', 'ㄴ')).toBe('한')
    expect(compose('ㄱ', 'ㅡ', 'ㄹ')).toBe('글')
    expect(compose('ㄷ', 'ㅏ', 'ㄺ')).toBe('닭')
    expect(compose('ㅎ', 'ㅣ', 'ㅎ')).toBe('힣')
  })

  it('returns null for invalid jamo positions', () => {
    expect(compose('ㅏ', 'ㄱ')).toBeNull()
    expect(compose('ㄱ', 'ㅏ', 'ㄸ')).toBeNull() // ㄸ can't be a final
    expect(compose('ㄳ', 'ㅏ')).toBeNull() // ㄳ can't be an initial
  })
})

describe('decompose', () => {
  it('splits syllables into jamo', () => {
    expect(decompose('가')).toEqual({ initial: 'ㄱ', medial: 'ㅏ', final: '' })
    expect(decompose('없')).toEqual({
      initial: 'ㅇ',
      medial: 'ㅓ',
      final: 'ㅄ',
    })
    expect(decompose('뷁')).toEqual({
      initial: 'ㅂ',
      medial: 'ㅞ',
      final: 'ㄺ',
    })
  })

  it('returns null for anything that is not a syllable block', () => {
    expect(decompose('ㄱ')).toBeNull()
    expect(decompose('a')).toBeNull()
    expect(decompose('')).toBeNull()
  })

  it('round-trips every one of the 11,172 syllables', () => {
    for (let code = 0xac00; code <= 0xd7a3; code++) {
      const char = String.fromCharCode(code)
      const s = decompose(char)
      expect(s && compose(s.initial, s.medial, s.final)).toBe(char)
    }
  })
})

describe('isSyllable', () => {
  it('accepts only precomposed blocks', () => {
    expect(isSyllable('가')).toBe(true)
    expect(isSyllable('힣')).toBe(true)
    expect(isSyllable('ㅏ')).toBe(false)
    expect(isSyllable('가나')).toBe(false)
  })
})

describe('compounds', () => {
  it('splits and combines compound jamo', () => {
    expect(splitCompound('ㅘ')).toEqual(['ㅗ', 'ㅏ'])
    expect(splitCompound('ㄳ')).toEqual(['ㄱ', 'ㅅ'])
    expect(splitCompound('ㄱ')).toEqual(['ㄱ'])
    expect(combineFinals('ㄹ', 'ㄱ')).toBe('ㄺ')
    expect(combineFinals('ㄱ', 'ㄱ')).toBeNull()
    expect(combineMedials('ㅡ', 'ㅣ')).toBe('ㅢ')
    expect(combineMedials('ㅏ', 'ㅗ')).toBeNull()
  })
})

describe('toJamo', () => {
  it('flattens text into jamo, keeping other characters', () => {
    expect(toJamo('한글')).toEqual(['ㅎ', 'ㅏ', 'ㄴ', 'ㄱ', 'ㅡ', 'ㄹ'])
    expect(toJamo('가 a')).toEqual(['ㄱ', 'ㅏ', ' ', 'a'])
  })

  it('optionally splits compound vowels and finals', () => {
    expect(toJamo('왔', { splitCompounds: true })).toEqual([
      'ㅇ',
      'ㅗ',
      'ㅏ',
      'ㅆ',
    ])
    expect(toJamo('닭', { splitCompounds: true })).toEqual([
      'ㄷ',
      'ㅏ',
      'ㄹ',
      'ㄱ',
    ])
  })
})

describe('hasFinalConsonant', () => {
  it('checks the last Hangul syllable (used to pick particles)', () => {
    expect(hasFinalConsonant('책')).toBe(true)
    expect(hasFinalConsonant('사과')).toBe(false)
    expect(hasFinalConsonant('선생님!')).toBe(true)
    expect(hasFinalConsonant('abc')).toBe(false)
  })
})
