import { createFileRoute, notFound } from '@tanstack/react-router'
import { RulePage } from '../../features/pronunciation/RulePage'
import type { PronunciationRuleId } from '../../lib/pronunciation/pronounce'

export const Route = createFileRoute('/pronunciation/$ruleId')({
  // Content is imported inside the loader so it stays out of the app's
  // initial JavaScript (route loaders are not code-split).
  loader: async ({ params }) => {
    const { PRONUNCIATION_RULES } = await import(
      '../../content/pronunciation/rules'
    )
    if (!(params.ruleId in PRONUNCIATION_RULES)) throw notFound()
    return params.ruleId as PronunciationRuleId
  },
  component: RuleRoute,
})

function RuleRoute() {
  const rule = Route.useLoaderData()
  return <RulePage rule={rule} />
}
