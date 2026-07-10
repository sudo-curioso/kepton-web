import type { DashboardProfile, ForestTree, UserStreak } from '@/lib/types/dashboard'
import { computeForestSummary, getAliveTreesForIsland, sortTreesForDisplay } from '@/lib/forest/computeForest'

export type ForestData = {
  profile: DashboardProfile
  streak: UserStreak | null
  allTrees: ForestTree[]
  islandTrees: ForestTree[]
  recentTrees: ForestTree[]
  summary: ReturnType<typeof computeForestSummary>
}

export { computeForestSummary, getAliveTreesForIsland }

export function buildForestData(
  profile: DashboardProfile,
  streak: UserStreak | null,
  trees: ForestTree[],
): ForestData {
  const sorted = sortTreesForDisplay(trees)
  return {
    profile,
    streak,
    allTrees: sorted,
    islandTrees: getAliveTreesForIsland(sorted),
    recentTrees: [...sorted].reverse().slice(0, 20),
    summary: computeForestSummary(sorted, streak),
  }
}
