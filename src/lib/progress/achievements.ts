// Achievements are data: each one reads a number from the progress stats and
// unlocks when it reaches the goal. The same number drives the progress bar
// of locked achievements. Titles and descriptions live in the i18n catalogs
// under `progress.achievements.items.<id>`.

import { type ProgressStats, passedCount, SKILLS } from './progress'

export interface AchievementContext {
  stats: ProgressStats
  placementDone: boolean
}

export interface Achievement {
  /** Stable id (stored as "seen" in the database: never rename). */
  id: string
  /** Seal inscription: one to four Korean characters. */
  icon: string
  goal: number
  metric: (ctx: AchievementContext) => number
}

const practicedSkills = ({ stats }: AchievementContext) =>
  SKILLS.filter((s) => stats.skills[s].total > 0).length

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'firstSteps', icon: '첫', goal: 1, metric: ({ stats }) => stats.xp },
  {
    id: 'placement',
    icon: '길',
    goal: 1,
    metric: ({ placementDone }) => Number(placementDone),
  },
  {
    id: 'streak3',
    icon: '삼일',
    goal: 3,
    metric: ({ stats }) => stats.streak.longest,
  },
  {
    id: 'streak7',
    icon: '칠일',
    goal: 7,
    metric: ({ stats }) => stats.streak.longest,
  },
  {
    id: 'streak30',
    icon: '한달',
    goal: 30,
    metric: ({ stats }) => stats.streak.longest,
  },
  { id: 'xp100', icon: '백', goal: 100, metric: ({ stats }) => stats.xp },
  { id: 'xp1000', icon: '천', goal: 1000, metric: ({ stats }) => stats.xp },
  { id: 'xp5000', icon: '오천', goal: 5000, metric: ({ stats }) => stats.xp },
  {
    id: 'hangulMaster',
    icon: '한글',
    goal: 1,
    metric: ({ stats }) => passedCount(stats, 'hangul-'),
  },
  {
    id: 'words10',
    icon: '말',
    goal: 10,
    metric: ({ stats }) => stats.wordsLearned,
  },
  {
    id: 'words50',
    icon: '단어',
    goal: 50,
    metric: ({ stats }) => stats.wordsLearned,
  },
  {
    id: 'words200',
    icon: '숲',
    goal: 200,
    metric: ({ stats }) => stats.wordsLearned,
  },
  {
    id: 'reviews100',
    icon: '복습',
    goal: 100,
    metric: ({ stats }) => stats.reviews,
  },
  {
    id: 'perfect',
    icon: '완벽',
    goal: 1,
    metric: ({ stats }) => stats.perfectQuizzes,
  },
  {
    id: 'grammar5',
    icon: '문법',
    goal: 5,
    metric: ({ stats }) => passedCount(stats, 'grammar:'),
  },
  {
    id: 'grammar15',
    icon: '달인',
    goal: 15,
    metric: ({ stats }) => passedCount(stats, 'grammar:'),
  },
  {
    id: 'reader',
    icon: '읽기',
    goal: 3,
    metric: ({ stats }) => passedCount(stats, 'reading:'),
  },
  {
    id: 'conversation',
    icon: '대화',
    goal: 5,
    metric: ({ stats }) =>
      passedCount(stats, 'dialogues:') +
      passedCount(stats, 'listening:dialogue:'),
  },
  {
    id: 'allRounder',
    icon: '두루',
    goal: 6,
    metric: practicedSkills,
  },
  {
    id: 'studyHour',
    icon: '시간',
    goal: 60,
    metric: ({ stats }) => Math.floor(stats.studyMs / 60_000),
  },
  {
    id: 'topik1',
    icon: '일급',
    goal: 40,
    metric: ({ stats }) => Math.round((stats.bestMock ?? 0) * 100),
  },
  {
    id: 'topik2',
    icon: '이급',
    goal: 70,
    metric: ({ stats }) => Math.round((stats.bestMock ?? 0) * 100),
  },
]

export interface AchievementStatus {
  achievement: Achievement
  value: number
  unlocked: boolean
  /** 0–1 */
  ratio: number
}

export function evaluateAchievements(
  ctx: AchievementContext,
): AchievementStatus[] {
  return ACHIEVEMENTS.map((achievement) => {
    const value = achievement.metric(ctx)
    return {
      achievement,
      value,
      unlocked: value >= achievement.goal,
      ratio: Math.min(1, value / achievement.goal),
    }
  })
}

/** Unlocked achievements not in `seen` (to announce them once). */
export function newlyUnlocked(
  statuses: AchievementStatus[],
  seen: readonly string[],
): string[] {
  return statuses
    .filter((s) => s.unlocked && !seen.includes(s.achievement.id))
    .map((s) => s.achievement.id)
}
