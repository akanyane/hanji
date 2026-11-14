import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { TOOLS } from '../../features/tools/tools'

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
      {TOOLS.map((tool) => (
        <motion.li key={tool.id} variants={fadeUp}>
          <MotionLink
            to={tool.to}
            whileHover={cardHover}
            whileTap={cardTap}
            className="flex h-full flex-col gap-2 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm hover:border-sky-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-400"
          >
            <span className="text-3xl" aria-hidden="true">
              {tool.icon}
            </span>
            <span className="font-semibold">{t(`tools.${tool.id}.title`)}</span>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {t(`tools.${tool.id}.description`)}
            </span>
          </MotionLink>
        </motion.li>
      ))}
    </motion.ul>
  )
}
