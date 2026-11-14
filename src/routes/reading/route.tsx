import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'

export const Route = createFileRoute('/reading')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('reading.title')}
        description={t('reading.description')}
      />
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
