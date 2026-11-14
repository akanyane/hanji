import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'

export const Route = createFileRoute('/culture')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('culture.title')}
        description={t('culture.description')}
      />
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
