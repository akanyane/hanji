import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/speaking')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={t('speaking.title')}
          description={t('speaking.description')}
        />
        <TabNav
          label={t('speaking.sections')}
          layoutId="speaking-tab-pill"
          items={[
            { to: '/speaking', label: t('speaking.tabs.repeat'), exact: true },
            { to: '/speaking/shadowing', label: t('speaking.tabs.shadowing') },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
