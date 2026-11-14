import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/pronunciation')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={t('pronunciation.title')}
          description={t('pronunciation.description')}
        />
        <TabNav
          label={t('pronunciation.sections')}
          layoutId="pronunciation-tab-pill"
          items={[
            {
              to: '/pronunciation',
              label: t('pronunciation.tabs.rules'),
              exact: true,
            },
            {
              to: '/pronunciation/minimal-pairs',
              label: t('pronunciation.tabs.minimalPairs'),
            },
            { to: '/tools/pronunciation', label: t('pronunciation.tabs.tool') },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
