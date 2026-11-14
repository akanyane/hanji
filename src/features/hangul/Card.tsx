import { useState } from 'react'
import { CATEGORY_LABELS, type HangulEntry } from '../../content/hangul'

interface CardProps {
  entry: HangulEntry
}

export function Card({ entry }: CardProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={revealed}
      aria-label={`${entry.hangul}, ${CATEGORY_LABELS[entry.category]}. ${revealed ? 'Ocultar' : 'Mostrar'} romanização`}
      onClick={() => setRevealed((current) => !current)}
      className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white p-2 shadow transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <span
        lang="ko"
        className="text-4xl font-semibold text-slate-900 sm:text-5xl dark:text-slate-50"
      >
        {entry.hangul}
      </span>
      {revealed && (
        <span className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300">
          <span className="text-lg font-medium">
            {entry.romanization || '(muda)'}
          </span>
          <span className="text-xs uppercase tracking-wide">
            {CATEGORY_LABELS[entry.category]}
          </span>
          {entry.notes && (
            <span className="max-w-[18ch] text-center text-xs text-slate-500 dark:text-slate-400">
              {entry.notes}
            </span>
          )}
        </span>
      )}
    </button>
  )
}
