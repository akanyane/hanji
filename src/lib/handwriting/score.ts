// Simple handwriting check: compares the learner's drawing with the model
// character on a coarse grid of "ink" cells.
//
// - precision: how much of what the learner drew lies on the model
//   (low = scribbles outside the letter);
// - recall: how much of the model the learner covered
//   (low = missing strokes).
//
// Both use a small tolerance (dilation) so slightly-off lines still count.
// The score is their harmonic mean (F1). This doesn't check stroke
// direction, but the stroke count is compared separately by the UI.

export interface InkGrid {
  width: number
  height: number
  /** Row-major cells, 1 = ink, 0 = empty. */
  cells: Uint8Array
}

export function createGrid(width: number, height: number): InkGrid {
  return { width, height, cells: new Uint8Array(width * height) }
}

/** Grows every ink cell by `radius` cells in each direction (square neighborhood). */
export function dilate(grid: InkGrid, radius: number): InkGrid {
  if (radius <= 0) return grid
  const { width, height, cells } = grid
  const out = createGrid(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!cells[y * width + x]) continue
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
            out.cells[ny * width + nx] = 1
          }
        }
      }
    }
  }
  return out
}

function countInk(grid: InkGrid) {
  let total = 0
  for (const cell of grid.cells) total += cell
  return total
}

/** Fraction of `a`'s ink cells that are also ink in `b`. */
function overlap(a: InkGrid, b: InkGrid) {
  const total = countInk(a)
  if (total === 0) return 0
  let hits = 0
  for (let i = 0; i < a.cells.length; i++) if (a.cells[i] && b.cells[i]) hits++
  return hits / total
}

export interface DrawingScore {
  precision: number
  recall: number
  /** 0–1 harmonic mean of precision and recall. */
  score: number
}

export function scoreDrawing(
  drawn: InkGrid,
  model: InkGrid,
  tolerance = 1,
): DrawingScore {
  if (drawn.width !== model.width || drawn.height !== model.height) {
    throw new Error('Grids must have the same size')
  }
  const precision = overlap(drawn, dilate(model, tolerance))
  const recall = overlap(model, dilate(drawn, tolerance))
  const score =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) / (precision + recall)
  return { precision, recall, score }
}

export type DrawingRating = 'great' | 'close' | 'retry'

export function rateDrawing(score: number): DrawingRating {
  if (score >= 0.75) return 'great'
  if (score >= 0.5) return 'close'
  return 'retry'
}

export type Point = [x: number, y: number]

/**
 * Rasterizes strokes (polylines in a 0..extent coordinate space) into a
 * size×size grid, stamping a disc of `radius` (in the same units) along
 * every segment. Used for both the learner's strokes and the model.
 */
export function rasterizePolylines(
  polylines: Point[][],
  size: number,
  radius: number,
  extent = 100,
): InkGrid {
  const grid = createGrid(size, size)
  const scale = size / extent
  const r = radius * scale

  const stamp = (px: number, py: number) => {
    const cx = px * scale
    const cy = py * scale
    for (
      let y = Math.max(0, Math.floor(cy - r));
      y <= Math.min(size - 1, Math.ceil(cy + r));
      y++
    ) {
      for (
        let x = Math.max(0, Math.floor(cx - r));
        x <= Math.min(size - 1, Math.ceil(cx + r));
        x++
      ) {
        // Compare against the cell center.
        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r)
          grid.cells[y * size + x] = 1
      }
    }
  }

  // Sample every half cell so no gaps appear between stamps.
  const step = extent / size / 2
  for (const line of polylines) {
    if (line.length === 1) stamp(line[0][0], line[0][1])
    for (let i = 1; i < line.length; i++) {
      const [x0, y0] = line[i - 1]
      const [x1, y1] = line[i]
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step))
      for (let s = 0; s <= steps; s++) {
        stamp(x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps)
      }
    }
  }
  return grid
}
