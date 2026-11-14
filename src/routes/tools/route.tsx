import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'
import { TOOLS } from '../../features/tools/tools'

export const Route = createFileRoute('/tools')({
  component: ToolsLayout,
})

function ToolsLayout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('tools.title')}
        description={t('tools.description')}
      />
      <TabNav
        label={t('tools.nav')}
        layoutId="tools-tab-pill"
        items={TOOLS.map((tool) => ({
          to: tool.to,
          label: t(`tools.${tool.id}.title`),
        }))}
      />
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
