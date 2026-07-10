import type { ForestTree, UserStreak } from '@/lib/types/dashboard'

export type ForestSummary = {
  alive: number
  dead: number
  acres: number
  totalFocusMinutes: number
  currentStreak: number
  longestStreak: number
  totalGrown: number
  totalLost: number
}

export function computeForestSummary(
  trees: ForestTree[],
  streak: UserStreak | null,
): ForestSummary {
  const aliveTrees = trees.filter(t => t.status === 'alive')
  const deadTrees = trees.filter(t => t.status === 'dead')

  const focusMinutes = aliveTrees.reduce((sum, t) => sum + (t.timer_duration ?? 0), 0)

  return {
    alive: aliveTrees.length,
    dead: deadTrees.length,
    acres: streak?.forest_acres ?? 0,
    totalFocusMinutes: focusMinutes,
    currentStreak: streak?.current_streak ?? 0,
    longestStreak: streak?.longest_streak ?? 0,
    totalGrown: streak?.total_trees_grown ?? aliveTrees.length,
    totalLost: streak?.total_trees_lost ?? deadTrees.length,
  }
}

export function sortTreesForDisplay(trees: ForestTree[]): ForestTree[] {
  return [...trees].sort(
    (a, b) => new Date(a.grown_at).getTime() - new Date(b.grown_at).getTime(),
  )
}

export function getAliveTreesForIsland(trees: ForestTree[], limit = 42): ForestTree[] {
  return sortTreesForDisplay(trees.filter(t => t.status === 'alive')).slice(-limit)
}
