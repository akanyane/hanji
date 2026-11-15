import { createFileRoute, notFound } from '@tanstack/react-router'
import { EntryDetail } from '../../features/hangul/EntryDetail'

export const Route = createFileRoute('/hangul/$entryId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { hangulData } = await import('../../content/hangul')
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
