import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isSpeechRecognitionSupported,
  listenKorean,
} from '../services/recognition'

export type RecognitionStatus = 'idle' | 'listening' | 'done' | 'error'

/** One-shot Korean speech recognition with live transcript. */
export function useSpeechRecognition() {
  const [supported] = useState(isSpeechRecognitionSupported)
  const [status, setStatus] = useState<RecognitionStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => () => stopRef.current?.(), [])

  const start = useCallback(() => {
    setTranscript('')
    setError(null)
    setStatus('listening')
    stopRef.current = listenKorean({
      onTranscript: (text) => setTranscript(text),
      onError: (e) => {
        setError(e)
        setStatus('error')
      },
      onEnd: () => setStatus((s) => (s === 'listening' ? 'done' : s)),
    })
    if (!stopRef.current) setStatus('error')
  }, [])

  const stop = useCallback(() => stopRef.current?.(), [])

  const reset = useCallback(() => {
    stopRef.current?.()
    setTranscript('')
    setError(null)
    setStatus('idle')
  }, [])

  return { supported, status, transcript, error, start, stop, reset }
}
