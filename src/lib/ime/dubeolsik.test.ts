import { describe, expect, it } from 'vitest'
import {
  EMPTY_IME_STATE,
  type ImeState,
  imeBackspace,
  imeInput,
  imeText,
  keysToHangul,
  keyToJamo,
} from './dubeolsik'

function typeJamo(jamo: string, state: ImeState = EMPTY_IME_STATE) {
  let s = state
  for (const j of jamo) s = imeInput(s, j)
  return s
}

describe('keyToJamo', () => {
  it('maps QWERTY keys to the 2-set layout, with shift for tense consonants', () => {
    expect(keyToJamo('r')).toBe('ㄱ')
    expect(keyToJamo('R')).toBe('ㄲ')
    expect(keyToJamo('K')).toBe('ㅏ') // no shifted jamo: same as lowercase
    expect(keyToJamo('1')).toBeUndefined()
  })
})

describe('keysToHangul', () => {
  it.each([
    ['gksrmf', '한글'],
    ['dkssudgktpdy', '안녕하세요'],
    ['rkatkgkqslek', '감사합니다'],
    ['ekfr', '닭'],
    ['ekfrdl', '닭이'],
    ['ekfrl', '달기'],
    ['dhkTdj', '왔어'],
    ['dmlwk', '의자'],
    ['Rhc', '꽃'],
    ['tjdnf dur', '서울 역'],
  ])('%s → %s', (keys, expected) => {
    expect(keysToHangul(keys)).toBe(expected)
  })

  it('moves a final to the next syllable when a vowel follows', () => {
    expect(keysToHangul('gksk')).toBe('하나')
  })

  it('splits a compound final when a vowel follows', () => {
    expect(keysToHangul('djqtj')).toBe('업서')
  })

  it('starts a new block when ㄸ/ㅃ/ㅉ would be a final', () => {
    expect(keysToHangul('rkE')).toBe('가ㄸ')
  })

  it('keeps standalone jamo and other characters', () => {
    expect(keysToHangul('rr')).toBe('ㄱㄱ')
    expect(keysToHangul('k')).toBe('ㅏ')
    expect(keysToHangul('gk!')).toBe('하!')
  })
})

describe('imeInput', () => {
  it('composes step by step', () => {
    const steps: string[] = []
    let s = EMPTY_IME_STATE
    for (const j of 'ㅎㅏㄴㄱㅡㄹ') {
      s = imeInput(s, j)
      steps.push(imeText(s))
    }
    expect(steps).toEqual(['ㅎ', '하', '한', '한ㄱ', '한그', '한글'])
  })

  it('combines vowels into compound vowels', () => {
    expect(imeText(typeJamo('ㄱㅗㅏ'))).toBe('과')
    expect(imeText(typeJamo('ㅇㅡㅣ'))).toBe('의')
  })
})

describe('imeBackspace', () => {
  it('removes one jamo at a time, splitting compounds', () => {
    let s = typeJamo('ㄱㅗㅏㄹㄱ') // 괅
    const seen: string[] = [imeText(s)]
    for (let i = 0; i < 5; i++) {
      s = imeBackspace(s)
      seen.push(imeText(s))
    }
    expect(seen).toEqual(['괅', '괄', '과', '고', 'ㄱ', ''])
  })

  it('deletes committed characters once nothing is composing', () => {
    const s = imeBackspace(imeBackspace(typeJamo('ㄱㅏㄴㅏ')))
    expect(imeText(s)).toBe('가')
    expect(imeText(imeBackspace(s))).toBe('')
    expect(imeText(imeBackspace(EMPTY_IME_STATE))).toBe('')
  })
})
