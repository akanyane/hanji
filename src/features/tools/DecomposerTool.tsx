import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { spring } from '../../components/motion/presets'
import { TextField } from '../../components/ui/TextField'
import { jamoName } from '../../content/hangul/jamoNames'
import {
  decompose,
  isConsonant,
  isMedial,
  splitCompound,
} from '../../lib/hangul'

/** Large inputs would render thousands of cards; show the first ones only. */
const MAX_CHARS = 60

interface DecomposerToolProps {
  text: string
  onTextChange: (text: string) => void
}

const ROLE_COLOR = {
  initial: 'text-pine-600 dark:text-pine-400',
  medial: 'text-seal-600 dark:text-seal-400',
  final: 'text-amber-600 dark:text-amber-400',
} as const

function JamoLine({
  label,
  jamo,
  part,
}: {
  label: string
  jamo: string
  part: keyof typeof ROLE_COLOR
}) {
  const { t } = useTranslation()
  const parts = splitCompound(jamo)
  const name = jamo ? jamoName(jamo) : undefined
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-xs tracking-wide text-ink-500 uppercase dark:text-ink-400">
        {label}
      </dt>
      <dd lang="ko" className="text-right">
        {jamo ? (
          <>
            <span className={`text-lg font-semibold ${ROLE_COLOR[part]}`}>
              {jamo}
            </span>
            {parts.length > 1 && (
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {' '}
                ({parts.join(' + ')})
              </span>
            )}
            {name && (
              <span className="block text-xs text-ink-500 dark:text-ink-400">
                {name}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="text-ink-500" aria-hidden="true">
              —
            </span>
            <span className="sr-only">{t('common.none')}</span>
          </>
        )}
      </dd>
    </div>
  )
}

export function DecomposerTool({ text, onTextChange }: DecomposerToolProps) {
  const { t } = useTranslation()
  // Keep each character's position in the input: it is a stable key even
  // when the same character repeats.
  const chars = useMemo(
    () =>
      [...text]
        .map((char, position) => ({ char, position }))
        .filter(({ char }) => char.trim() !== ''),
    [text],
  )
  const shown = chars.slice(0, MAX_CHARS)

  return (
    <div className="flex flex-col gap-5">
      <TextField
        label={t('tools.decomposer.inputLabel')}
        value={text}
        onChange={onTextChange}
        placeholder={t('tools.decomposer.placeholder')}
        lang="ko"
        hint={t('tools.decomposer.hint')}
      />

      {shown.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map(({ char, position }) => {
              const syllable = decompose(char)
              const code = `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`
              return (
                <motion.li
                  key={`${position}-${char}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={spring}
                  className="flex flex-col gap-2 rounded-lg border border-ink-300 bg-white p-3 dark:border-ink-700 dark:bg-ink-900"
                >
                  <div className="flex items-baseline justify-between">
                    <span lang="ko" className="text-4xl font-semibold">
                      {char}
                    </span>
                    <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
                      {code}
                    </span>
                  </div>
                  {syllable ? (
                    <dl className="flex flex-col gap-1">
                      <JamoLine
                        label={t('tools.decomposer.initial')}
                        jamo={syllable.initial}
                        part="initial"
                      />
                      <JamoLine
                        label={t('tools.decomposer.medial')}
                        jamo={syllable.medial}
                        part="medial"
                      />
                      <JamoLine
                        label={t('tools.decomposer.final')}
                        jamo={syllable.final}
                        part="final"
                      />
                    </dl>
                  ) : isConsonant(char) || isMedial(char) ? (
                    <dl>
                      <JamoLine
                        label={
                          isMedial(char)
                            ? t('tools.decomposer.medial')
                            : t('tools.decomposer.consonant')
                        }
                        jamo={char}
                        part={isMedial(char) ? 'medial' : 'initial'}
                      />
                    </dl>
                  ) : (
                    <p className="text-sm text-ink-500 dark:text-ink-400">
                      {t('tools.decomposer.notHangul')}
                    </p>
                  )}
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
      {chars.length > MAX_CHARS && (
        <p className="text-sm text-ink-500 dark:text-ink-400">
          {t('tools.decomposer.truncated', {
            shown: MAX_CHARS,
            total: chars.length,
          })}
        </p>
      )}
    </div>
  )
}
