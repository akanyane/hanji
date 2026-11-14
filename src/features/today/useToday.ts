import { useMemo } from 'react'
import { useProgressData } from '../../db/queries'
import { useSettings } from '../../stores/settings'
import { useProgress } from '../progress/useProgress'
import { goalProgress, planDay } from './plan'

/** Today's plan, daily goal and streak; null while loading. */
export function useToday() {
  const progress = useProgress()
  const { data } = useProgressData()
  const newPerSession = useSettings((s) => s.newPerSession)
  const dailyGoal = useSettings((s) => s.dailyGoal)

  return useMemo(() => {
    if (!progress || !data) return null
    const tasks = planDay({
      data,
      placementLevel: progress.placement?.level ?? null,
      newPerSession,
    })
    const todayXp = progress.stats.daily[progress.stats.daily.length - 1].xp
    return {
      tasks,
      done: tasks.filter((t) => t.done).length,
      goal: goalProgress(todayXp, dailyGoal),
      streak: progress.stats.streak,
      isNewLearner: progress.stats.xp === 0 && progress.placement === null,
    }
  }, [progress, data, newPerSession, dailyGoal])
}

export type TodayView = NonNullable<ReturnType<typeof useToday>>
