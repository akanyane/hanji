import { useEffect, useState } from 'react'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { cn } from '../../lib/cn'
import { speakKorean, stopSpeaking } from '../../services/speech'
import { useSettings } from '../../stores/settings'

interface AudioButtonProps {
  text: string
  /** Accessible label; defaults to "Ouvir <text>". */
  label?: string
  className?: string
}

/** Plays Korean text with the browser's speech synthesis. */
export function AudioButton({ text, label, className }: AudioButtonProps) {
  const status = useKoreanVoice()
  const rate = useSettings((s) => s.speechRate)
  const [speaking, setSpeaking] = useState(false)

  // Stop the audio if the button disappears mid-sentence.
  useEffect(() => () => stopSpeaking(), [])

  const unsupported = status === 'unsupported'
  const hint = unsupported
    ? 'Seu navegador não tem síntese de voz.'
    : status === 'no-korean-voice'
      ? 'Nenhuma voz em coreano instalada: o navegador pode usar outra voz.'
      : undefined

  const play = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    if (speakKorean(text, { rate, onEnd: () => setSpeaking(false) })) {
      setSpeaking(true)
    }
  }

  return (
    <button
      type="button"
      onClick={play}
      disabled={unsupported || text.trim() === ''}
      aria-label={label ?? `Ouvir ${text}`}
      aria-pressed={speaking}
      title={hint}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sky-900 dark:text-sky-100 dark:hover:bg-sky-800',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        {speaking ? (
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
        ) : (
          <path d="M11 5 6 9H3v6h3l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7l-1.4-1.4a3 3 0 0 0 0-4.2l1.4-1.4Zm2.8-2.8a9 9 0 0 1 0 12.6l-1.4-1.4a7 7 0 0 0 0-9.8l1.4-1.4Z" />
        )}
      </svg>
    </button>
  )
}
