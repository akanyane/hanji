import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Chip } from '../../components/ui/Chip'
import { TextField } from '../../components/ui/TextField'
import {
  PRONUNCIATION_EXAMPLES,
  PRONUNCIATION_LIMITATIONS,
  PRONUNCIATION_RULES,
} from '../../content/pronunciation/rules'
import { useLocalized } from '../../i18n/useLocalized'
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
  const { t } = useTranslation()
  const l = useLocalized()
  const result = useMemo(() => pronounce(text), [text])
  const hasHangul = [...text].some(isSyllable)
  const usedRules = [...new Set(result.steps.map((s) => s.rule))]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <TextField
          label={t('tools.pronunciation.inputLabel')}
          value={text}
          onChange={onTextChange}
          placeholder={t('tools.pronunciation.placeholder')}
          lang="ko"
        />
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            {t('common.examples')}
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
            {t('tools.pronunciation.empty')}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 p-5 dark:from-slate-800 dark:to-slate-800/50">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('tools.pronunciation.result')}
                </p>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={result.pronunciation}
                    lang="ko"
                    className="text-3xl font-semibold break-words sm:text-4xl"
                    variants={pop}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    [{result.pronunciation}]
                  </motion.p>
                </AnimatePresence>
                <p className="text-slate-600 dark:text-slate-300">
                  {romanize(text)}
                </p>
              </div>
              <AudioButton text={text} className="h-12 w-12" />
            </div>

            {result.steps.length === 0 ? (
              <p>{t('tools.pronunciation.noChanges')}</p>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">
                  {t('tools.pronunciation.steps')}
                </h2>
                <motion.ol
                  key={text}
                  className="flex flex-col gap-2"
                  variants={stagger(0, 0.12)}
                  initial="hidden"
                  animate="visible"
                >
                  {result.steps.map((step, i) => {
                    const info = PRONUNCIATION_RULES[step.rule]
                    return (
                      <motion.li
                        key={`${step.index}:${step.before}:${step.after}`}
                        variants={fadeUp}
                        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl bg-white px-3 py-2 dark:bg-slate-800"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                          {i + 1}
                        </span>
                        <span lang="ko" className="text-lg">
                          {step.before} → <strong>{step.after}</strong>
                        </span>
                        <span className="text-sm font-medium text-sky-800 dark:text-sky-300">
                          {l(info.name)} (<span lang="ko">{info.korean}</span>)
                        </span>
                      </motion.li>
                    )
                  })}
                </motion.ol>
              </div>
            )}

            {usedRules.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">
                  {t('tools.pronunciation.rulesUsed')}
                </h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {usedRules.map((rule) => {
                    const info = PRONUNCIATION_RULES[rule]
                    return (
                      <motion.div
                        key={rule}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="rounded-xl border border-slate-200 bg-slate-100/60 p-3 dark:border-slate-700 dark:bg-slate-800/60"
                      >
                        <dt className="font-semibold">
                          {l(info.name)} <span lang="ko">({info.korean})</span>
                        </dt>
                        <dd className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {l(info.summary)}{' '}
                          <span lang="ko" className="whitespace-nowrap">
                            {t('tools.pronunciation.example')} {info.example[0]}{' '}
                            → [{info.example[1]}]
                          </span>
                        </dd>
                      </motion.div>
                    )
                  })}
                </dl>
              </div>
            )}
          </>
        )}
      </section>

      <details className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
        <summary className="cursor-pointer font-medium">
          {t('tools.pronunciation.limitationsTitle')}
        </summary>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t('tools.pronunciation.limitationsIntro')}
        </p>
        <ul className="mt-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
          {PRONUNCIATION_LIMITATIONS.map(({ description, example }) => (
            <li key={description.en}>
              {l(description)}: <span lang="ko">{l(example)}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
