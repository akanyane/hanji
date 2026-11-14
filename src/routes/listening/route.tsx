import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/listening')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={t('listening.title')}
          description={t('listening.description')}
        />
        <TabNav
          label={t('listening.sections')}
          layoutId="listening-tab-pill"
          items={[
            {
              to: '/listening',
              label: t('listening.tabs.dictation'),
              exact: true,
            },
            {
              to: '/listening/dialogues',
              label: t('listening.tabs.dialogues'),
            },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
