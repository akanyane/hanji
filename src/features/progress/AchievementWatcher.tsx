import { useEffect, useRef } from 'react'
import { META_KEYS, useMeta, useSetMeta } from '../../db/queries'
import { newlyUnlocked } from '../../lib/progress/achievements'
import { toastActions } from '../../stores/toasts'
import { useProgress } from './useProgress'

/** At most this many achievement toasts at once; the rest are summarized. */
const MAX_TOASTS = 3

/** Announces each achievement once, the first time it is unlocked. */
export function AchievementWatcher() {
  const progress = useProgress()
  const { data: seen } = useMeta<string[]>(META_KEYS.seenAchievements)
  const { mutate: saveSeen } = useSetMeta(META_KEYS.seenAchievements)
  const saving = useRef(false)

  useEffect(() => {
    if (!progress || seen === undefined || saving.current) return
    const fresh = newlyUnlocked(progress.achievements, seen ?? [])
    if (fresh.length === 0) return

    for (const id of fresh.slice(0, MAX_TOASTS))
      toastActions.push({
        id: `achievement-${id}`,
        icon:
          progress.achievements.find((a) => a.achievement.id === id)
            ?.achievement.icon ?? '상',
        title: (t) => t('progress.achievements.unlocked'),
        description: (t) =>
          t(`progress.achievements.items.${id}.title` as never),
      })
    if (fresh.length > MAX_TOASTS)
      toastActions.push({
        id: 'achievement-more',
        icon: '상',
        title: (t) =>
          t('progress.achievements.moreUnlocked', {
            count: fresh.length - MAX_TOASTS,
          }),
      })

    saving.current = true
    saveSeen([...(seen ?? []), ...fresh], {
      onSettled: () => {
        saving.current = false
      },
    })
  }, [progress, seen, saveSeen])

  return null
}
