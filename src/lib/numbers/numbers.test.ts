import { describe, expect, it } from 'vitest'
import {
  countWith,
  monthName,
  nativeKorean,
  readAge,
  readDate,
  readMoney,
  readTime,
  sinoKorean,
} from './numbers'

describe('sinoKorean', () => {
  it.each<[number, string]>([
    [0, '영'],
    [1, '일'],
    [10, '십'],
    [11, '십일'],
    [16, '십육'],
    [20, '이십'],
    [99, '구십구'],
    [100, '백'],
    [101, '백일'],
    [110, '백십'],
    [1000, '천'],
    [1001, '천일'],
    [2026, '이천이십육'],
    [10000, '만'],
    [15000, '만오천'],
    [110000, '십일만'],
    [1000000, '백만'],
    [12345678, '천이백삼십사만오천육백칠십팔'],
    [100000000, '일억'],
    [100010000, '일억만'],
  ])('%d → %s', (n, expected) => {
    expect(sinoKorean(n)).toBe(expected)
  })

  it('can space the 만/억 groups', () => {
    expect(sinoKorean(15000, { spaced: true })).toBe('만 오천')
    expect(sinoKorean(1200000, { spaced: true })).toBe('백이십만')
    expect(sinoKorean(123456789, { spaced: true })).toBe(
      '일억 이천삼백사십오만 육천칠백팔십구',
    )
  })

  it('rejects negatives, fractions and huge numbers', () => {
    expect(() => sinoKorean(-1)).toThrow(RangeError)
    expect(() => sinoKorean(1.5)).toThrow(RangeError)
    expect(() => sinoKorean(1e16)).toThrow(RangeError)
  })
})

describe('nativeKorean', () => {
  it.each<[number, string, string]>([
    [1, '하나', '한'],
    [2, '둘', '두'],
    [3, '셋', '세'],
    [4, '넷', '네'],
    [5, '다섯', '다섯'],
    [10, '열', '열'],
    [11, '열하나', '열한'],
    [20, '스물', '스무'],
    [21, '스물하나', '스물한'],
    [34, '서른넷', '서른네'],
    [45, '마흔다섯', '마흔다섯'],
    [99, '아흔아홉', '아흔아홉'],
  ])('%d → %s (before a counter: %s)', (n, plain, counter) => {
    expect(nativeKorean(n)).toBe(plain)
    expect(nativeKorean(n, { counter: true })).toBe(counter)
  })

  it('only covers 1 to 99', () => {
    expect(() => nativeKorean(0)).toThrow(RangeError)
    expect(() => nativeKorean(100)).toThrow(RangeError)
  })
})

describe('counters', () => {
  it.each<[number, Parameters<typeof countWith>[1], string]>([
    [3, '개', '세 개'],
    [5, '명', '다섯 명'],
    [2, '잔', '두 잔'],
    [1, '마리', '한 마리'],
    [20, '권', '스무 권'],
    [100, '개', '백 개'],
    [3, '층', '삼 층'],
    [2, '인분', '이 인분'],
    [4, '호선', '사 호선'],
  ])('%d + %s → %s', (n, counter, expected) => {
    expect(countWith(n, counter)).toBe(expected)
  })
})

describe('time, dates, money and age', () => {
  it('reads clock time with native hours and Sino-Korean minutes', () => {
    expect(readTime(3, 30)).toBe('세 시 삼십 분')
    expect(readTime(12)).toBe('열두 시')
    expect(readTime(1, 5)).toBe('한 시 오 분')
  })

  it('reads dates with the 유월/시월 exceptions', () => {
    expect(monthName(6)).toBe('유월')
    expect(monthName(10)).toBe('시월')
    expect(monthName(11)).toBe('십일월')
    expect(readDate(2026, 6, 15)).toBe('이천이십육 년 유월 십오 일')
    expect(readDate(2025, 10, 3)).toBe('이천이십오 년 시월 삼 일')
  })

  it('reads money spaced by 만', () => {
    expect(readMoney(4500)).toBe('사천오백 원')
    expect(readMoney(15000)).toBe('만 오천 원')
    expect(readMoney(1200000)).toBe('백이십만 원')
  })

  it('reads age with 살', () => {
    expect(readAge(20)).toBe('스무 살')
    expect(readAge(21)).toBe('스물한 살')
  })
})
