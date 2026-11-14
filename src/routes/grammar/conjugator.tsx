import { createFileRoute } from '@tanstack/react-router'
import { Conjugator, type KindOption } from '../../features/grammar/Conjugator'
import { useUrlSyncedText } from '../../hooks/useUrlSyncedText'
import { parseTextParam } from '../tools/-search'

interface ConjugatorSearch {
  verb?: string
  kind?: Exclude<KindOption, 'auto'>
  regular?: boolean
}

export const Route = createFileRoute('/grammar/conjugator')({
  validateSearch: (search: Record<string, unknown>): ConjugatorSearch => ({
    verb: parseTextParam(search.verb),
    kind:
      search.kind === 'verb' || search.kind === 'adjective'
        ? search.kind
        : undefined,
    regular:
      search.regular === true || search.regular === 'true' ? true : undefined,
  }),
  component: ConjugatorPage,
})

function ConjugatorPage() {
  const {
    verb: urlVerb = '먹다',
    kind = 'auto',
    regular = false,
  } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [verb, setVerb, setVerbNow] = useUrlSyncedText(urlVerb, (value) =>
    navigate({
      search: (s) => ({ ...s, verb: value || undefined, regular: undefined }),
      replace: true,
    }),
  )

  return (
    <Conjugator
      verb={verb}
      kind={kind}
      regular={regular}
      onVerbChange={setVerb}
      onPickExample={setVerbNow}
      onKindChange={(k) =>
        navigate({
          search: (s) => ({ ...s, kind: k === 'auto' ? undefined : k }),
          replace: true,
        })
      }
      onRegularChange={(r) =>
        navigate({
          search: (s) => ({ ...s, regular: r || undefined }),
          replace: true,
        })
      }
    />
  )
}
