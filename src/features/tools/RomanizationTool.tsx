import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AudioButton } from '../../components/ui/AudioButton'
import { Chip } from '../../components/ui/Chip'
import { CopyButton } from '../../components/ui/CopyButton'
import { TextField } from '../../components/ui/TextField'
import { romanize } from '../../lib/romanization/romanize'
import { romanizationToHangul } from '../../lib/romanization/toHangul'

export type RomanizationDirection = 'to-latin' | 'to-hangul'

interface RomanizationToolProps {
  text: string
  direction: RomanizationDirection
  keepH: boolean
  onTextChange: (text: string) => void
  onDirectionChange: (direction: RomanizationDirection) => void
  onKeepHChange: (keepH: boolean) => void
}

export function RomanizationTool({
  text,
  direction,
  keepH,
  onTextChange,
  onDirectionChange,
  onKeepHChange,
}: RomanizationToolProps) {
  const { t } = useTranslation()
  const toLatin = direction === 'to-latin'
  const result = useMemo(() => {
    if (toLatin)
      return {
        output: romanize(text, { keepHAfterObstruent: keepH }),
        unrecognized: [],
      }
    const { hangul, unrecognized } = romanizationToHangul(text)
    return { output: hangul, unrecognized }
  }, [text, toLatin, keepH])
  const hangulText = toLatin ? text : result.output

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('tools.romanization.direction')}</legend>
        <Chip selected={toLatin} onClick={() => onDirectionChange('to-latin')}>
          {t('tools.romanization.toLatin')}
        </Chip>
        <Chip
          selected={!toLatin}
          onClick={() => onDirectionChange('to-hangul')}
        >
          {t('tools.romanization.toHangul')}
        </Chip>
      </fieldset>

      <TextField
        label={
          toLatin
            ? t('tools.romanization.hangulLabel')
            : t('tools.romanization.latinLabel')
        }
        value={text}
        onChange={onTextChange}
        placeholder={
          toLatin
            ? t('tools.romanization.hangulPlaceholder')
            : t('tools.romanization.latinPlaceholder')
        }
        lang={toLatin ? 'ko' : 'en'}
      />

      {toLatin ? (
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={keepH}
            onChange={(e) => onKeepHChange(e.target.checked)}
            className="mt-1"
          />
          <span>{t('tools.romanization.keepH')}</span>
        </label>
      ) : (
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('tools.romanization.approximate')}
        </p>
      )}

      <section
        aria-live="polite"
        aria-label={t('common.result')}
        className="flex flex-col gap-3 rounded-lg panel-paper p-5 dark:from-ink-800 dark:to-ink-800/50"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {t('common.result')}
          </p>
          <div className="flex items-center gap-2">
            {hangulText.trim() && <AudioButton text={hangulText} />}
            <CopyButton text={result.output} />
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={result.output === '' ? 'empty' : 'filled'}
            lang={toLatin ? 'en' : 'ko'}
            className="min-h-8 text-2xl break-words"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {result.output || (
              <span className="text-base text-ink-500">
                {t('common.resultPlaceholder')}
              </span>
            )}
          </motion.p>
        </AnimatePresence>
        {result.unrecognized.length > 0 && (
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {t('tools.romanization.unrecognized', {
              words: result.unrecognized.join(', '),
            })}
          </p>
        )}
      </section>
    </div>
  )
}
