// Jamo-level comparison between an expected sentence and what the learner
// said (or typed).
//
// Comparing whole syllables is too harsh: 갔어요 vs 갓어요 differ in one jamo,
// not one syllable. So both texts are broken into basic jamo (compounds
// split: 왔 → ㅇ ㅗ ㅏ ㅆ) and compared with Levenshtein edit distance. The
// alignment is then mapped back to the expected syllables so the UI can
// highlight exactly where the learner went wrong.
//
// Spaces and punctuation are ignored: speech recognition is inconsistent
// about them.

import { decompose, splitCompound } from '../hangul'

export type SyllableStatus = 'correct' | 'partial' | 'wrong' | 'ignored'

export interface SyllableResult {
  char: string
  status: SyllableStatus
}

export interface SimilarityResult {
  /** 0 (nothing matches) to 1 (identical), based on jamo edit distance. */
  score: number
  /** Number of jamo insertions, deletions and substitutions. */
  distance: number
  /** One entry per character of the expected text. */
  syllables: SyllableResult[]
}

interface Unit {
  jamo: string
  /** Index of the expected character this unit belongs to. */
  charIndex: number
}

const IGNORED = /[\s\p{P}\p{S}]/u

function toUnits(text: string): Unit[] {
  const units: Unit[] = []
  ;[...text].forEach((char, charIndex) => {
    if (IGNORED.test(char)) return
    const syllable = decompose(char)
    const jamo = syllable
      ? [syllable.initial, syllable.medial, syllable.final]
          .filter(Boolean)
          .flatMap(splitCompound)
      : splitCompound(char.toLowerCase())
    for (const j of jamo) units.push({ jamo: j, charIndex })
  })
  return units
}

/** Compares `actual` against `expected` at the jamo level. */
export function compareJamo(
  expected: string,
  actual: string,
): SimilarityResult {
  const chars = [...expected]
  const a = toUnits(expected)
  const b = toUnits(actual)

  // Standard Levenshtein DP table: dp[i][j] = distance between a[:i] and b[:j].
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1].jamo === b[j - 1].jamo ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      )
    }
  }

  // Walk back through the table to find which expected jamo were matched.
  // On ties, prefer deleting expected jamo: walking backwards, this keeps a
  // missing syllable's jamo together (감사합니다 vs 감사니다 → 합 is missing)
  // instead of spreading the gap over neighboring syllables.
  const matched = new Array<boolean>(a.length).fill(false)
  let i = a.length
  let j = b.length
  while (i > 0 && j > 0) {
    const cost = a[i - 1].jamo === b[j - 1].jamo ? 0 : 1
    if (dp[i][j] === dp[i - 1][j] + 1) {
      i--
    } else if (dp[i][j] === dp[i - 1][j - 1] + cost) {
      matched[i - 1] = cost === 0
      i--
      j--
    } else {
      j--
    }
  }

  const totals = new Map<number, { units: number; matched: number }>()
  a.forEach((unit, k) => {
    const t = totals.get(unit.charIndex) ?? { units: 0, matched: 0 }
    t.units++
    if (matched[k]) t.matched++
    totals.set(unit.charIndex, t)
  })

  const syllables = chars.map((char, index): SyllableResult => {
    const t = totals.get(index)
    if (!t) return { char, status: 'ignored' }
    const status: SyllableStatus =
      t.matched === t.units ? 'correct' : t.matched === 0 ? 'wrong' : 'partial'
    return { char, status }
  })

  const distance = dp[a.length][b.length]
  const longest = Math.max(a.length, b.length)
  return {
    score: longest === 0 ? 1 : 1 - distance / longest,
    distance,
    syllables,
  }
}
