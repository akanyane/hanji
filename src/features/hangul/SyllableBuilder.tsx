import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { spring } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import {
  compose,
  FINALS,
  INITIALS,
  MEDIALS,
  vowelOrientation,
} from '../../lib/hangul'
import { pronounce } from '../../lib/pronunciation/pronounce'
import { romanize } from '../../lib/romanization/romanize'

export interface SyllableParts {
  initial: string
  medial: string
  final: string
}

interface SyllableBuilderProps extends SyllableParts {
  onChange: (parts: SyllableParts) => void
}

const ROLE_STYLE = {
  initial: 'bg-pine-500 text-white',
  medial: 'bg-seal-500 text-white',
  final: 'bg-amber-500 text-white',
} as const

function JamoPicker({
  legend,
  options,
  value,
  part,
  onPick,
  noneLabel,
}: {
  legend: string
  options: readonly string[]
  value: string
  part: keyof typeof ROLE_STYLE
  onPick: (jamo: string) => void
  noneLabel?: string
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((jamo) => {
          const selected = jamo === value
          return (
            <motion.button
              key={jamo || 'none'}
              type="button"
              lang={jamo ? 'ko' : undefined}
              aria-pressed={selected}
              onClick={() => onPick(jamo)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'relative min-w-10 rounded-lg px-2 py-1.5 text-lg font-medium',
                selected
                  ? ''
                  : 'border border-ink-200 bg-white dark:border-ink-800 hover:bg-ink-100 dark:bg-ink-900 dark:hover:bg-ink-700',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`picker-${part}`}
                  transition={spring}
                  className={cn(
                    'absolute inset-0 rounded-lg',
                    ROLE_STYLE[part],
                  )}
                />
              )}
              <span
                className={cn(
                  'relative',
                  selected && 'text-white',
                  !jamo && 'text-sm',
                )}
              >
                {jamo || noneLabel}
              </span>
            </motion.button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Shows where each jamo sits inside the block for this vowel shape. */
function LayoutDiagram({ initial, medial, final }: SyllableParts) {
  const orientation = vowelOrientation(medial)
  const cell = (part: keyof typeof ROLE_STYLE, jamo: string, area: string) => (
    <motion.span
      layout
      key={part}
      lang="ko"
      transition={spring}
      style={{ gridArea: area }}
      className={cn(
        'flex items-center justify-center rounded-md text-xl font-bold',
        ROLE_STYLE[part],
      )}
    >
      {jamo}
    </motion.span>
  )

  // Grid templates: i = initial, m = medial, f = final.
  const template =
    orientation === 'vertical'
      ? final
        ? '"i m" "f f"'
        : '"i m" "i m"'
      : orientation === 'horizontal'
        ? final
          ? '"i i" "m m" "f f"'
          : '"i i" "m m"'
        : final
          ? '"i m" "h m" "f f"'
          : '"i m" "h m"'

  return (
    <LayoutGroup>
      <motion.div
        layout
        aria-hidden="true"
        className="grid h-36 w-36 gap-1 rounded-xl border-2 border-dashed border-ink-300 p-1.5 dark:border-ink-600"
        style={{ gridTemplateAreas: template }}
        transition={spring}
      >
        {cell('initial', initial, 'i')}
        {orientation === 'mixed' ? (
          <>
            {/* A compound vowel wraps around: horizontal part below, vertical part on the right. */}
            <motion.span
              layout
              transition={spring}
              style={{ gridArea: 'h' }}
              className={cn(
                'flex items-center justify-center rounded-md text-sm font-bold',
                ROLE_STYLE.medial,
              )}
            >
              ↘
            </motion.span>
            {cell('medial', medial, 'm')}
          </>
        ) : (
          cell('medial', medial, 'm')
        )}
        {final && cell('final', final, 'f')}
      </motion.div>
    </LayoutGroup>
  )
}

export function SyllableBuilder({
  initial,
  medial,
  final,
  onChange,
}: SyllableBuilderProps) {
  const { t } = useTranslation()
  const syllable = compose(initial, medial, final) ?? ''
  const orientation = vowelOrientation(medial)
  const { pronunciation } = pronounce(syllable)

  const randomize = () => {
    const pick = <T,>(list: readonly T[]) =>
      list[Math.floor(Math.random() * list.length)]
    // Half the time without a final, since open syllables are the most common.
    onChange({
      initial: pick(INITIALS),
      medial: pick(MEDIALS),
      final: Math.random() < 0.5 ? '' : pick(FINALS),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-ink-600 dark:text-ink-300">
        {t('hangul.builder.description')}
      </p>

      <div className="flex flex-col items-center gap-6 rounded-lg panel-paper p-6 sm:flex-row sm:justify-center dark:from-ink-800 dark:to-ink-800/50">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-lg bg-white shadow-paper dark:bg-ink-900">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={syllable}
              lang="ko"
              className="text-8xl font-bold"
              initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              aria-live="polite"
            >
              {syllable}
            </motion.span>
          </AnimatePresence>
        </div>
        <LayoutDiagram initial={initial} medial={medial} final={final} />
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <AudioButton text={syllable} className="h-12 w-12" />
          <p>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              {t('hangul.builder.pronunciation')}:{' '}
            </span>
            <span lang="ko" className="text-lg font-semibold">
              [{pronunciation}]
            </span>
          </p>
          <p>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              {t('hangul.builder.romanization')}:{' '}
            </span>
            <span className="text-lg font-semibold">{romanize(syllable)}</span>
          </p>
          <Button
            variant="secondary"
            className="px-3 py-1 text-sm"
            onClick={randomize}
          >
            {t('hangul.builder.random')}
          </Button>
        </div>
      </div>

      {orientation && (
        <ul className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-300">
          <li>• {t(`hangul.builder.layout.${orientation}`)}</li>
          {final && <li>• {t('hangul.builder.layout.final')}</li>}
        </ul>
      )}

      <JamoPicker
        legend={t('hangul.builder.initial')}
        options={INITIALS}
        value={initial}
        part="initial"
        onPick={(j) => onChange({ initial: j, medial, final })}
      />
      <JamoPicker
        legend={t('hangul.builder.medial')}
        options={MEDIALS}
        value={medial}
        part="medial"
        onPick={(j) => onChange({ initial, medial: j, final })}
      />
      <JamoPicker
        legend={t('hangul.builder.final')}
        options={FINALS}
        value={final}
        part="final"
        noneLabel={t('hangul.builder.noFinal')}
        onPick={(j) => onChange({ initial, medial, final: j })}
      />
    </div>
  )
}
