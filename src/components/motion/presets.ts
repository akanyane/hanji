import type { Transition, Variants } from 'motion/react'

// Shared animation presets so motion feels consistent across the app.

export const spring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
}
export const softSpring: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 24,
}

/** Fade + rise, used for pages and cards entering. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: softSpring },
}

/** Parent variant that reveals its children one after another. */
export const stagger = (
  delayChildren = 0,
  staggerChildren = 0.04,
): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})

/** Pop in with a little overshoot (results, badges). */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 18 },
  },
}

/** Horizontal shake for wrong answers. */
export const shake = {
  x: [0, -10, 10, -8, 8, -4, 4, 0],
  transition: { duration: 0.45 },
}

/** Hover/tap feedback for clickable cards. */
export const cardHover = { y: -4, scale: 1.02, transition: spring }
export const cardTap = { scale: 0.97 }
