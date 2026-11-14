import { describe, expect, it } from 'vitest'
import { romanize } from './romanize'
import { romanizationToHangul } from './toHangul'

// Examples taken from the official Revised Romanization rules (2000).
const OFFICIAL: Array<[string, string]> = [
  // Basic consonants and finals
  ['구미', 'gumi'],
  ['영동', 'yeongdong'],
  ['백암', 'baegam'],
  ['옥천', 'okcheon'],
  ['합덕', 'hapdeok'],
  ['호법', 'hobeop'],
  ['월곶', 'wolgot'],
  ['벚꽃', 'beotkkot'],
  ['한밭', 'hanbat'],
  ['구리', 'guri'],
  ['설악', 'seorak'],
  ['칠곡', 'chilgok'],
  ['임실', 'imsil'],
  ['울릉', 'ulleung'],
  ['대관령', 'daegwallyeong'],
  // Sound changes that RR reflects
  ['백마', 'baengma'],
  ['신문로', 'sinmunno'],
  ['종로', 'jongno'],
  ['왕십리', 'wangsimni'],
  ['별내', 'byeollae'],
  ['신라', 'silla'],
  ['해돋이', 'haedoji'],
  ['같이', 'gachi'],
  ['굳히다', 'guchida'],
  ['좋고', 'joko'],
  ['놓다', 'nota'],
  ['잡혀', 'japyeo'],
  ['낳지', 'nachi'],
  // Tensification is not written
  ['압구정', 'apgujeong'],
  ['낙동강', 'nakdonggang'],
  ['죽변', 'jukbyeon'],
  ['낙성대', 'nakseongdae'],
  ['합정', 'hapjeong'],
  ['팔당', 'paldang'],
  ['샛별', 'saetbyeol'],
  ['울산', 'ulsan'],
  // ㅢ is always "ui"
  ['광희문', 'gwanghuimun'],
]

describe('romanize', () => {
  it.each(OFFICIAL)('%s → %s', (hangul, expected) => {
    expect(romanize(hangul)).toBe(expected)
  })

  it('romanizes common words and keeps spaces and punctuation', () => {
    expect(romanize('한글')).toBe('hangeul')
    expect(romanize('안녕하세요, 서울!')).toBe('annyeonghaseyo, seoul!')
  })

  it('keeps the h after ㄱ/ㄷ/ㅂ in nouns when asked', () => {
    expect(romanize('묵호', { keepHAfterObstruent: true })).toBe('mukho')
    expect(romanize('집현전', { keepHAfterObstruent: true })).toBe(
      'jiphyeonjeon',
    )
    expect(romanize('묵호')).toBe('muko')
  })
})

describe('romanizationToHangul', () => {
  it.each([
    ['hangeul', '한글'],
    ['annyeonghaseyo', '안녕하세요'],
    ['seoul', '서울'],
    ['gimchi', '김치'],
    ['silla', '실라'],
    ['jongno', '종노'],
    ['bakke', '바께'],
    ['ulleung', '울릉'],
  ])('%s → %s', (input, expected) => {
    expect(romanizationToHangul(input)).toEqual({
      hangul: expected,
      unrecognized: [],
    })
  })

  it('uses hyphens to resolve ambiguous syllable boundaries', () => {
    expect(romanizationToHangul('jungang').hangul).toBe('준강')
    expect(romanizationToHangul('jung-ang').hangul).toBe('중앙')
    // The longest-onset guess favors ㄴ + ㄱ (hanguk → 한국)...
    expect(romanizationToHangul('hanguk').hangul).toBe('한국')
    // ...so ㅇ + vowel needs the hyphen.
    expect(romanizationToHangul('goyang-i').hangul).toBe('고양이')
  })

  it('is case-insensitive and keeps spaces and punctuation', () => {
    expect(romanizationToHangul('Seoul, Busan!').hangul).toBe('서울, 부산!')
  })

  it('reports words that are not valid romanization', () => {
    expect(romanizationToHangul('world xyz')).toEqual({
      hangul: 'world xyz',
      unrecognized: ['world', 'xyz'],
    })
  })

  it('round-trips with romanize for words without sound changes', () => {
    for (const word of ['사람', '학생', '부산', '사랑해요', '어머니']) {
      expect(romanizationToHangul(romanize(word)).hangul).toBe(word)
    }
  })
})
