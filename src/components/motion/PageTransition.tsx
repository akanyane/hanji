import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { softSpring } from './presets'

/** Fades and slides content in whenever `transitionKey` changes. */
export function PageTransition({
  transitionKey,
  children,
}: {
  transitionKey: string
  children: ReactNode
}) {
  return (
    <motion.div
      key={transitionKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={softSpring}
    >
      {children}
    </motion.div>
  )
}
