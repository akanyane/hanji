import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { spring } from '../../components/motion/presets'
import type { StudyMode } from '../../db/types'
import { cn } from '../../lib/cn'

export const STUDY_MODES: StudyMode[] = [
  'flashcards',
  'choice',
  'typing',
  'listening',
]
const ICON: Record<StudyMode, string> = {
  flashcards: '🃏',
  choice: '✅',
  typing: '⌨️',
  listening: '🎧',
}

export function ModePicker({
  mode,
  onChange,
}: {
  mode: StudyMode
  onChange: (mode: StudyMode) => void
}) {
  const { t } = useTranslation()
  return (
    <fieldset className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <legend className="mb-2 text-sm font-semibold">
        {t('vocabulary.dashboard.mode')}
      </legend>
      {STUDY_MODES.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => onChange(m)}
          title={t(`vocabulary.modes.${m}.description`)}
          className={cn(
            'relative flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-sm font-medium transition-colors',
            mode === m
              ? 'border-transparent text-white'
              : 'border-slate-200 bg-white hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800',
          )}
        >
          {mode === m && (
            <motion.span
              layoutId="study-mode-pill"
              transition={spring}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600"
            />
          )}
          <span className="relative text-2xl" aria-hidden="true">
            {ICON[m]}
          </span>
          <span className="relative">{t(`vocabulary.modes.${m}.title`)}</span>
        </button>
      ))}
    </fieldset>
  )
}
