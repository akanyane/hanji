import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { inkEase } from './presets'

/** Ink-bleed transition: content soaks in (blur clears) whenever `transitionKey` changes. */
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
      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
      // A leftover `filter` (even blur(0)) creates a containing block and
      // breaks position: fixed descendants, so it is removed at the end.
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transitionEnd: { filter: 'none' },
      }}
      transition={{ duration: 0.5, ease: inkEase }}
    >
      {children}
    </motion.div>
  )
}
