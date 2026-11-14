import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { cn } from '../../lib/cn'
import { speakKorean, stopSpeaking } from '../../services/speech'
import { useSettings } from '../../stores/settings'

interface AudioButtonProps {
  text: string
  /** Accessible label; defaults to "Listen to <text>". */
  label?: string
  className?: string
}

/** Plays Korean text with the browser's speech synthesis. */
export function AudioButton({ text, label, className }: AudioButtonProps) {
  const { t } = useTranslation()
  const status = useKoreanVoice()
  const rate = useSettings((s) => s.speechRate)
  const [speaking, setSpeaking] = useState(false)

  // Stop the audio if the button disappears mid-sentence.
  useEffect(() => () => stopSpeaking(), [])

  const unsupported = status === 'unsupported'
  const hint = unsupported
    ? t('audio.unsupported')
    : status === 'no-korean-voice'
      ? t('audio.noKoreanVoice')
      : undefined

  const play = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    if (speakKorean(text, { rate, onEnd: () => setSpeaking(false) }))
      setSpeaking(true)
  }

  return (
    <motion.button
      type="button"
      onClick={play}
      disabled={unsupported || text.trim() === ''}
      aria-label={label ?? t('audio.listen', { text })}
      aria-pressed={speaking}
      title={hint}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
    >
      {/* Pulsing ring while speaking */}
      {speaking && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-sky-400"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
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
    </motion.button>
  )
}
