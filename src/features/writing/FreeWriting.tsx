import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fadeUp, pop } from '../../components/motion/presets'
import { AudioButton } from '../../components/ui/AudioButton'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import {
  WRITING_PROMPTS,
  type WritingPrompt,
} from '../../content/writing/writing'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { isSyllable } from '../../lib/hangul'

const draftKey = (id: string) => `learn-korean:writing:${id}`

/** Drafts are a per-device convenience: storage can be unavailable (private mode). */
function loadDraft(id: string): string {
  try {
    return localStorage.getItem(draftKey(id)) ?? ''
  } catch {
    return ''
  }
}

function saveDraft(id: string, text: string) {
  try {
    localStorage.setItem(draftKey(id), text)
  } catch {
    // Not saved; the text still lives in the page.
  }
}

export function countSentences(text: string): number {
  return text.split(/[.!?\n]+/).filter((s) => [...s].some(isSyllable)).length
}

function Check({ ok, children }: { ok: boolean; children: string }) {
  return (
    <li className="flex items-center gap-2">
      <motion.span
        key={String(ok)}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full text-sm text-white',
          ok ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
        )}
        aria-hidden="true"
      >
        {ok ? '✓' : ''}
      </motion.span>
      <span
        className={ok ? 'font-medium' : 'text-slate-500 dark:text-slate-400'}
      >
        {children}
      </span>
      <span className="sr-only">{ok ? '✓' : '✗'}</span>
    </li>
  )
}

function PromptEditor({ prompt }: { prompt: WritingPrompt }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const id = useId()
  const [text, setText] = useState(() => loadDraft(prompt.id))
  const [showModel, setShowModel] = useState(false)
  const sentences = countSentences(text)

  useEffect(() => saveDraft(prompt.id, text), [prompt.id, text])

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      <p className="rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-5 text-lg font-semibold text-white shadow-lg">
        {l(prompt.task)}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-semibold">
          {t('writing.produce.hints')}:
        </span>
        {prompt.hints.map((hint) => (
          <code
            key={hint}
            lang="ko"
            className="rounded-lg bg-slate-100 px-2 py-0.5 text-sm dark:bg-slate-800"
          >
            {hint}
          </code>
        ))}
      </div>
      <label htmlFor={id} className="text-sm font-semibold">
        {t('writing.produce.label')}
      </label>
      <textarea
        id={id}
        lang="ko"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="rounded-2xl border-2 border-slate-300 bg-white p-4 text-lg leading-relaxed dark:border-slate-600 dark:bg-slate-800"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('writing.produce.sentences', { count: sentences })} ·{' '}
        {t('writing.produce.saved')}
      </p>
      <ul className="flex flex-col gap-2" aria-live="polite">
        <Check ok={[...text].some(isSyllable)}>
          {t('writing.produce.hasHangul')}
        </Check>
        <Check ok={sentences >= prompt.minSentences}>
          {t('writing.produce.minSentences', { count: prompt.minSentences })}
        </Check>
        {prompt.checks.map((check) => (
          <Check
            key={check.label.en}
            ok={check.anyOf.some((p) => text.includes(p))}
          >
            {l(check.label)}
          </Check>
        ))}
      </ul>
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => setShowModel((s) => !s)}
        aria-pressed={showModel}
      >
        {showModel
          ? t('writing.produce.hideModel')
          : t('writing.produce.showModel')}
      </Button>
      <AnimatePresence>
        {showModel && (
          <motion.div
            variants={pop}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40"
          >
            <div className="flex items-start gap-2">
              <p lang="ko" className="flex-1 text-lg">
                {prompt.modelAnswer}
              </p>
              <AudioButton
                text={prompt.modelAnswer}
                className="h-8 w-8 [&_svg]:h-4 [&_svg]:w-4"
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {l(prompt.modelTranslation)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FreeWriting() {
  const { t } = useTranslation()
  const l = useLocalized()
  const [promptId, setPromptId] = useState(WRITING_PROMPTS[0].id)
  const prompt =
    WRITING_PROMPTS.find((p) => p.id === promptId) ?? WRITING_PROMPTS[0]

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <p className="text-slate-600 dark:text-slate-300">
        {t('writing.produce.description')}
      </p>
      <fieldset className="flex flex-wrap gap-2">
        {WRITING_PROMPTS.map((p) => (
          <Chip
            key={p.id}
            selected={p.id === promptId}
            onClick={() => setPromptId(p.id)}
          >
            {l(p.title)}
          </Chip>
        ))}
      </fieldset>
      <PromptEditor key={prompt.id} prompt={prompt} />
    </div>
  )
}
