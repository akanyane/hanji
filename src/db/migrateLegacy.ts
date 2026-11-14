import { db } from './db'
import { QUIZ_IDS, recordQuizAttempt } from './quizAttempts'

export const LEGACY_PROGRESS_KEY = 'hangul:quiz-progress'
const MIGRATION_KEY = 'migration:legacy-quiz-progress'

interface LegacyProgress {
  bestScore: number
  attempts: number
  lastPlayed: string | null
}

function parseLegacy(raw: string | null): LegacyProgress | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<LegacyProgress>
    if (
      typeof data.bestScore !== 'number' ||
      typeof data.attempts !== 'number' ||
      data.attempts <= 0
    ) {
      return null
    }
    return {
      bestScore: data.bestScore,
      attempts: data.attempts,
      lastPlayed: typeof data.lastPlayed === 'string' ? data.lastPlayed : null,
    }
  } catch {
    return null
  }
}

/**
 * Imports (once) the progress the old app version saved in localStorage.
 * The old version only stored the best score and the attempt count, so it
 * becomes a single record with `countsAs = attempts`.
 * The old localStorage value is kept, just in case.
 */
export async function migrateLegacyProgress(
  storage: Pick<Storage, 'getItem'> = window.localStorage,
): Promise<void> {
  await db.transaction('rw', db.quizAttempts, db.meta, async () => {
    if (await db.meta.get(MIGRATION_KEY)) return

    const legacy = parseLegacy(storage.getItem(LEGACY_PROGRESS_KEY))
    if (legacy) {
      const playedAt = legacy.lastPlayed ? Date.parse(legacy.lastPlayed) : NaN
      await recordQuizAttempt({
        quizId: QUIZ_IDS.hangulBasic,
        filter: 'all',
        score: legacy.bestScore,
        total: 10,
        completedAt: Number.isNaN(playedAt) ? Date.now() : playedAt,
        countsAs: legacy.attempts,
      })
    }

    await db.meta.put({ key: MIGRATION_KEY, value: Date.now() })
  })
}
