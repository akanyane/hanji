import { createFileRoute, notFound } from '@tanstack/react-router'
import { CultureNotePage } from '../../features/culture/Culture'

export const Route = createFileRoute('/culture/$noteId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { getCultureNote } = await import('../../content/culture/notes')
    const note = getCultureNote(params.noteId)
    if (!note) throw notFound()
    return note
  },
  component: NoteRoute,
})

function NoteRoute() {
  const note = Route.useLoaderData()
  return <CultureNotePage note={note} />
}
