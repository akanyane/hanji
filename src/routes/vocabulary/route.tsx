import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'
import { decksQuery, srsCardsQuery } from '../../db/queries'

export const Route = createFileRoute('/vocabulary')({
  // Cards and decks drive most vocabulary pages: load them once up front.
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(srsCardsQuery),
      context.queryClient.ensureQueryData(decksQuery),
    ]),
  component: VocabularyLayout,
})

function VocabularyLayout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={t('vocabulary.title')}
          description={t('vocabulary.description')}
        />
        <TabNav
          label={t('vocabulary.sections')}
          layoutId="vocabulary-tab-pill"
          items={[
            {
              to: '/vocabulary',
              label: t('vocabulary.tabs.review'),
              exact: true,
            },
            { to: '/vocabulary/decks', label: t('vocabulary.tabs.decks') },
            {
              to: '/vocabulary/dictionary',
              label: t('vocabulary.tabs.dictionary'),
            },
            { to: '/vocabulary/stats', label: t('vocabulary.tabs.stats') },
          ]}
        />
      </div>
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
