import { describe, expect, it } from 'vitest'
import { scoreExam } from '../../features/progress/exam'
import { estimateTopikLevel, MOCK_EXAMS } from '../topik/mock'
import {
  PLACEMENT_QUESTIONS,
  PLACEMENT_RECOMMENDATIONS,
  placementLevel,
} from './placement'

describe('placement test content', () => {
  it('has four questions per level with unique ids', () => {
    const ids = PLACEMENT_QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const level of [0, 1, 2, 3])
      expect(PLACEMENT_QUESTIONS.filter((q) => q.level === level)).toHaveLength(
        4,
      )
  })

  it('has four distinct choices and a valid answer per question', () => {
    for (const q of PLACEMENT_QUESTIONS) {
      expect(q.choices).toHaveLength(4)
      const keys = q.choices.map((c) => (typeof c === 'string' ? c : c.en))
      expect(new Set(keys).size).toBe(4)
      expect(q.choices[q.answer]).toBeDefined()
    }
  })

  it('places by consecutive levels passed', () => {
    expect(placementLevel({ 0: 1, 1: 4, 2: 4, 3: 4 })).toBe(0)
    expect(placementLevel({ 0: 4, 1: 3, 2: 2, 3: 4 })).toBe(2)
    expect(placementLevel({ 0: 4, 1: 4, 2: 4, 3: 3 })).toBe(4)
    expect(PLACEMENT_RECOMMENDATIONS).toHaveLength(5)
  })
})

describe('TOPIK mock content', () => {
  it('follows the TOPIK I structure', () => {
    for (const exam of MOCK_EXAMS) {
      const ids = exam.questions.map((q) => q.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect(exam.questions.reduce((sum, q) => sum + q.points, 0)).toBe(100)
      for (const q of exam.questions) {
        expect(new Set(q.choices).size).toBe(4)
        if (q.section === 'listening') {
          expect(q.audio?.length).toBeGreaterThan(0)
          expect(q.passage).toBeUndefined()
        } else {
          expect(q.passage).toBeTruthy()
          expect(q.audio).toBeUndefined()
        }
        expect(q.translation.en).toBeTruthy()
        expect(q.translation['pt-BR']).toBeTruthy()
      }
    }
  })

  it('uses the TOPIK I level ratios (80/200 and 140/200)', () => {
    expect(estimateTopikLevel(79, 200)).toBe(0)
    expect(estimateTopikLevel(80, 200)).toBe(1)
    expect(estimateTopikLevel(139, 200)).toBe(1)
    expect(estimateTopikLevel(140, 200)).toBe(2)
  })

  it('scores answers by points and section', () => {
    const exam = MOCK_EXAMS[0]
    const allRight = Object.fromEntries(exam.questions.map((q) => [q.id, 0]))
    expect(scoreExam(exam, allRight)).toMatchObject({
      score: 100,
      max: 100,
      level: 2,
      sections: {
        listening: { correct: 10, total: 10 },
        reading: { correct: 10, total: 10 },
      },
    })
    const half = Object.fromEntries(
      exam.questions.map((q, i) => [q.id, i % 2 === 0 ? 0 : 1]),
    )
    expect(scoreExam(exam, half)).toMatchObject({ score: 50, level: 1 })
    expect(scoreExam(exam, {})).toMatchObject({ score: 0, level: 0 })
  })
})
