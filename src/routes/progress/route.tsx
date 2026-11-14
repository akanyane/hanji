import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/progress')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('progress.title')}
        description={t('progress.description')}
      />
      <TabNav
        label={t('progress.sections')}
        layoutId="progress-tab-pill"
        items={[
          { to: '/progress', label: t('progress.tabs.dashboard'), exact: true },
          {
            to: '/progress/achievements',
            label: t('progress.tabs.achievements'),
          },
          { to: '/progress/placement', label: t('progress.tabs.placement') },
          { to: '/progress/exam', label: t('progress.tabs.exam') },
          { to: '/progress/data', label: t('progress.tabs.data') },
        ]}
      />
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
