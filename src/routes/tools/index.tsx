import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { TOOLS, type ToolInfo } from '../../features/tools/tools'

// The dictionary and the conjugator live in their own modules, but are listed here too.
const CARDS: Array<
  Omit<ToolInfo, 'id'> & { id: ToolInfo['id'] | 'dictionary' | 'conjugator' }
> = [
  ...TOOLS,
  { id: 'dictionary', to: '/vocabulary/dictionary', icon: '사전' },
  { id: 'conjugator', to: '/grammar/conjugator', icon: '활용' },
]

export const Route = createFileRoute('/tools/')({
  component: ToolsIndex,
})

const MotionLink = motion.create(Link)

function ToolsIndex() {
  const { t } = useTranslation()
  return (
    <motion.ul
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={stagger(0, 0.08)}
      initial="hidden"
      animate="visible"
    >
      {CARDS.map((tool) => (
        <motion.li key={tool.id} variants={fadeUp}>
          <MotionLink
            to={tool.to}
            whileHover={cardHover}
            whileTap={cardTap}
            className="flex h-full flex-col gap-2 rounded-lg border border-ink-300 bg-white p-5 shadow-paper hover:border-ink-900 hover:shadow-lift dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ink-200"
          >
            <span
              aria-hidden="true"
              lang="ko"
              className="font-serif text-2xl font-bold text-seal-600 dark:text-seal-400"
            >
              {tool.icon}
            </span>
            <span className="font-semibold">{t(`tools.${tool.id}.title`)}</span>
            <span className="text-sm text-ink-600 dark:text-ink-300">
              {t(`tools.${tool.id}.description`)}
            </span>
          </MotionLink>
        </motion.li>
      ))}
    </motion.ul>
  )
}
