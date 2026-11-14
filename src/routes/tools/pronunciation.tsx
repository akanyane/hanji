import { createFileRoute } from '@tanstack/react-router'
import { PronunciationTool } from '../../features/tools/PronunciationTool'
import { useUrlSyncedText } from '../../hooks/useUrlSyncedText'
import { parseTextParam } from './-search'

export const Route = createFileRoute('/tools/pronunciation')({
  validateSearch: (search: Record<string, unknown>): { text?: string } => ({
    text: parseTextParam(search.text),
  }),
  component: PronunciationPage,
})

function PronunciationPage() {
  const { text: urlText = '' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [text, setText, setTextNow] = useUrlSyncedText(urlText, (value) =>
    navigate({ search: { text: value || undefined }, replace: true }),
  )

  return (
    <PronunciationTool
      text={text}
      onTextChange={setText}
      onPickExample={setTextNow}
    />
  )
}
