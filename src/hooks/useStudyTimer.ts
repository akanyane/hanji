import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { addStudyTime } from '../db/progress'
import { queryKeys } from '../db/queries'

export const STUDY_TICK_MS = 15_000
/** Without any interaction for this long, the learner is considered away. */
export const IDLE_AFTER_MS = 60_000

/**
 * Counts active study time: every tick adds time while the page is visible
 * and the learner interacted recently. Stored per day in IndexedDB.
 */
export function useStudyTimer(enabled = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return
    let lastActivity = Date.now()
    let ticks = 0
    const onActivity = () => {
      lastActivity = Date.now()
    }
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    for (const e of events)
      window.addEventListener(e, onActivity, { passive: true })

    const timer = window.setInterval(() => {
      const now = Date.now()
      if (document.visibilityState !== 'visible') return
      if (now - lastActivity > IDLE_AFTER_MS) return
      addStudyTime(STUDY_TICK_MS, now)
        .then(() => {
          // Refresh the dashboard about once a minute, not on every tick.
          if (++ticks % 4 === 0)
            queryClient.invalidateQueries({ queryKey: queryKeys.progress })
        })
        .catch(() => {
          // IndexedDB unavailable: time is simply not counted.
        })
    }, STUDY_TICK_MS)

    return () => {
      window.clearInterval(timer)
      for (const e of events) window.removeEventListener(e, onActivity)
    }
  }, [enabled, queryClient])
}
