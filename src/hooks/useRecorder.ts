import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isRecordingSupported,
  type Recording,
  startRecording,
} from '../services/recorder'

/** Records the learner's voice locally and exposes a playable URL. */
export function useRecorder() {
  const [supported] = useState(isRecordingSupported)
  const [recording, setRecording] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const current = useRef<Recording | null>(null)

  // Free the blob when it is replaced or the component unmounts.
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url],
  )
  useEffect(() => () => current.current?.cancel(), [])

  const start = useCallback(async () => {
    setError(false)
    try {
      current.current = await startRecording()
      setRecording(true)
    } catch {
      setError(true)
    }
  }, [])

  const stop = useCallback(async () => {
    const rec = current.current
    current.current = null
    setRecording(false)
    if (rec) setUrl(await rec.stop())
  }, [])

  return { supported, recording, url, error, start, stop }
}
