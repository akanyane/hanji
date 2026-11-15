import { motion } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { DUBEOLSIK_LAYOUT } from '../../lib/ime/dubeolsik'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
/** Keys whose shifted jamo differs (tense consonants and ㅒ/ㅖ). */
const SHIFTABLE = new Set(['q', 'w', 'e', 'r', 't', 'o', 'p'])
const VOWEL_KEYS = new Set('yuiophjklbnm')

interface HangulKeyboardProps {
  onJamo: (jamo: string) => void
  onBackspace: () => void
  onSpace?: () => void
  /** Key to highlight as the next one to press (e.g. "r" or "R"). */
  highlight?: string
}

/** On-screen 2-set (두벌식) keyboard: consonants on the left, vowels on the right. */
export function HangulKeyboard({
  onJamo,
  onBackspace,
  onSpace,
  highlight,
}: HangulKeyboardProps) {
  const { t } = useTranslation()
  const [shift, setShift] = useState(false)
  const highlightShift =
    highlight !== undefined && highlight !== highlight.toLowerCase()

  const press = (key: string) => {
    const k = shift && SHIFTABLE.has(key) ? key.toUpperCase() : key
    onJamo(DUBEOLSIK_LAYOUT[k])
    setShift(false)
  }

  return (
    <fieldset className="flex flex-col items-center gap-1.5 rounded-lg bg-ink-200 p-2 select-none dark:bg-ink-800">
      <legend className="sr-only">두벌식</legend>
      {ROWS.map((row, r) => (
        <div key={row} className="flex gap-1.5" style={{ paddingLeft: r * 14 }}>
          {r === 2 && (
            <button
              type="button"
              aria-pressed={shift}
              onClick={() => setShift((s) => !s)}
              className={cn(
                'h-11 rounded-lg px-2 text-xs font-semibold shadow-paper sm:h-12',
                shift
                  ? 'bg-pine-600 text-white'
                  : highlightShift
                    ? 'bg-amber-300 dark:bg-amber-600'
                    : 'bg-white dark:bg-ink-700',
              )}
            >
              ⇧ {t('writing.keyboard.shift')}
            </button>
          )}
          {[...row].map((key) => {
            const shown =
              shift && SHIFTABLE.has(key)
                ? DUBEOLSIK_LAYOUT[key.toUpperCase()]
                : DUBEOLSIK_LAYOUT[key]
            const isNext = highlight?.toLowerCase() === key
            return (
              <motion.button
                key={key}
                type="button"
                lang="ko"
                onClick={() => press(key)}
                whileTap={{ scale: 0.85, y: 2 }}
                animate={isNext ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={
                  isNext
                    ? { duration: 0.9, repeat: Number.POSITIVE_INFINITY }
                    : undefined
                }
                aria-label={shown}
                className={cn(
                  'flex h-11 w-8 flex-col items-center justify-center rounded-lg text-lg font-semibold shadow-paper sm:h-12 sm:w-11',
                  isNext
                    ? 'bg-amber-300 text-ink-900 ring-2 ring-amber-500 dark:bg-amber-500'
                    : VOWEL_KEYS.has(key)
                      ? 'bg-seal-50 dark:bg-seal-950/70'
                      : 'bg-white dark:bg-ink-700',
                )}
              >
                {shown}
                <span
                  className="text-[9px] font-normal text-ink-500 uppercase"
                  aria-hidden="true"
                >
                  {key}
                </span>
              </motion.button>
            )
          })}
          {r === 2 && (
            <button
              type="button"
              onClick={onBackspace}
              className="h-11 rounded-lg bg-white px-2 text-xs font-semibold shadow-paper sm:h-12 dark:bg-ink-700"
            >
              ⌫ {t('writing.keyboard.backspace')}
            </button>
          )}
        </div>
      ))}
      {onSpace && (
        <button
          type="button"
          onClick={onSpace}
          className="h-10 w-1/2 rounded-lg bg-white text-xs font-semibold shadow-paper dark:bg-ink-700"
        >
          {t('writing.keyboard.space')}
        </button>
      )}
    </fieldset>
  )
}
