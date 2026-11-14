import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

// Ink drops and paper flecks: sumi ink, seal vermilion, ochre, pine.
const COLORS = [
  'var(--color-ink-900)',
  'var(--color-seal-500)',
  'var(--color-amber-400)',
  'var(--color-pine-500)',
  'var(--color-seal-400)',
]
const GLYPHS = ['ㄱ', 'ㅏ', '한', '글', 'ㅎ', '좋']

interface Particle {
  x: number
  y: number
  rotate: number
  delay: number
  color: string
  glyph: string | null
  size: number
  /** Ink drop (round, stretched) or paper fleck (square-ish). */
  drop: boolean
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 100 + Math.random() * 230
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 70,
      rotate: (Math.random() - 0.5) * 540,
      delay: Math.random() * 0.12,
      color: COLORS[i % COLORS.length],
      glyph: i % 6 === 0 ? GLYPHS[i % GLYPHS.length] : null,
      size: 5 + Math.random() * 9,
      drop: i % 2 === 0,
    }
  })
}

/** One-shot celebratory ink splash. Decorative and skipped with reduced motion. */
export function Confetti({ count = 44 }: { count?: number }) {
  const reduced = useReducedMotion()
  const particles = useMemo(() => makeParticles(count), [count])
  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
    >
      {particles.map((p, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: particles are static for the burst's lifetime
          key={i}
          className="absolute font-serif font-bold"
          style={{
            color: p.color,
            width: p.glyph ? undefined : p.size,
            height: p.glyph ? undefined : p.drop ? p.size : p.size * 0.55,
            backgroundColor: p.glyph ? undefined : p.color,
            borderRadius: p.drop ? '50% 50% 50% 50% / 60% 60% 40% 40%' : 1,
            fontSize: p.glyph ? p.size * 2 : undefined,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.2 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 170],
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: [0.2, 1.15, 1],
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {p.glyph}
        </motion.span>
      ))}
    </div>
  )
}
