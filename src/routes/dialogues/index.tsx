import { createFileRoute } from '@tanstack/react-router'
import { DialoguesHome } from '../../features/dialogues/DialoguesModule'

export const Route = createFileRoute('/dialogues/')({
  component: () => <DialoguesHome />,
})
