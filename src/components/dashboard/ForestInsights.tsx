'use client'

import { motion } from 'motion/react'
import { Check, Lock } from 'lucide-react'
import type { TreeTypeCount, ForestMilestone } from '@/lib/forest/analytics'
import { TREE_TYPE_COLORS } from '@/lib/forest/treeAssets'

type ForestInsightsProps = {
  breakdown: TreeTypeCount[]
  milestones: ForestMilestone[]
  totalAlive: number
}

export default function ForestInsights({ breakdown, milestones, totalAlive }: ForestInsightsProps) {
  const maxCount = Math.max(1, ...breakdown.map(b => b.count))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white">Tree composition</h3>
        <p className="mt-0.5 text-xs text-neutral-500">Breakdown of your living forest</p>

        {breakdown.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">No trees to analyze yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {breakdown.map((item, i) => {
              const color = TREE_TYPE_COLORS[item.type] ?? '#22c55e'
              const pct = Math.round((item.count / totalAlive) * 100)

              return (
                <motion.li
                  key={item.type}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-300">{item.label}</span>
                    <span className="text-neutral-500">
                      {item.count} · {item.minutes}m focus
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-neutral-600">{pct}% of forest</p>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Milestones</h3>
        <p className="mt-0.5 text-xs text-neutral-500">Progress toward forest goals</p>
        <ul className="mt-4 space-y-2">
          {milestones.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                m.achieved
                  ? 'border-[#22C55E]/25 bg-[#22C55E]/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  m.achieved
                    ? 'bg-[#22C55E]/20 text-[#22C55E]'
                    : 'bg-white/[0.04] text-neutral-600'
                }`}
              >
                {m.achieved ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Lock className="h-3.5 w-3.5" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium ${m.achieved ? 'text-white' : 'text-neutral-400'}`}>
                  {m.label}
                </p>
                <p className="text-[10px] text-neutral-600">
                  {m.achieved
                    ? 'Achieved'
                    : `${Math.min(m.current, m.target)} / ${m.target} ${m.unit}`}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
