import { createFileRoute, notFound } from '@tanstack/react-router'
import { PRONUNCIATION_RULES } from '../../content/pronunciation/rules'
import { RulePage } from '../../features/pronunciation/RulePage'
import type { PronunciationRuleId } from '../../lib/pronunciation/pronounce'

export const Route = createFileRoute('/pronunciation/$ruleId')({
  loader: ({ params }) => {
    if (!(params.ruleId in PRONUNCIATION_RULES)) throw notFound()
    return params.ruleId as PronunciationRuleId
  },
  component: RuleRoute,
})

function RuleRoute() {
  const rule = Route.useLoaderData()
  return <RulePage rule={rule} />
}
