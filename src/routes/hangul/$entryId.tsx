import { createFileRoute, notFound } from '@tanstack/react-router'
import { hangulData } from '../../content/hangul'
import { EntryDetail } from '../../features/hangul/EntryDetail'

export const Route = createFileRoute('/hangul/$entryId')({
  loader: ({ params }) => {
    const entry = hangulData.find((e) => e.id === params.entryId)
    if (!entry) throw notFound()
    return entry
  },
  component: EntryPage,
})

function EntryPage() {
  const entry = Route.useLoaderData()
  return <EntryDetail entry={entry} />
}
