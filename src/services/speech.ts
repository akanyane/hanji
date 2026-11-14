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
  /** 0–2, where 1 is the voice's normal pitch (used to tell dialogue speakers apart). */
  pitch?: number
  onEnd?: () => void
}

/**
 * Speaks Korean text, interrupting anything already playing.
 * Returns false when the browser has no speech synthesis.
 */
export function speakKorean(
  text: string,
  { rate = 1, pitch, onEnd }: SpeakOptions = {},
): boolean {
  if (!isSpeechSynthesisSupported()) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = KOREAN_LANG
  utterance.rate = rate
  if (pitch !== undefined) utterance.pitch = pitch
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

export interface SpokenLine {
  text: string
  pitch?: number
}

/**
 * Speaks lines one after another (e.g. a dialogue), calling `onLine` as each
 * starts. Returns a function that stops playback.
 */
export function speakSequence(
  lines: SpokenLine[],
  {
    rate = 1,
    onLine,
    onEnd,
  }: {
    rate?: number
    onLine?: (index: number) => void
    onEnd?: () => void
  } = {},
): () => void {
  let stopped = false
  const play = (index: number) => {
    if (stopped) return
    if (index >= lines.length) {
      onEnd?.()
      return
    }
    onLine?.(index)
    const started = speakKorean(lines[index].text, {
      rate,
      pitch: lines[index].pitch,
      onEnd: () => play(index + 1),
    })
    if (!started) onEnd?.()
  }
  play(0)
  return () => {
    stopped = true
    stopSpeaking()
  }
}
