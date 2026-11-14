import { createFileRoute } from '@tanstack/react-router'
import { DecomposerTool } from '../../features/tools/DecomposerTool'
import { useUrlSyncedText } from '../../hooks/useUrlSyncedText'
import { parseTextParam } from './-search'

export const Route = createFileRoute('/tools/decomposer')({
  validateSearch: (search: Record<string, unknown>): { text?: string } => ({
    text: parseTextParam(search.text),
  }),
  component: DecomposerPage,
})

function DecomposerPage() {
  const { text: urlText = '' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [text, setText] = useUrlSyncedText(urlText, (value) =>
    navigate({ search: { text: value || undefined }, replace: true }),
  )

  return <DecomposerTool text={text} onTextChange={setText} />
}
