import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { spring } from '../../components/motion/presets'
import { RecorderPanel } from '../../components/speech/RecorderPanel'
import { Button } from '../../components/ui/Button'
import { SpeedControl } from '../../components/ui/SpeedControl'
import {
  PRACTICE_SENTENCES,
  type PracticeSentence,
} from '../../content/pronunciation/practice'
import { useKoreanVoice } from '../../hooks/useKoreanVoice'
import { useLocalized } from '../../i18n/useLocalized'
import { speakKorean, stopSpeaking } from '../../services/speech'
import { useSettings } from '../../stores/settings'

/** Pause between loop repetitions, so the learner can repeat. */
const LOOP_GAP_MS = 1200

export function Shadowing({
  sentences = PRACTICE_SENTENCES,
}: {
  sentences?: PracticeSentence[]
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const rate = useSettings((s) => s.speechRate)
  const voice = useKoreanVoice()
  const [index, setIndex] = useState(0)
  const [showText, setShowText] = useState(true)
  const [looping, setLooping] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const current = sentences[index]

  // Stop audio and pending loops when the sentence changes or on unmount.
  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      stopSpeaking()
    },
    [],
  )

  useEffect(() => {
    if (!looping) return
    let cancelled = false
    const loop = () => {
      if (cancelled) return
      setSpeaking(true)
      speakKorean(current.ko, {
        rate,
        onEnd: () => {
          setSpeaking(false)
          if (!cancelled) timer.current = window.setTimeout(loop, LOOP_GAP_MS)
        },
      })
    }
    loop()
    return () => {
      cancelled = true
      window.clearTimeout(timer.current)
      stopSpeaking()
      setSpeaking(false)
    }
  }, [looping, current, rate])

  const playOnce = () => {
    setSpeaking(true)
    speakKorean(current.ko, { rate, onEnd: () => setSpeaking(false) })
  }

  const go = (delta: number) => {
    setLooping(false)
    setIndex((i) => (i + delta + sentences.length) % sentences.length)
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <p className="text-ink-600 dark:text-ink-300">
        {t('speaking.shadowing.description')}
      </p>
      <SpeedControl />
      {voice === 'unsupported' && (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t('listening.unsupported')}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: speaking ? 1.02 : 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={spring}
          className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl panel-seal p-6 text-center text-white shadow-lift"
        >
          <p lang={showText ? 'ko' : undefined} className="text-3xl font-bold">
            {showText ? current.ko : '♪ ♪ ♪'}
          </p>
          {showText && (
            <p className="text-white/85">{l(current.translation)}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="secondary" onClick={() => go(-1)}>
          ← {t('speaking.shadowing.previous')}
        </Button>
        <Button
          onClick={playOnce}
          disabled={voice === 'unsupported' || looping}
        >
          ▶ {t('speaking.shadowing.play')}
        </Button>
        <Button
          variant={looping ? 'primary' : 'secondary'}
          onClick={() => setLooping((v) => !v)}
          aria-pressed={looping}
          disabled={voice === 'unsupported'}
        >
          {t('speaking.shadowing.loop')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowText((v) => !v)}
          aria-pressed={!showText}
        >
          {showText
            ? t('speaking.shadowing.hideText')
            : t('speaking.shadowing.showText')}
        </Button>
        <Button variant="secondary" onClick={() => go(1)}>
          {t('speaking.shadowing.next')} →
        </Button>
      </div>
      <p className="text-center text-sm text-ink-500 dark:text-ink-400">
        {t('speaking.shadowing.position', {
          current: index + 1,
          total: sentences.length,
        })}
      </p>

      <RecorderPanel key={index} />
    </div>
  )
}
