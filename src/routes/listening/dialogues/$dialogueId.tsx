import { createFileRoute, notFound } from '@tanstack/react-router'
import { DialoguePage } from '../../../features/listening/Dialogues'

export const Route = createFileRoute('/listening/dialogues/$dialogueId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { getDialogue } = await import('../../../content/listening/dialogues')
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
