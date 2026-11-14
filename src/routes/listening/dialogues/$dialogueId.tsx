import { createFileRoute, notFound } from '@tanstack/react-router'
import { getDialogue } from '../../../content/listening/dialogues'
import { DialoguePage } from '../../../features/listening/Dialogues'

export const Route = createFileRoute('/listening/dialogues/$dialogueId')({
  loader: ({ params }) => {
    const dialogue = getDialogue(params.dialogueId)
    if (!dialogue) throw notFound()
    return dialogue
  },
  component: DialogueRoute,
})

function DialogueRoute() {
  const dialogue = Route.useLoaderData()
  return <DialoguePage key={dialogue.id} dialogue={dialogue} />
}
