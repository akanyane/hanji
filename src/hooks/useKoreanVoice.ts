import { useEffect, useState } from 'react'
import { findKoreanVoice, isSpeechSynthesisSupported } from '../services/speech'

export type VoiceStatus = 'unsupported' | 'no-korean-voice' | 'ready'

function currentStatus(): VoiceStatus {
  if (!isSpeechSynthesisSupported()) return 'unsupported'
  return findKoreanVoice(window.speechSynthesis.getVoices())
    ? 'ready'
    : 'no-korean-voice'
}

/** Tracks whether a Korean voice is available (voices load asynchronously). */
export function useKoreanVoice(): VoiceStatus {
  const [status, setStatus] = useState(currentStatus)

  useEffect(() => {
    if (!isSpeechSynthesisSupported()) return
    const update = () => setStatus(currentStatus())
    window.speechSynthesis.addEventListener('voiceschanged', update)
    update()
    return () =>
      window.speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  return status
}
