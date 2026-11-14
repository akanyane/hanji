import { useMemo } from 'react'
import { AudioButton } from '../../components/ui/AudioButton'
import { Chip } from '../../components/ui/Chip'
import { TextField } from '../../components/ui/TextField'
import {
  PRONUNCIATION_EXAMPLES,
  PRONUNCIATION_LIMITATIONS,
  PRONUNCIATION_RULES,
} from '../../content/pronunciation/rules'
import { isSyllable } from '../../lib/hangul'
import { pronounce } from '../../lib/pronunciation/pronounce'
import { romanize } from '../../lib/romanization/romanize'

interface PronunciationToolProps {
  text: string
  onTextChange: (text: string) => void
  onPickExample: (text: string) => void
}

export function PronunciationTool({
  text,
  onTextChange,
  onPickExample,
}: PronunciationToolProps) {
  const result = useMemo(() => pronounce(text), [text])
  const hasHangul = [...text].some(isSyllable)
  const usedRules = [...new Set(result.steps.map((s) => s.rule))]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <TextField
          label="Palavra ou frase em hangul"
          value={text}
          onChange={onTextChange}
          placeholder="Ex.: 국물"
          lang="ko"
        />
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            Exemplos
          </legend>
          {PRONUNCIATION_EXAMPLES.map((example) => (
            <Chip
              key={example}
              selected={text === example}
              onClick={() => onPickExample(example)}
            >
              <span lang="ko">{example}</span>
            </Chip>
          ))}
        </fieldset>
      </div>

      <section aria-live="polite" className="flex flex-col gap-4">
        {!hasHangul ? (
          <p className="text-slate-500 dark:text-slate-400">
            Digite algo em hangul para ver como se pronuncia.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pronúncia
                </p>
                <p
                  lang="ko"
                  className="break-words text-3xl font-semibold sm:text-4xl"
                >
                  [{result.pronunciation}]
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {romanize(text)}
                </p>
              </div>
              <AudioButton text={text} />
            </div>

            {result.steps.length === 0 ? (
              <p>
                Nenhuma mudança de som: aqui se pronuncia exatamente como se
                escreve.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Passo a passo</h2>
                <ol className="flex flex-col gap-2">
                  {result.steps.map((step, i) => {
                    const info = PRONUNCIATION_RULES[step.rule]
                    return (
                      <li
                        key={`${step.index}:${step.before}:${step.after}`}
                        className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                      >
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {i + 1}.
                        </span>
                        <span lang="ko" className="text-lg">
                          {step.before} → {step.after}
                        </span>
                        <span className="text-sm font-medium text-sky-800 dark:text-sky-300">
                          {info.name} (<span lang="ko">{info.korean}</span>)
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )}

            {usedRules.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Regras usadas</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {usedRules.map((rule) => {
                    const info = PRONUNCIATION_RULES[rule]
                    return (
                      <div
                        key={rule}
                        className="rounded-lg border border-slate-200 bg-slate-100/60 p-3 dark:border-slate-700 dark:bg-slate-800/60"
                      >
                        <dt className="font-semibold">
                          {info.name} <span lang="ko">({info.korean})</span>
                        </dt>
                        <dd className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {info.summary}{' '}
                          <span lang="ko" className="whitespace-nowrap">
                            Ex.: {info.example[0]} → [{info.example[1]}]
                          </span>
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )}
          </>
        )}
      </section>

      <details className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
        <summary className="cursor-pointer font-medium">
          O que a ferramenta não detecta
        </summary>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          As regras são aplicadas automaticamente a partir da escrita. Alguns
          casos dependem do significado da palavra e não são detectados:
        </p>
        <ul className="mt-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          {PRONUNCIATION_LIMITATIONS.map(([description, example]) => (
            <li key={description}>
              {description}: <span lang="ko">{example}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
