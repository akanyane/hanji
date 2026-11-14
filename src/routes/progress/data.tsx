import { createFileRoute } from '@tanstack/react-router'
import { DataPage } from '../../features/progress/DataPage'

export const Route = createFileRoute('/progress/data')({
  component: DataPage,
})
