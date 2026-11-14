import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp } from '../motion/presets'

interface PageHeaderProps {
  title: string
  description?: ReactNode
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && (
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      )}
    </motion.div>
  )
}
