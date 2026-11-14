import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { STROKES, strokeStart } from '../../content/hangul/strokes'
import { Button } from '../ui/Button'

/** One hue per stroke (cycled), so the order is easy to follow. */
const STROKE_COLORS = [
  '#0ea5e9',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#f43f5e',
  '#6366f1',
  '#14b8a6',
  '#ec4899',
]
const DRAW_SECONDS = 0.6
const GAP_SECONDS = 0.25

interface StrokeOrderProps {
  jamo: string
  className?: string
}

/** Animated stroke-order diagram for one jamo, with numbered stroke starts. */
export function StrokeOrder({ jamo, className }: StrokeOrderProps) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const strokes = STROKES[jamo]
  if (!strokes) return null

  const delayOf = (i: number) =>
    reduced ? 0 : i * (DRAW_SECONDS + GAP_SECONDS)

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ''}`}>
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${t('hangul.detail.strokeDiagram', { char: jamo })}: ${t('hangul.detail.strokes', { count: strokes.length })}`}
        className="aspect-square w-full max-w-64 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      >
        {/* Practice-sheet guide lines */}
        <g
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        >
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </g>
        {/* Faded full letter underneath */}
        <g
          className="stroke-slate-200 dark:stroke-slate-700"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {strokes.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* Animated strokes; `run` remounts them to replay. */}
        <g
          key={run}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {strokes.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke={STROKE_COLORS[i % STROKE_COLORS.length]}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: reduced ? 0 : DRAW_SECONDS,
                  delay: delayOf(i),
                  ease: 'easeInOut',
                },
                opacity: { duration: 0.01, delay: delayOf(i) },
              }}
            />
          ))}
          {strokes.map((d, i) => {
            const [x, y] = strokeStart(d)
            return (
              <motion.g
                key={`n-${d}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 20,
                  delay: delayOf(i),
                }}
                style={{ originX: `${x}px`, originY: `${y}px` }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={STROKE_COLORS[i % STROKE_COLORS.length]}
                  stroke="white"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y + 2.2}
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="700"
                  fill="white"
                  stroke="none"
                >
                  {i + 1}
                </text>
              </motion.g>
            )
          })}
        </g>
      </svg>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {t('hangul.detail.strokes', { count: strokes.length })}
        </span>
        <Button
          variant="secondary"
          className="px-3 py-1 text-sm"
          onClick={() => setRun((r) => r + 1)}
        >
          ↻ {t('hangul.detail.replay')}
        </Button>
      </div>
    </div>
  )
}
