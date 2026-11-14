import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { BrushStroke } from '../motion/BrushStroke'
import { fadeUp, stagger } from '../motion/presets'

interface PageHeaderProps {
  title: string
  description?: ReactNode
  /** Korean name of the section, shown as a small vertical label. */
  korean?: string
}

/** Section title in serif, with a brush stroke that paints itself under it. */
export function PageHeader({ title, description, korean }: PageHeaderProps) {
  return (
    <motion.div
      className="flex items-start gap-4"
      variants={stagger(0, 0.08)}
      initial="hidden"
      animate="visible"
    >
      {korean && (
        <motion.span
          variants={fadeUp}
          lang="ko"
          aria-hidden="true"
          className="vertical hidden border-l border-seal-500/60 pl-2 font-serif text-sm tracking-[0.3em] text-seal-600 sm:block dark:text-seal-400"
        >
          {korean}
        </motion.span>
      )}
      <div className="flex flex-col gap-1">
        <motion.h1 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">
          {title}
        </motion.h1>
        <BrushStroke className="-mt-1 w-32 sm:w-44" variant={title.length} />
        {description && (
          <motion.p
            variants={fadeUp}
            className="mt-1 max-w-2xl text-ink-600 dark:text-ink-300"
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
