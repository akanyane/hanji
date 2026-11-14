import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/numbers')({
  component: Layout,
})

function Layout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={t('numbers.title')}
          description={t('numbers.description')}
        />
        <TabNav
          label={t('numbers.sections')}
          layoutId="numbers-tab-pill"
          items={[
            { to: '/numbers', label: t('numbers.tabs.learn'), exact: true },
            { to: '/numbers/practice', label: t('numbers.tabs.practice') },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
