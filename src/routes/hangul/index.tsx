import { createFileRoute } from '@tanstack/react-router'
import type { HangulCategory } from '../../content/hangul'
import { BrowseView } from '../../features/hangul/BrowseView'
import { parseCategory } from '../../features/hangul/filter'
import { useUrlSyncedText } from '../../hooks/useUrlSyncedText'

interface BrowseSearch {
  category?: HangulCategory
  q?: string
}

// Filter and search live in the URL (?category=vowel&q=ga), so they can be
// shared and survive a page reload.
export const Route = createFileRoute('/hangul/')({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    category: parseCategory(search.category),
    q: typeof search.q === 'string' && search.q !== '' ? search.q : undefined,
  }),
  component: BrowsePage,
})

function BrowsePage() {
  const { category = 'all', q = '' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [query, setQuery] = useUrlSyncedText(q, (value) =>
    navigate({
      search: (s) => ({ ...s, q: value === '' ? undefined : value }),
      replace: true,
    }),
  )

  return (
    <BrowseView
      category={category}
      query={query}
      onCategoryChange={(c) =>
        navigate({
          search: (s) => ({ ...s, category: c === 'all' ? undefined : c }),
          replace: true,
        })
      }
      onQueryChange={setQuery}
    />
  )
}
