import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/** Counts up from 0 to `value` (instantly with reduced motion). */
export function AnimatedNumber({
  value,
  duration = 0.8,
}: {
  value: number
  duration?: number
}) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value, duration, reduced])

  return <>{display}</>
}
