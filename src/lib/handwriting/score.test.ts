import { describe, expect, it } from 'vitest'
import {
  createGrid,
  dilate,
  type InkGrid,
  rasterizePolylines,
  rateDrawing,
  scoreDrawing,
} from './score'

/** Builds a grid from rows like "#..#" (# = ink). */
function grid(...rows: string[]): InkGrid {
  const g = createGrid(rows[0].length, rows.length)
  rows.forEach((row, y) => {
    ;[...row].forEach((c, x) => {
      if (c === '#') g.cells[y * g.width + x] = 1
    })
  })
  return g
}

const toRows = (g: InkGrid) =>
  Array.from({ length: g.height }, (_, y) =>
    Array.from({ length: g.width }, (_, x) =>
      g.cells[y * g.width + x] ? '#' : '.',
    ).join(''),
  )

// A horizontal line, like ㅡ.
const model = grid('.....', '.....', '#####', '.....', '.....')

describe('dilate', () => {
  it('grows ink by the given radius', () => {
    expect(toRows(dilate(grid('...', '.#.', '...'), 1))).toEqual([
      '###',
      '###',
      '###',
    ])
    expect(toRows(dilate(grid('#..', '...', '...'), 1))).toEqual([
      '##.',
      '##.',
      '...',
    ])
  })
})

describe('scoreDrawing', () => {
  it('gives a perfect score to an exact copy', () => {
    expect(scoreDrawing(model, model).score).toBe(1)
  })

  it('tolerates a line drawn one cell off', () => {
    const shifted = grid('.....', '#####', '.....', '.....', '.....')
    expect(scoreDrawing(shifted, model).score).toBe(1)
    expect(scoreDrawing(shifted, model, 0).score).toBe(0)
  })

  it('penalizes missing parts (low recall)', () => {
    const half = grid('.....', '.....', '##...', '.....', '.....')
    const result = scoreDrawing(half, model)
    expect(result.precision).toBe(1)
    expect(result.recall).toBeLessThan(1)
  })

  it('penalizes scribbles outside the model (low precision)', () => {
    const messy = grid('#...#', '.....', '#####', '.....', '#...#')
    const result = scoreDrawing(messy, model)
    expect(result.recall).toBe(1)
    expect(result.precision).toBeLessThan(1)
  })

  it('scores an empty drawing as 0', () => {
    expect(scoreDrawing(createGrid(5, 5), model).score).toBe(0)
  })

  it('rejects grids of different sizes', () => {
    expect(() => scoreDrawing(createGrid(4, 4), model)).toThrow()
  })
})

describe('rateDrawing', () => {
  it('maps scores to ratings', () => {
    expect(rateDrawing(0.9)).toBe('great')
    expect(rateDrawing(0.6)).toBe('close')
    expect(rateDrawing(0.2)).toBe('retry')
  })
})

describe('rasterizePolylines', () => {
  it('draws a horizontal line across the middle row', () => {
    const g = rasterizePolylines(
      [
        [
          [0, 50],
          [100, 50],
        ],
      ],
      5,
      5,
    )
    expect(toRows(g)).toEqual(['.....', '.....', '#####', '.....', '.....'])
  })

  it('stamps a single point', () => {
    const g = rasterizePolylines([[[50, 50]]], 5, 5)
    expect(toRows(g)[2]).toBe('..#..')
  })

  it('scores a hand-drawn line against the same model line', () => {
    const model = rasterizePolylines(
      [
        [
          [12, 50],
          [88, 50],
        ],
      ],
      50,
      6,
    )
    const wobbly = rasterizePolylines(
      [
        [
          [14, 52],
          [50, 47],
          [86, 51],
        ],
      ],
      50,
      4,
    )
    expect(scoreDrawing(wobbly, model).score).toBeGreaterThan(0.75)
    const vertical = rasterizePolylines(
      [
        [
          [50, 12],
          [50, 88],
        ],
      ],
      50,
      4,
    )
    expect(scoreDrawing(vertical, model).score).toBeLessThan(0.5)
  })
})
