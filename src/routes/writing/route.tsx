import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/writing')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={t('writing.title')}
          description={t('writing.description')}
        />
        <TabNav
          label={t('writing.sections')}
          layoutId="writing-tab-pill"
          items={[
            { to: '/writing', label: t('writing.tabs.keyboard'), exact: true },
            { to: '/writing/translate', label: t('writing.tabs.translate') },
            { to: '/writing/produce', label: t('writing.tabs.produce') },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
