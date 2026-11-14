import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'

export const Route = createFileRoute('/hangul')({
  component: HangulLayout,
})

function HangulLayout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title={t('hangul.title')}
          description={t('hangul.description')}
        />
        <TabNav
          label={t('hangul.sections')}
          layoutId="hangul-tab-pill"
          items={[
            { to: '/hangul', label: t('hangul.tabs.browse'), exact: true },
            { to: '/hangul/builder', label: t('hangul.tabs.builder') },
            { to: '/hangul/quiz', label: t('hangul.tabs.quiz') },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
