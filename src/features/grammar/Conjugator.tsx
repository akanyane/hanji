import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { Chip } from '../../components/ui/Chip'
import { TextField } from '../../components/ui/TextField'
import {
  conjugate,
  type FormId,
  type VerbKind,
} from '../../lib/conjugation/conjugate'
import { speakKorean } from '../../services/speech'
import { useSettings } from '../../stores/settings'

export type KindOption = 'auto' | VerbKind

const EXAMPLES = [
  '먹다',
  '가다',
  '하다',
  '듣다',
  '덥다',
  '모르다',
  '살다',
  '바쁘다',
  '파랗다',
  '짓다',
]
const FORMALITIES = ['formal', 'polite', 'casual'] as const
const TENSES = ['present', 'past', 'future'] as const

interface ConjugatorProps {
  verb: string
  kind: KindOption
  regular: boolean
  onVerbChange: (verb: string) => void
  onPickExample: (verb: string) => void
  onKindChange: (kind: KindOption) => void
  onRegularChange: (regular: boolean) => void
}

/** A conjugated form; clicking it reads it aloud. */
function FormCell({ value }: { value?: string }) {
  const rate = useSettings((s) => s.speechRate)
  if (!value) return <span className="text-ink-400">—</span>
  return (
    <button
      type="button"
      lang="ko"
      onClick={() => speakKorean(value, { rate })}
      className="rounded-lg px-1 text-left text-lg font-semibold transition-colors hover:bg-pine-50 hover:text-pine-700 dark:hover:bg-pine-950 dark:hover:text-pine-300"
    >
      {value}
    </button>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-4 shadow-paper dark:bg-ink-900"
    >
      <h3 className="font-semibold">{title}</h3>
      {children}
    </motion.section>
  )
}

export function Conjugator({
  verb,
  kind,
  regular,
  onVerbChange,
  onPickExample,
  onKindChange,
  onRegularChange,
}: ConjugatorProps) {
  const { t } = useTranslation()
  const result = useMemo(
    () =>
      conjugate(verb, {
        kind: kind === 'auto' ? undefined : kind,
        irregular: regular ? 'regular' : undefined,
      }),
    [verb, kind, regular],
  )
  const f = (id: FormId) => result?.forms[id]
  const formLabel = (id: FormId) =>
    t(`grammar.conjugator.forms.${id.replace('.', '_') as 'want'}`)

  const list = (ids: FormId[]) => (
    <dl className="grid gap-2 sm:grid-cols-2">
      {ids.map((id) => (
        <div key={id} className="flex flex-col">
          <dt className="text-xs text-ink-500 dark:text-ink-400">
            {formLabel(id)}
          </dt>
          <dd>
            <FormCell value={f(id)} />
          </dd>
        </div>
      ))}
    </dl>
  )

  return (
    <div className="flex flex-col gap-5">
      <TextField
        label={t('grammar.conjugator.inputLabel')}
        value={verb}
        onChange={onVerbChange}
        placeholder={t('grammar.conjugator.placeholder')}
        lang="ko"
      />
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 text-sm text-ink-500 dark:text-ink-400">
          {t('grammar.conjugator.tryThese')}
        </legend>
        {EXAMPLES.map((ex) => (
          <Chip
            key={ex}
            selected={verb === ex}
            onClick={() => onPickExample(ex)}
          >
            <span lang="ko">{ex}</span>
          </Chip>
        ))}
      </fieldset>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 text-sm text-ink-500 dark:text-ink-400">
          {t('grammar.conjugator.kind')}
        </legend>
        {(['auto', 'verb', 'adjective'] as const).map((k) => (
          <Chip key={k} selected={kind === k} onClick={() => onKindChange(k)}>
            {t(`grammar.conjugator.${k}`)}
          </Chip>
        ))}
      </fieldset>

      {!result ? (
        verb.trim() !== '' && (
          <p
            role="alert"
            className="rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
          >
            {t('grammar.conjugator.invalid')}
          </p>
        )
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${result.info.dictionary}-${result.info.kind}-${result.info.irregular}`}
            className="flex flex-col gap-4"
            variants={stagger(0, 0.06)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={pop}
              className="flex flex-wrap items-center gap-3 rounded-lg panel-ink p-5 text-white shadow-paper"
            >
              <span lang="ko" className="text-4xl font-bold">
                {result.info.dictionary}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                {t(`grammar.conjugator.${result.info.kind}`)} ·{' '}
                {t(`grammar.conjugator.irregular.${result.info.irregular}`)}
              </span>
              <p className="w-full text-sm text-white/90">
                {t(`grammar.conjugator.irregularHelp.${result.info.irregular}`)}
              </p>
            </motion.div>

            {result.notes.length > 0 && (
              <motion.ul variants={fadeUp} className="flex flex-col gap-2">
                {result.notes.map((note) => (
                  <li
                    key={note}
                    className="flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40"
                  >
                    <span
                      aria-hidden="true"
                      lang="ko"
                      className="font-serif text-seal-600 dark:text-seal-400"
                    >
                      참고
                    </span>
                    {t(`grammar.conjugator.notes.${note}`, {
                      verb:
                        note === 'specialHonorific'
                          ? result.honorificVerb
                          : result.negativeVerb,
                    })}
                    {note === 'ambiguousIrregular' && (
                      <label className="ml-auto flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={regular}
                          onChange={(e) => onRegularChange(e.target.checked)}
                        />
                        {t('grammar.conjugator.treatAsRegular')}
                      </label>
                    )}
                  </li>
                ))}
              </motion.ul>
            )}

            <Card title={t('grammar.conjugator.groups.tenses')}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-ink-500 dark:text-ink-400">
                    <tr>
                      <td />
                      {FORMALITIES.map((fm) => (
                        <th
                          key={fm}
                          scope="col"
                          className="pb-2 pr-4 font-medium"
                        >
                          {t(`grammar.conjugator.formality.${fm}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TENSES.map((tense) => (
                      <tr
                        key={tense}
                        className="border-t border-ink-100 dark:border-ink-700"
                      >
                        <th
                          scope="row"
                          className="py-2 pr-4 text-sm font-medium text-ink-500 dark:text-ink-400"
                        >
                          {t(`grammar.conjugator.tense.${tense}`)}
                        </th>
                        {FORMALITIES.map((fm) => (
                          <td key={fm} className="py-2 pr-4">
                            <FormCell value={f(`${tense}.${fm}`)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {result.info.kind === 'verb' && (
                      <tr className="border-t border-ink-100 dark:border-ink-700">
                        <th
                          scope="row"
                          className="py-2 pr-4 text-sm font-medium text-ink-500 dark:text-ink-400"
                        >
                          {t('grammar.conjugator.groups.progressive')}
                        </th>
                        {FORMALITIES.map((fm) => (
                          <td key={fm} className="py-2 pr-4">
                            <FormCell value={f(`progressive.${fm}`)} />
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card title={t('grammar.conjugator.groups.negation')}>
                {list([
                  'negShort.present',
                  'negShort.past',
                  'negLong.present',
                  'negLong.past',
                  'negLong.formal',
                ])}
              </Card>
              <Card title={t('grammar.conjugator.groups.honorific')}>
                {list([
                  'honorific.present',
                  'honorific.formal',
                  'honorific.past',
                  'honorific.future',
                ])}
              </Card>
              <Card title={t('grammar.conjugator.groups.connectives')}>
                {list([
                  'connective.and',
                  'connective.but',
                  'connective.so',
                  'connective.if',
                  'connective.because',
                ])}
              </Card>
              <Card title={t('grammar.conjugator.groups.modifiers')}>
                {list(
                  result.info.kind === 'verb'
                    ? [
                        'modifier.present',
                        'modifier.past',
                        'modifier.future',
                        'want',
                      ]
                    : ['modifier.present', 'modifier.future'],
                )}
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
