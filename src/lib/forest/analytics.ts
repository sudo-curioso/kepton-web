import type { ForestTree } from '@/lib/types/dashboard'
import type { ForestSummary } from './computeForest'
import { formatTreeType } from '@/lib/dashboard/utils'

export type TreeTypeCount = {
  type: string
  label: string
  count: number
  minutes: number
}

export type ForestMilestone = {
  id: string
  label: string
  target: number
  current: number
  unit: string
  achieved: boolean
}

export function computeForestHealth(summary: ForestSummary): number {
  const total = summary.alive + summary.dead
  if (total === 0) return 100
  return Math.round((summary.alive / total) * 100)
}

export function computeTreeBreakdown(trees: ForestTree[]): TreeTypeCount[] {
  const alive = trees.filter(t => t.status === 'alive')
  const map = new Map<string, TreeTypeCount>()

  for (const tree of alive) {
    const existing = map.get(tree.tree_type)
    if (existing) {
      existing.count += 1
      existing.minutes += tree.timer_duration ?? 0
    } else {
      map.set(tree.tree_type, {
        type: tree.tree_type,
        label: formatTreeType(tree.tree_type),
        count: 1,
        minutes: tree.timer_duration ?? 0,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

export function computeMilestones(summary: ForestSummary): ForestMilestone[] {
  return [
    {
      id: 'first-tree',
      label: 'First tree planted',
      target: 1,
      current: summary.alive,
      unit: 'trees',
      achieved: summary.alive >= 1,
    },
    {
      id: 'five-trees',
      label: 'Small grove',
      target: 5,
      current: summary.alive,
      unit: 'trees',
      achieved: summary.alive >= 5,
    },
    {
      id: 'ten-trees',
      label: 'Thriving forest',
      target: 10,
      current: summary.alive,
      unit: 'trees',
      achieved: summary.alive >= 10,
    },
    {
      id: 'one-acre',
      label: 'One forest acre',
      target: 1,
      current: summary.acres,
      unit: 'acres',
      achieved: summary.acres >= 1,
    },
    {
      id: 'week-streak',
      label: '7-day streak',
      target: 7,
      current: summary.currentStreak,
      unit: 'days',
      achieved: summary.currentStreak >= 7,
    },
  ]
}

export function acresProgress(summary: ForestSummary): { current: number; next: number; percent: number } {
  const current = summary.acres
  const floor = Math.floor(current)
  const next = floor + 1
  const fraction = current - floor
  return {
    current,
    next,
    percent: Math.min(100, Math.round(fraction * 100)),
  }
}
