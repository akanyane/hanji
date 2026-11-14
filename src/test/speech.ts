import { vi } from 'vitest'

/**
 * Fake speech synthesis: records what was spoken and finishes each
 * utterance on the next tick. Returns the list of spoken texts.
 */
export function stubSpeechSynthesis(): string[] {
  const spoken: string[] = []
  class FakeUtterance {
    lang = ''
    rate = 1
    pitch = 1
    voice: unknown = null
    onend: (() => void) | null = null
    onerror: (() => void) | null = null
    constructor(public text: string) {}
  }
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
  vi.stubGlobal('speechSynthesis', {
    speak: (u: FakeUtterance) => {
      spoken.push(u.text)
      setTimeout(() => u.onend?.(), 0)
    },
    cancel: () => {},
    getVoices: () => [{ lang: 'ko-KR', name: 'Korean' }],
    addEventListener: () => {},
    removeEventListener: () => {},
  })
  return spoken
}

/**
 * Fake speech recognition that "hears" whatever `heard.text` holds when
 * recognition starts (so a test can set it after reading the screen).
 */
export function stubSpeechRecognition(): { text: string } {
  const heard = { text: '' }
  class FakeRecognition {
    lang = ''
    interimResults = false
    maxAlternatives = 1
    continuous = false
    onresult: ((e: unknown) => void) | null = null
    onerror: ((e: unknown) => void) | null = null
    onend: (() => void) | null = null
    start() {
      setTimeout(() => {
        const result = Object.assign(
          [{ transcript: heard.text, confidence: 1 }],
          { isFinal: true },
        )
        this.onresult?.({ results: [result] })
        this.onend?.()
      }, 0)
    }
    stop() {}
    abort() {}
  }
  vi.stubGlobal('webkitSpeechRecognition', FakeRecognition)
  return heard
}
