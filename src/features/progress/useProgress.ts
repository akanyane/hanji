import { useMemo } from 'react'
import type { PlacementResult } from '../../content/progress/placement'
import { META_KEYS, useMeta, useProgressData } from '../../db/queries'
import { evaluateAchievements } from '../../lib/progress/achievements'
import { computeProgress } from '../../lib/progress/progress'

/** Progress stats + achievements, or null while loading. */
export function useProgress() {
  const { data } = useProgressData()
  const { data: placement } = useMeta<PlacementResult>(META_KEYS.placement)

  return useMemo(() => {
    if (!data || placement === undefined) return null
    const stats = computeProgress(data)
    return {
      stats,
      placement,
      achievements: evaluateAchievements({
        stats,
        placementDone: placement !== null,
      }),
    }
  }, [data, placement])
}

export type ProgressView = NonNullable<ReturnType<typeof useProgress>>
