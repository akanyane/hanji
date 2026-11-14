import { createFileRoute } from '@tanstack/react-router'
import { THEMES, type ThemeId, type TopikLevel } from '../../content/vocabulary'
import { Dictionary } from '../../features/vocabulary/Dictionary'
import { LEVELS } from '../../features/vocabulary/logic'
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
    level: LEVELS.includes(Number(search.level) as TopikLevel)
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
