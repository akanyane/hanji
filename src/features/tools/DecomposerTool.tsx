import { useMemo } from 'react'
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

function JamoLine({ label, jamo }: { label: string; jamo: string }) {
  const parts = splitCompound(jamo)
  const name = jamo ? jamoName(jamo) : undefined
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd lang="ko" className="text-right">
        {jamo ? (
          <>
            <span className="text-lg font-semibold">{jamo}</span>
            {parts.length > 1 && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {' '}
                ({parts.join(' + ')})
              </span>
            )}
            {name && (
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {name}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="text-slate-400" aria-hidden="true">
              —
            </span>
            <span className="sr-only">nenhum</span>
          </>
        )}
      </dd>
    </div>
  )
}

export function DecomposerTool({ text, onTextChange }: DecomposerToolProps) {
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
        label="Texto em hangul"
        value={text}
        onChange={onTextChange}
        placeholder="Ex.: 한국어"
        lang="ko"
        hint="Mostra a consoante inicial, a vogal e o batchim de cada sílaba."
      />

      {shown.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map(({ char, position }) => {
            const syllable = decompose(char)
            const code = `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`
            return (
              <li
                key={position}
                className="flex flex-col gap-2 rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-baseline justify-between">
                  <span lang="ko" className="text-4xl font-semibold">
                    {char}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {code}
                  </span>
                </div>
                {syllable ? (
                  <dl className="flex flex-col gap-1">
                    <JamoLine label="Inicial" jamo={syllable.initial} />
                    <JamoLine label="Vogal" jamo={syllable.medial} />
                    <JamoLine label="Batchim" jamo={syllable.final} />
                  </dl>
                ) : isConsonant(char) || isMedial(char) ? (
                  <dl>
                    <JamoLine
                      label={isMedial(char) ? 'Vogal' : 'Consoante'}
                      jamo={char}
                    />
                  </dl>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Não é hangul.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {chars.length > MAX_CHARS && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mostrando os primeiros {MAX_CHARS} de {chars.length} caracteres.
        </p>
      )}
    </div>
  )
}
