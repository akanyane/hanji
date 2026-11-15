import { createFileRoute } from '@tanstack/react-router'
import { THEMES } from '../../content/vocabulary/themes'
import type { ThemeId, TopikLevel } from '../../content/vocabulary/types'
import { Dictionary } from '../../features/vocabulary/Dictionary'
import { useUrlSyncedText } from '../../hooks/useUrlSyncedText'
import { parseTextParam } from '../tools/-search'

interface DictionarySearch {
  q?: string
  level?: TopikLevel
  theme?: ThemeId
}

export const Route = createFileRoute('/vocabulary/dictionary')({
  validateSearch: (search: Record<string, unknown>): DictionarySearch => ({
    q: parseTextParam(search.q),
    level: [1, 2, 3, 4, 5, 6].includes(Number(search.level))
      ? (Number(search.level) as TopikLevel)
      : undefined,
    theme:
      typeof search.theme === 'string' && search.theme in THEMES
        ? (search.theme as ThemeId)
        : undefined,
  }),
  component: DictionaryPage,
})

function DictionaryPage() {
  const { q = '', level, theme } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [query, setQuery] = useUrlSyncedText(q, (value) =>
    navigate({
      search: (s) => ({ ...s, q: value || undefined }),
      replace: true,
    }),
  )

  return (
    <Dictionary
      query={query}
      level={level}
      theme={theme}
      onQueryChange={setQuery}
      onLevelChange={(lv) =>
        navigate({ search: (s) => ({ ...s, level: lv }), replace: true })
      }
      onThemeChange={(th) =>
        navigate({ search: (s) => ({ ...s, theme: th }), replace: true })
      }
    />
  )
}
