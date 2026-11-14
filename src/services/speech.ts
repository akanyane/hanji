// Text-to-speech through the browser's Web Speech API (free, no server).
//
// Which voices exist depends on the OS/browser: Chrome and Edge usually
// ship a Korean voice, while some Linux setups have none. Voices also load
// asynchronously, so callers should listen for `voiceschanged`.

export const KOREAN_LANG = 'ko-KR'

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

/** Picks the best Korean voice: an exact ko-KR match first, then any "ko" voice. */
export function findKoreanVoice(
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const normalized = (v: SpeechSynthesisVoice) =>
    v.lang.replace('_', '-').toLowerCase()
  return (
    voices.find((v) => normalized(v) === 'ko-kr') ??
    voices.find((v) => normalized(v).startsWith('ko'))
  )
}

export interface SpeakOptions {
  /** 0.5–1.5, where 1 is normal speed. */
  rate?: number
  onEnd?: () => void
}

/**
 * Speaks Korean text, interrupting anything already playing.
 * Returns false when the browser has no speech synthesis.
 */
export function speakKorean(
  text: string,
  { rate = 1, onEnd }: SpeakOptions = {},
): boolean {
  if (!isSpeechSynthesisSupported()) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = KOREAN_LANG
  utterance.rate = rate
  const voice = findKoreanVoice(synth.getVoices())
  if (voice) utterance.voice = voice
  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }
  synth.speak(utterance)
  return true
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
