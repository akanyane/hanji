import { describe, expect, it } from 'vitest'
import { INITIALS } from '../../lib/hangul'
import { jamoName } from './jamoNames'

describe('jamoName', () => {
  it('names every initial consonant', () => {
    for (const initial of INITIALS) expect(jamoName(initial)).toBeTruthy()
  })

  it('names consonants, vowels and compound finals', () => {
    expect(jamoName('ㄱ')).toBe('기역')
    expect(jamoName('ㅆ')).toBe('쌍시옷')
    expect(jamoName('ㅏ')).toBe('아')
    expect(jamoName('ㅢ')).toBe('의')
    expect(jamoName('ㄺ')).toBe('리을 + 기역')
    expect(jamoName('a')).toBeUndefined()
  })
})
