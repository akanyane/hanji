import { useMemo } from 'react'
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
  const toLatin = direction === 'to-latin'
  const result = useMemo(
    () =>
      toLatin
        ? {
            output: romanize(text, { keepHAfterObstruent: keepH }),
            unrecognized: [],
          }
        : (({ hangul, unrecognized }) => ({ output: hangul, unrecognized }))(
            romanizationToHangul(text),
          ),
    [text, toLatin, keepH],
  )
  const hangulText = toLatin ? text : result.output

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Direção da conversão</legend>
        <Chip selected={toLatin} onClick={() => onDirectionChange('to-latin')}>
          Hangul → Latino
        </Chip>
        <Chip
          selected={!toLatin}
          onClick={() => onDirectionChange('to-hangul')}
        >
          Latino → Hangul
        </Chip>
      </fieldset>

      <TextField
        label={toLatin ? 'Texto em hangul' : 'Texto romanizado'}
        value={text}
        onChange={onTextChange}
        placeholder={toLatin ? 'Ex.: 안녕하세요' : 'Ex.: annyeonghaseyo'}
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
          <span>
            É um substantivo: manter o <strong>h</strong> depois de ㄱ, ㄷ, ㅂ,
            como manda a regra oficial (<span lang="ko">묵호</span> → Mukho, em
            vez de Muko).
          </span>
        </label>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A conversão é aproximada: a romanização representa a pronúncia, então
          "silla" vira <span lang="ko">실라</span> (e não{' '}
          <span lang="ko">신라</span>). Use hífen para separar sílabas ambíguas:
          "jung-ang" → <span lang="ko">중앙</span>.
        </p>
      )}

      <section
        aria-live="polite"
        aria-label="Resultado"
        className="flex flex-col gap-3 rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resultado
          </p>
          <div className="flex items-center gap-2">
            {hangulText.trim() && <AudioButton text={hangulText} />}
            <CopyButton text={result.output} />
          </div>
        </div>
        <p
          lang={toLatin ? 'en' : 'ko'}
          className="min-h-8 break-words text-2xl"
        >
          {result.output || (
            <span className="text-base text-slate-400">
              O resultado aparece aqui.
            </span>
          )}
        </p>
        {result.unrecognized.length > 0 && (
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Não reconhecido como romanização: {result.unrecognized.join(', ')}
          </p>
        )}
      </section>
    </div>
  )
}
