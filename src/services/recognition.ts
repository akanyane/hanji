// Speech-to-text through the Web Speech API (SpeechRecognition).
//
// Support varies: Chrome, Edge and Safari have it (Chrome sends the audio to
// Google's servers, so it needs a connection); Firefox does not. Callers
// must check `isSpeechRecognitionSupported()` and offer a fallback.

/** Minimal typings: the API is not in TypeScript's DOM library yet. */
interface RecognitionAlternative {
  transcript: string
  confidence: number
}
interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<RecognitionAlternative> & { isFinal: boolean }>
}
interface RecognitionErrorEvent {
  error: string
}
export interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((event: RecognitionResultEvent) => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionConstructor = new () => SpeechRecognitionLike

function getConstructor(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function isSpeechRecognitionSupported(): boolean {
  return getConstructor() !== undefined
}

export interface RecognitionHandlers {
  /** Interim and final transcripts as they arrive. */
  onTranscript: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onEnd?: () => void
}

/** Listens once for Korean speech. Returns a stop function, or null if unsupported. */
export function listenKorean({
  onTranscript,
  onError,
  onEnd,
}: RecognitionHandlers): (() => void) | null {
  const Recognition = getConstructor()
  if (!Recognition) return null
  const recognition = new Recognition()
  recognition.lang = 'ko-KR'
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  recognition.continuous = false
  recognition.onresult = (event) => {
    let text = ''
    let isFinal = false
    for (const result of Array.from(event.results)) {
      text += result[0]?.transcript ?? ''
      isFinal = result.isFinal
    }
    onTranscript(text.trim(), isFinal)
  }
  recognition.onerror = (event) => onError?.(event.error)
  recognition.onend = () => onEnd?.()
  recognition.start()
  return () => recognition.stop()
}
