import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageTransition } from '../../components/motion/PageTransition'
import { PageHeader } from '../../components/ui/PageHeader'
import { TabNav } from '../../components/ui/TabNav'
import { quizSummariesQuery } from '../../db/queries'

export const Route = createFileRoute('/grammar')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(quizSummariesQuery('grammar:')),
  component: GrammarLayout,
})

function GrammarLayout() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (l) => l.pathname })
  // Lesson pages have their own big header.
  const inLesson =
    pathname.split('/').length > 2 &&
    !['conjugator', 'particles'].includes(pathname.split('/')[2])

  return (
    <div className="flex flex-col gap-6">
      {!inLesson && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <PageHeader
            title={t('grammar.title')}
            description={t('grammar.description')}
          />
          <TabNav
            label={t('grammar.sections')}
            layoutId="grammar-tab-pill"
            items={[
              { to: '/grammar', label: t('grammar.tabs.lessons'), exact: true },
              {
                to: '/grammar/conjugator',
                label: t('grammar.tabs.conjugator'),
              },
              { to: '/grammar/particles', label: t('grammar.tabs.particles') },
            ]}
          />
        </div>
      )}
      <PageTransition transitionKey={pathname}>
        <Outlet />
      </PageTransition>
    </div>
  )
}
