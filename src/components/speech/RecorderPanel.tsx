import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useRecorder } from '../../hooks/useRecorder'
import { Button } from '../ui/Button'

/** Record your own voice locally and play it back to compare with the model. */
export function RecorderPanel() {
  const { t } = useTranslation()
  const { supported, recording, url, error, start, stop } = useRecorder()

  if (!supported)
    return (
      <p className="text-sm text-ink-500 dark:text-ink-400">
        {t('speaking.recorder.unsupported')}
      </p>
    )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={recording ? 'primary' : 'secondary'}
        onClick={recording ? stop : start}
        aria-pressed={recording}
      >
        {recording ? (
          <>
            <motion.span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-rose-500"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            {t('speaking.recorder.stop')}
          </>
        ) : (
          <>● {t('speaking.recorder.record')}</>
        )}
      </Button>
      {url && !recording && (
        <div className="flex items-center gap-2 text-sm">
          <span aria-hidden="true">{t('speaking.recorder.play')}</span>
          {/* biome-ignore lint/a11y/useMediaCaption: a learner's own voice recording has no captions */}
          <audio
            src={url}
            controls
            aria-label={t('speaking.recorder.play')}
            className="h-9"
          />
        </div>
      )}
      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {t('speaking.recorder.denied')}
        </p>
      )}
    </div>
  )
}
