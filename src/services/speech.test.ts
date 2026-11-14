import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  findKoreanVoice,
  isSpeechSynthesisSupported,
  speakKorean,
} from './speech'

const voice = (lang: string, name = lang) =>
  ({ lang, name }) as SpeechSynthesisVoice

class FakeUtterance {
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(public text: string) {}
}

describe('findKoreanVoice', () => {
  it('prefers an exact ko-KR voice, then any Korean voice', () => {
    expect(
      findKoreanVoice([
        voice('en-US'),
        voice('ko', 'generic'),
        voice('ko-KR', 'exact'),
      ])?.name,
    ).toBe('exact')
    expect(findKoreanVoice([voice('ko_KR', 'android')])?.name).toBe('android')
    expect(findKoreanVoice([voice('en-US')])).toBeUndefined()
  })
})

describe('speakKorean', () => {
  const speak = vi.fn()
  const cancel = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
    vi.stubGlobal('speechSynthesis', {
      speak,
      cancel,
      getVoices: () => [voice('en-US'), voice('ko-KR', 'Korean')],
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    speak.mockReset()
    cancel.mockReset()
  })

  it('speaks with a Korean voice at the requested rate', () => {
    expect(isSpeechSynthesisSupported()).toBe(true)
    expect(speakKorean('안녕하세요', { rate: 0.8 })).toBe(true)

    expect(cancel).toHaveBeenCalled()
    const utterance = speak.mock.calls[0][0] as FakeUtterance
    expect(utterance).toMatchObject({
      text: '안녕하세요',
      lang: 'ko-KR',
      rate: 0.8,
    })
    expect(utterance.voice?.name).toBe('Korean')
  })

  it('returns false when speech synthesis is unavailable', () => {
    vi.unstubAllGlobals()
    expect(isSpeechSynthesisSupported()).toBe(false)
    expect(speakKorean('안녕')).toBe(false)
  })
})
