import { createFileRoute } from '@tanstack/react-router'
import { DialogueList } from '../../../features/listening/Dialogues'

export const Route = createFileRoute('/listening/dialogues/')({
  component: DialogueList,
})
