import { useNavigate } from '@tanstack/react-router'
import {
  type ColumnDef,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  type SortingState,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Chip } from '../../components/ui/Chip'
import {
  PARTS_OF_SPEECH,
  THEMES,
  type ThemeId,
  type TopikLevel,
  VOCABULARY,
  type VocabWord,
} from '../../content/vocabulary'
import { useLocalized } from '../../i18n/useLocalized'
import { cn } from '../../lib/cn'
import { romanize } from '../../lib/romanization/romanize'
import { LEVELS, normalizeAnswer } from './logic'

// Features are declared once, outside the component, as TanStack Table v9 recommends.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

interface Row {
  word: VocabWord
  romanization: string
  meaning: string
}

const ROW_HEIGHT = 52
const helper = createColumnHelper<typeof features, Row>()

interface DictionaryProps {
  query: string
  level?: TopikLevel
  theme?: ThemeId
  onQueryChange: (query: string) => void
  onLevelChange: (level?: TopikLevel) => void
  onThemeChange: (theme?: ThemeId) => void
}

export function Dictionary({
  query,
  level,
  theme,
  onQueryChange,
  onLevelChange,
  onThemeChange,
}: DictionaryProps) {
  const { t } = useTranslation()
  const l = useLocalized()
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Filtering happens before the table: it only sorts and renders.
  const data = useMemo<Row[]>(() => {
    const q = normalizeAnswer(query)
    return VOCABULARY.filter(
      (w) =>
        (level ? w.level === level : true) &&
        (theme ? w.themes.includes(theme) : true),
    )
      .map((w) => ({
        word: w,
        romanization: romanize(w.word),
        meaning: l(w.meaning),
      }))
      .filter(
        (r) =>
          !q ||
          normalizeAnswer(r.word.word).includes(q) ||
          normalizeAnswer(r.romanization).includes(q) ||
          normalizeAnswer(r.meaning).includes(q),
      )
  }, [query, level, theme, l])

  const columns = useMemo<Array<ColumnDef<typeof features, Row>>>(
    () =>
      helper.columns([
        helper.accessor((r) => r.word.word, {
          id: 'word',
          header: t('vocabulary.dictionary.columns.word'),
          sortFn: 'text',
          cell: (info) => (
            <span lang="ko" className="text-lg font-semibold">
              {info.getValue()}
            </span>
          ),
        }),
        helper.accessor('romanization', {
          header: t('vocabulary.dictionary.columns.romanization'),
          sortFn: 'text',
        }),
        helper.accessor('meaning', {
          header: t('vocabulary.dictionary.columns.meaning'),
          sortFn: 'text',
        }),
        helper.accessor((r) => l(PARTS_OF_SPEECH[r.word.pos]), {
          id: 'pos',
          header: t('vocabulary.dictionary.columns.pos'),
          sortFn: 'text',
        }),
        helper.accessor((r) => r.word.level, {
          id: 'level',
          header: t('vocabulary.dictionary.columns.level'),
          sortFn: 'alphanumeric',
        }),
      ]),
    [t, l],
  )

  const table = useTable({
    features,
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
  })
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    initialRect: { width: 800, height: 520 },
  })
  const items = virtualizer.getVirtualItems()
  // Spacer rows keep a real <table> while only rendering visible rows.
  const padTop = items[0]?.start ?? 0
  const padBottom =
    virtualizer.getTotalSize() - (items[items.length - 1]?.end ?? 0)

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t('vocabulary.dictionary.placeholder')}
        aria-label={t('vocabulary.dictionary.search')}
        className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-lg dark:border-slate-600 dark:bg-slate-800"
      />
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('vocabulary.dictionary.level')}</legend>
        <Chip selected={!level} onClick={() => onLevelChange(undefined)}>
          {t('vocabulary.dictionary.allLevels')}
        </Chip>
        {LEVELS.map((lv) => (
          <Chip
            key={lv}
            selected={level === lv}
            onClick={() => onLevelChange(lv)}
          >
            {t('vocabulary.deck.level', { level: lv })}
          </Chip>
        ))}
      </fieldset>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('vocabulary.dictionary.theme')}</legend>
        <Chip selected={!theme} onClick={() => onThemeChange(undefined)}>
          {t('vocabulary.dictionary.allThemes')}
        </Chip>
        {(Object.keys(THEMES) as ThemeId[]).map((th) => (
          <Chip
            key={th}
            selected={theme === th}
            onClick={() => onThemeChange(th)}
          >
            <span aria-hidden="true">{THEMES[th].icon}</span>{' '}
            {l(THEMES[th].label)}
          </Chip>
        ))}
      </fieldset>

      <p
        className="text-sm text-slate-500 dark:text-slate-400"
        aria-live="polite"
      >
        {t('vocabulary.dictionary.results', { count: rows.length })}
      </p>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-slate-500 dark:text-slate-400">
          {t('vocabulary.dictionary.empty')}
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[32rem] overflow-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
        >
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-100 text-sm dark:bg-slate-700">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const sorted = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={
                          sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : 'none'
                        }
                        className={cn(
                          'px-4 py-2 font-semibold',
                          header.id === 'romanization' &&
                            'hidden sm:table-cell',
                          header.id === 'pos' && 'hidden md:table-cell',
                        )}
                      >
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={t('vocabulary.dictionary.sortBy', {
                            column: String(header.column.columnDef.header),
                          })}
                          className="flex items-center gap-1 hover:text-sky-700 dark:hover:text-sky-300"
                        >
                          <table.FlexRender header={header} />
                          <span aria-hidden="true">
                            {sorted === 'asc'
                              ? '▲'
                              : sorted === 'desc'
                                ? '▼'
                                : ''}
                          </span>
                        </button>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {padTop > 0 && (
                <tr>
                  <td style={{ height: padTop }} />
                </tr>
              )}
              {items.map((item) => {
                const row = rows[item.index]
                return (
                  <tr
                    key={row.id}
                    onClick={() =>
                      navigate({
                        to: '/vocabulary/word/$wordId',
                        params: { wordId: row.original.word.id },
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter')
                        navigate({
                          to: '/vocabulary/word/$wordId',
                          params: { wordId: row.original.word.id },
                        })
                    }}
                    tabIndex={0}
                    className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-sky-50 focus:bg-sky-50 dark:border-slate-700 dark:hover:bg-slate-700/60 dark:focus:bg-slate-700/60"
                    style={{ height: ROW_HEIGHT }}
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-4',
                          cell.column.id === 'romanization' &&
                            'hidden sm:table-cell',
                          cell.column.id === 'pos' &&
                            'hidden text-sm md:table-cell',
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                )
              })}
              {padBottom > 0 && (
                <tr>
                  <td style={{ height: padBottom }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
