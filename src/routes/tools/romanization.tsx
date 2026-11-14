import { createFileRoute } from '@tanstack/react-router'
import {
  type RomanizationDirection,
  RomanizationTool,
} from '../../features/tools/RomanizationTool'
import { useUrlSyncedText } from '../../hooks/useUrlSyncedText'
import { parseTextParam } from './-search'

interface RomanizationSearch {
  text?: string
  direction?: RomanizationDirection
  keepH?: boolean
}

export const Route = createFileRoute('/tools/romanization')({
  validateSearch: (search: Record<string, unknown>): RomanizationSearch => ({
    text: parseTextParam(search.text),
    direction: search.direction === 'to-hangul' ? 'to-hangul' : undefined,
    keepH: search.keepH === true || search.keepH === 'true' ? true : undefined,
  }),
  component: RomanizationPage,
})

function RomanizationPage() {
  const {
    text: urlText = '',
    direction = 'to-latin',
    keepH = false,
  } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [text, setText, setTextNow] = useUrlSyncedText(urlText, (value) =>
    navigate({
      search: (s) => ({ ...s, text: value || undefined }),
      replace: true,
    }),
  )

  return (
    <RomanizationTool
      text={text}
      direction={direction}
      keepH={keepH}
      onTextChange={setText}
      onDirectionChange={(next) => {
        // The old input belongs to the other script, so start fresh.
        setTextNow('')
        navigate({
          search: { direction: next === 'to-latin' ? undefined : next },
          replace: true,
        })
      }}
      onKeepHChange={(value) =>
        navigate({
          search: (s) => ({ ...s, keepH: value || undefined }),
          replace: true,
        })
      }
    />
  )
}
