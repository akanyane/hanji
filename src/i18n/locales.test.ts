import { describe, expect, it } from 'vitest'
import { detectLocale, isLocale } from './locales'

describe('detectLocale', () => {
  it('matches exact codes and language families', () => {
    expect(detectLocale(['pt-BR'])).toBe('pt-BR')
    expect(detectLocale(['pt-PT'])).toBe('pt-BR')
    expect(detectLocale(['pt'])).toBe('pt-BR')
    expect(detectLocale(['en-GB'])).toBe('en')
  })

  it('uses the first supported language in order of preference', () => {
    expect(detectLocale(['ja-JP', 'pt-BR', 'en'])).toBe('pt-BR')
  })

  it('falls back to English', () => {
    expect(detectLocale(['ja-JP'])).toBe('en')
    expect(detectLocale([])).toBe('en')
  })
})

describe('isLocale', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('pt')).toBe(false)
  })
})
