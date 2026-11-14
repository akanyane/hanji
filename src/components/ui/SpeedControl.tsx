import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  settingsActions,
  useSettings,
} from '../../stores/settings'

/** Global speech-rate slider (saved in settings, used by every audio button). */
export function SpeedControl() {
  const { t } = useTranslation()
  const rate = useSettings((s) => s.speechRate)
  const id = useId()
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 px-4 py-2 shadow-paper dark:bg-ink-900">
      <label htmlFor={id} className="text-sm font-medium">
        {t('common.speed')}
      </label>
      <input
        id={id}
        type="range"
        min={SPEECH_RATE_MIN}
        max={SPEECH_RATE_MAX}
        step={0.1}
        value={rate}
        onChange={(e) => settingsActions.setSpeechRate(Number(e.target.value))}
        className="w-32 accent-pine-600"
      />
      <output htmlFor={id} className="w-10 text-sm tabular-nums">
        {rate.toFixed(1)}×
      </output>
    </div>
  )
}
