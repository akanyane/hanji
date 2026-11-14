import { createFileRoute, notFound } from '@tanstack/react-router'
import { getCultureNote } from '../../content/culture/notes'
import { CultureNotePage } from '../../features/culture/Culture'

export const Route = createFileRoute('/culture/$noteId')({
  loader: ({ params }) => {
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
