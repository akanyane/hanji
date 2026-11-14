import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

const COLORS = [
  '#0ea5e9',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#f43f5e',
  '#eab308',
]
// A few Hangul letters mixed into the confetti, for flavor.
const GLYPHS = ['ㄱ', 'ㅏ', '한', '글', 'ㅎ', '♥']

interface Particle {
  x: number
  y: number
  rotate: number
  delay: number
  color: string
  glyph: string | null
  size: number
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 120 + Math.random() * 220
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 80,
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.15,
      color: COLORS[i % COLORS.length],
      glyph: i % 5 === 0 ? GLYPHS[i % GLYPHS.length] : null,
      size: 6 + Math.random() * 8,
    }
  })
}

/** One-shot celebratory burst. Purely decorative and skipped with reduced motion. */
export function Confetti({ count = 48 }: { count?: number }) {
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
          className="absolute font-bold"
          style={{
            color: p.color,
            width: p.glyph ? undefined : p.size,
            height: p.glyph ? undefined : p.size * 0.6,
            backgroundColor: p.glyph ? undefined : p.color,
            borderRadius: 2,
            fontSize: p.glyph ? p.size * 2 : undefined,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 160],
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: 1,
          }}
          transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
        >
          {p.glyph}
        </motion.span>
      ))}
    </div>
  )
}
