import { createFileRoute } from '@tanstack/react-router'
import { SyllableBuilder } from '../../features/hangul/SyllableBuilder'
import { isFinal, isInitial, isMedial } from '../../lib/hangul'

interface BuilderSearch {
  initial?: string
  medial?: string
  /** A final consonant, or "none" for an open syllable. */
  final?: string
}

const NO_FINAL = 'none'

// The syllable lives in the URL (?initial=ㅎ&medial=ㅏ&final=ㄴ), so it can be shared.
export const Route = createFileRoute('/hangul/builder')({
  validateSearch: (search: Record<string, unknown>): BuilderSearch => ({
    initial:
      typeof search.initial === 'string' && isInitial(search.initial)
        ? search.initial
        : undefined,
    medial:
      typeof search.medial === 'string' && isMedial(search.medial)
        ? search.medial
        : undefined,
    final:
      search.final === NO_FINAL ||
      (typeof search.final === 'string' && isFinal(search.final))
        ? search.final
        : undefined,
  }),
  component: BuilderPage,
})

function BuilderPage() {
  const {
    initial = 'ㅎ',
    medial = 'ㅏ',
    final: finalParam = 'ㄴ',
  } = Route.useSearch()
  const final = finalParam === NO_FINAL ? '' : finalParam
  const navigate = Route.useNavigate()

  return (
    <SyllableBuilder
      initial={initial}
      medial={medial}
      final={final}
      onChange={(parts) =>
        navigate({
          search: { ...parts, final: parts.final || NO_FINAL },
          replace: true,
        })
      }
    />
  )
}
