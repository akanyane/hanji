import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useVirtualizer } from '@tanstack/react-virtual'
import { motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/Button'
import { VOCABULARY } from '../../content/vocabulary'
import { useDeleteDeck, useSaveDeck } from '../../db/queries'
import type { DeckRecord } from '../../db/types'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { romanize } from '../../lib/romanization/romanize'
import { normalizeAnswer } from './logic'

export const DECK_NAME_MAX = 40
const ROW_HEIGHT = 48

/** Scrollable, virtualized checklist of every vocabulary word. */
function WordPicker({
  selected,
  onToggle,
}: {
  selected: string[]
  onToggle: (id: string) => void
}) {
  const { t } = useTranslation()
  const l = useLocalized()
  const [query, setQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const chosen = useMemo(() => new Set(selected), [selected])

  const words = useMemo(() => {
    const q = normalizeAnswer(query)
    if (!q) return VOCABULARY
    return VOCABULARY.filter(
      (w) =>
        normalizeAnswer(w.word).includes(q) ||
        normalizeAnswer(romanize(w.word)).includes(q) ||
        normalizeAnswer(l(w.meaning)).includes(q),
    )
  }, [query, l])

  // Only the visible rows are rendered; `initialRect` gives a size before layout (and in tests).
  const virtualizer = useVirtualizer({
    count: words.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    initialRect: { width: 600, height: 320 },
  })

  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('vocabulary.editor.searchWords')}
        aria-label={t('vocabulary.editor.searchWords')}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
      />
      <div
        ref={scrollRef}
        className="h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      >
        <ul
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((row) => {
            const word = words[row.index]
            const checked = chosen.has(word.id)
            return (
              <li
                key={word.id}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: row.size,
                  transform: `translateY(${row.start}px)`,
                }}
              >
                <label
                  className={cn(
                    'flex h-full cursor-pointer items-center gap-3 border-b border-slate-100 px-4 transition-colors dark:border-slate-700',
                    checked
                      ? 'bg-sky-50 dark:bg-sky-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(word.id)}
                    className="h-4 w-4"
                  />
                  <span lang="ko" className="w-28 shrink-0 font-semibold">
                    {word.word}
                  </span>
                  <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                    {l(word.meaning)}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function DeckEditor({ deck }: { deck?: DeckRecord }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync: save } = useSaveDeck()
  const { mutateAsync: remove } = useDeleteDeck()

  const form = useForm({
    defaultValues: {
      name: deck?.name ?? '',
      itemIds: deck?.itemIds ?? ([] as string[]),
    },
    onSubmit: async ({ value }) => {
      await save({ id: deck?.id, ...value })
      navigate({ to: '/vocabulary/decks' })
    },
  })

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-2xl flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      noValidate
    >
      <h2 className="text-xl font-bold">
        {deck
          ? t('vocabulary.editor.editTitle')
          : t('vocabulary.editor.createTitle')}
      </h2>

      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.trim() === ''
              ? t('vocabulary.editor.nameRequired')
              : value.trim().length > DECK_NAME_MAX
                ? t('vocabulary.editor.nameTooLong', { max: DECK_NAME_MAX })
                : undefined,
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor={field.name} className="text-sm font-semibold">
              {t('vocabulary.editor.name')}
            </label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={t('vocabulary.editor.namePlaceholder')}
              aria-invalid={!field.state.meta.isValid}
              aria-describedby={`${field.name}-error`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-lg aria-[invalid=true]:border-rose-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <p
              id={`${field.name}-error`}
              role="alert"
              className="min-h-5 text-sm text-rose-600 dark:text-rose-400"
            >
              {field.state.meta.errors.join(', ')}
            </p>
          </div>
        )}
      </form.Field>

      <form.Field
        name="itemIds"
        validators={{
          onChange: ({ value }) =>
            value.length === 0
              ? t('vocabulary.editor.noWordsSelected')
              : undefined,
        }}
      >
        {(field) => (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 flex w-full items-baseline justify-between text-sm font-semibold">
              {t('vocabulary.editor.words')}
              <span
                className="font-normal text-slate-500 dark:text-slate-400"
                aria-live="polite"
              >
                {t('vocabulary.editor.selected', {
                  count: field.state.value.length,
                })}
              </span>
            </legend>
            <WordPicker
              selected={field.state.value}
              onToggle={(id) =>
                field.handleChange(
                  field.state.value.includes(id)
                    ? field.state.value.filter((x) => x !== id)
                    : [...field.state.value, id],
                )
              }
            />
            <p
              role="alert"
              className="min-h-5 text-sm text-rose-600 dark:text-rose-400"
            >
              {field.state.meta.errors.join(', ')}
            </p>
          </fieldset>
        )}
      </form.Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {deck ? (
          <Button
            variant="ghost"
            className="text-rose-600 dark:text-rose-400"
            onClick={async () => {
              if (window.confirm(t('vocabulary.editor.confirmDelete'))) {
                await remove(deck.id)
                navigate({ to: '/vocabulary/decks' })
              }
            }}
          >
            {t('vocabulary.editor.delete')}
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate({ to: '/vocabulary/decks' })}
          >
            {t('vocabulary.editor.cancel')}
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {t('vocabulary.editor.save')}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>
    </motion.form>
  )
}
