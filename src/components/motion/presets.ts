import type { Transition, Variants } from 'motion/react'

// Shared animation presets so motion feels consistent across the app.
// The language is "ink on paper": things soak in (blur → sharp), brush
// strokes paint, seals stamp. Springs stay firm, never rubbery.

export const spring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
}
export const softSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 26,
}
/** Ink easing: slow start, quick soak, gentle settle. */
export const inkEase = [0.22, 1, 0.36, 1] as const

/** Ink soaking into paper: fade + slight rise + blur clearing. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: inkEase },
    // Never leave a filter behind (it would break position: fixed children).
    transitionEnd: { filter: 'none' },
  },
}

/** Parent variant that reveals its children one after another. */
export const stagger = (
  delayChildren = 0,
  staggerChildren = 0.05,
): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})

/** Stamped in: lands from slightly bigger, like a seal pressed on paper. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 1.25, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 520, damping: 22 },
    transitionEnd: { filter: 'none' },
  },
}

/** Horizontal shake for wrong answers. */
export const shake = {
  x: [0, -9, 9, -6, 6, -3, 3, 0],
  transition: { duration: 0.45 },
}

/** Hover/tap feedback for clickable cards: the sheet lifts off the desk. */
export const cardHover = {
  y: -5,
  rotate: -0.4,
  boxShadow: 'var(--shadow-lift)',
  transition: spring,
}
export const cardTap = { scale: 0.98, y: 0 }
