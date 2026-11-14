import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { RULE_EXAMPLES, RULE_ORDER } from '../../content/pronunciation/practice'
import { PRONUNCIATION_RULES } from '../../content/pronunciation/rules'
import { useLocalized } from '../../i18n/useLocalized'

export function RulesIndex() {
  const l = useLocalized()
  return (
    <motion.ol
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {RULE_ORDER.map((rule, i) => {
        const info = PRONUNCIATION_RULES[rule]
        return (
          <motion.li key={rule} variants={fadeUp}>
            <Link
              to="/pronunciation/$ruleId"
              params={{ ruleId: rule }}
              className="block h-full rounded-lg"
            >
              <motion.div
                whileHover={cardHover}
                whileTap={cardTap}
                className="flex h-full flex-col gap-2 rounded-lg border border-ink-200 bg-white p-4 shadow-paper dark:border-ink-700 dark:bg-ink-900"
              >
                <span className="flex items-baseline justify-between">
                  <span className="font-semibold">
                    {i + 1}. {l(info.name)}
                  </span>
                  <span
                    lang="ko"
                    className="text-sm text-ink-500 dark:text-ink-400"
                  >
                    {info.korean}
                  </span>
                </span>
                <span className="text-sm text-ink-600 dark:text-ink-300">
                  {l(info.summary)}
                </span>
                <span
                  lang="ko"
                  className="mt-auto text-lg font-semibold text-pine-700 dark:text-pine-300"
                >
                  {info.example[0]} → [{info.example[1]}]
                </span>
                <span className="sr-only">
                  {RULE_EXAMPLES[rule].join(', ')}
                </span>
              </motion.div>
            </Link>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
