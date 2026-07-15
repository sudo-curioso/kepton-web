'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import type { ForestTree } from '@/lib/types/dashboard'
import { formatRelativeTime } from '@/lib/dashboard/queries'
import { formatTreeType } from '@/lib/dashboard/utils'
import { treeImageSrc, TREE_TYPE_COLORS } from '@/lib/forest/treeAssets'

type ForestGrowthTimelineProps = {
  trees: ForestTree[]
  newTreeId?: string | null
}

export default function ForestGrowthTimeline({ trees, newTreeId }: ForestGrowthTimelineProps) {
  const items = [...trees].reverse()

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        Your growth timeline will appear here after your first focus session.
      </p>
    )
  }

  return (
    <ul className="relative max-h-[480px] space-y-0 overflow-y-auto pr-1">
      <div aria-hidden className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-[#22C55E]/40 via-white/[0.08] to-transparent" />

      {items.map((tree, i) => {
        const isNew = tree.id === newTreeId
        const color = TREE_TYPE_COLORS[tree.tree_type] ?? '#22c55e'
        const alive = tree.status === 'alive'

        return (
          <motion.li
            key={tree.id}
            layout
            initial={isNew ? { opacity: 0, x: 16 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="relative flex gap-4 py-3 pl-1"
          >
            <div className="relative z-10 shrink-0">
              <span
                className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border ${
                  alive ? 'border-white/[0.1] bg-white/[0.04]' : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                <Image
                  src={treeImageSrc(tree.tree_type, tree.status)}
                  alt=""
                  width={32}
                  height={32}
                  className={`h-8 w-8 object-contain [image-rendering:pixelated] [image-rendering:crisp-edges] ${alive ? '' : 'grayscale opacity-50'}`}
                />
              </span>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a]"
                style={{ backgroundColor: alive ? color : '#ef4444' }}
                aria-hidden
              />
            </div>

            <div className="min-w-0 flex-1 border-b border-white/[0.05] pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">
                    {alive ? formatTreeType(tree.tree_type) : 'Withered tree'}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {tree.timer_duration} min session ·{' '}
                    <span className={alive ? 'text-[#22C55E]' : 'text-red-400'}>{tree.status}</span>
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-neutral-600">{formatRelativeTime(tree.grown_at)}</span>
              </div>
              {isNew && (
                <span className="mt-2 inline-flex rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#22C55E]">
                  Just planted
                </span>
              )}
            </div>
          </motion.li>
        )
      })}
    </ul>
  )
}
