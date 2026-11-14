import { AnimatePresence, motion } from 'motion/react'
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { STROKES } from '../../content/hangul/strokes'
import { cn } from '../../lib/cn'
import {
  type DrawingRating,
  type Point,
  rasterizePolylines,
  rateDrawing,
  scoreDrawing,
} from '../../lib/handwriting/score'
import { pop, shake } from '../motion/presets'
import { Button } from '../ui/Button'

/** Comparison grid resolution and pen widths (in 0–100 units). */
const GRID = 48
const MODEL_RADIUS = 5
const PEN_RADIUS = 3.5
const PEN_WIDTH_PX = 10

type Feedback =
  | { kind: 'empty' }
  | { kind: 'rated'; rating: DrawingRating; drawn: number; expected: number }

/** Samples an SVG path element into points, every ~1 unit along its length. */
function samplePath(path: SVGPathElement): Point[] {
  const length = path.getTotalLength()
  const points: Point[] = []
  for (let d = 0; d <= length; d += 1) {
    const p = path.getPointAtLength(d)
    points.push([p.x, p.y])
  }
  return points
}

const RATING_STYLE: Record<DrawingRating, string> = {
  great:
    'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100',
  close: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100',
  retry: 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100',
}

/**
 * Canvas where the learner traces a jamo over a faint guide, then gets a
 * simple similarity check against the model strokes.
 * Give it `key={jamo}` so switching letters starts with a clean pad.
 */
export function HandwritingPad({ jamo }: { jamo: string }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modelRefs = useRef<SVGPathElement[]>([])
  const strokesRef = useRef<Point[][]>([])
  const drawingRef = useRef(false)
  const [showGuide, setShowGuide] = useState(true)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [canDraw, setCanDraw] = useState(true)
  const model = STROKES[jamo] ?? []

  // Redraws every stroke from the refs. It only reads refs, so it is stable.
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const scale = canvas.width / 100
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = PEN_WIDTH_PX * (window.devicePixelRatio || 1)
    ctx.strokeStyle = document.documentElement.classList.contains('dark')
      ? '#f8fafc'
      : '#0f172a'
    for (const stroke of strokesRef.current) {
      ctx.beginPath()
      const [[x0, y0], ...rest] = stroke
      ctx.moveTo(x0 * scale, y0 * scale)
      // A single tap still leaves a dot.
      if (rest.length === 0) ctx.lineTo(x0 * scale + 0.1, y0 * scale)
      for (const [x, y] of rest) ctx.lineTo(x * scale, y * scale)
      ctx.stroke()
    }
  }, [])

  // Size the canvas backing store to its CSS size × devicePixelRatio for crisp lines.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas?.getContext('2d')) {
      setCanDraw(false)
      return
    }
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const { width } = canvas.getBoundingClientRect()
      canvas.width = width * ratio
      canvas.height = width * ratio
      redraw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [redraw])

  function toPoint(e: PointerEvent<HTMLCanvasElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect()
    return [
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100,
    ]
  }

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = true
    strokesRef.current.push([toPoint(e)])
    setFeedback(null)
    redraw()
  }

  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    strokesRef.current[strokesRef.current.length - 1].push(toPoint(e))
    redraw()
  }

  function onPointerUp() {
    drawingRef.current = false
  }

  function clear() {
    strokesRef.current = []
    setFeedback(null)
    redraw()
  }

  function check() {
    const drawn = strokesRef.current
    if (drawn.length === 0) {
      setFeedback({ kind: 'empty' })
      return
    }
    const modelLines = modelRefs.current.filter(Boolean).map(samplePath)
    const result = scoreDrawing(
      rasterizePolylines(drawn, GRID, PEN_RADIUS),
      rasterizePolylines(modelLines, GRID, MODEL_RADIUS),
      1,
    )
    setFeedback({
      kind: 'rated',
      rating: rateDrawing(result.score),
      drawn: drawn.length,
      expected: model.length,
    })
    setShowGuide(true)
  }

  if (!canDraw) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t('hangul.writing.unsupported')}
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-square w-full max-w-72">
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
        >
          <g
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          >
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
          </g>
          {/* The model paths stay mounted (also used for scoring); only their opacity changes. */}
          <motion.g
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={
              feedback?.kind === 'rated'
                ? 'stroke-sky-300 dark:stroke-sky-700'
                : 'stroke-slate-200 dark:stroke-slate-700'
            }
            animate={{ opacity: showGuide ? 1 : 0 }}
          >
            {model.map((d, i) => (
              <path
                key={d}
                d={d}
                ref={(el) => {
                  if (el) modelRefs.current[i] = el
                }}
              />
            ))}
          </motion.g>
        </svg>
        <canvas
          ref={canvasRef}
          aria-label={t('hangul.writing.canvasLabel', { char: jamo })}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none rounded-2xl"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-sm"
          onClick={clear}
        >
          {t('hangul.writing.clear')}
        </Button>
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-sm"
          onClick={() => setShowGuide((s) => !s)}
          aria-pressed={showGuide}
        >
          {showGuide
            ? t('hangul.writing.hideGuide')
            : t('hangul.writing.showGuide')}
        </Button>
        <Button className="px-4 py-1.5 text-sm" onClick={check}>
          {t('hangul.writing.check')}
        </Button>
      </div>
      <div aria-live="polite" className="min-h-14 w-full max-w-72">
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={
                feedback.kind === 'rated'
                  ? `${feedback.rating}-${feedback.drawn}`
                  : 'empty'
              }
              variants={pop}
              initial="hidden"
              animate={
                feedback.kind === 'rated' && feedback.rating === 'retry'
                  ? { ...shake, opacity: 1, scale: 1 }
                  : 'visible'
              }
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                'rounded-xl px-3 py-2 text-center text-sm',
                feedback.kind === 'rated'
                  ? RATING_STYLE[feedback.rating]
                  : 'bg-slate-100 dark:bg-slate-800',
              )}
            >
              {feedback.kind === 'empty' ? (
                t('hangul.writing.empty')
              ) : (
                <>
                  <p className="font-semibold">
                    {t(`hangul.writing.${feedback.rating}`)}
                  </p>
                  {feedback.drawn !== feedback.expected && (
                    <p>
                      {t('hangul.writing.strokeCount', {
                        drawn: feedback.drawn,
                        expected: feedback.expected,
                      })}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
