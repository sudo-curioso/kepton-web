'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Heart, MapPin, Sparkles, TreePine } from 'lucide-react'
import type { ForestTree } from '@/lib/types/dashboard'
import type { ForestSummary } from '@/lib/forest/computeForest'
import { computeForestHealth, acresProgress } from '@/lib/forest/analytics'
import { computeTreePlacements, TREE_TYPE_COLORS } from '@/lib/forest/treeAssets'
import { formatTreeType } from '@/lib/dashboard/utils'
import ForestSceneCanvas from './ForestSceneCanvas'

type ForestViewportProps = {
  trees: ForestTree[]
  summary: ForestSummary
  newTreeId?: string | null
  live?: boolean
}

function Fireflies() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 16 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#22C55E]/80 shadow-[0_0_10px_#22C55E]"
          style={{
            left: `${10 + ((i * 17) % 80)}%`,
            top: `${15 + ((i * 23) % 55)}%`,
          }}
          animate={{ opacity: [0.2, 0.95, 0.2], y: [0, -10, 0] }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: (i % 5) * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function ForestViewport({ trees, summary, newTreeId, live }: ForestViewportProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const placements = computeTreePlacements(trees)
  const hovered = hoveredId ? placements.find(p => p.id === hoveredId)?.tree : null
  const health = computeForestHealth(summary)
  const acres = acresProgress(summary)
  const isNewHovered = hoveredId === newTreeId

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#07100c] shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="rounded-2xl border border-white/[0.1] bg-black/40 px-3 py-2 backdrop-blur-md sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#22C55E]">Forest island</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
            {summary.alive} trees · {summary.acres.toFixed(2)} acres
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-white/[0.1] bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400 backdrop-blur-md sm:inline-flex">
            4K
          </span>
          {live && (
            <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#22C55E]">
              Live
            </span>
          )}
          <div className="flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-black/40 px-3 py-2 backdrop-blur-md">
            <Heart className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-neutral-500">Health</p>
              <p className="text-xs font-bold text-white">{health}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] xl:min-h-[600px] 2xl:min-h-[680px]">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <ForestSceneCanvas trees={trees} newTreeId={newTreeId} onHoverChange={setHoveredId} />
        </motion.div>

        <Fireflies />

        {trees.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-sm rounded-3xl border border-white/[0.1] bg-black/50 px-6 py-8 backdrop-blur-xl"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/10">
                <TreePine className="h-7 w-7 text-[#22C55E]" aria-hidden />
              </span>
              <p className="mt-4 text-lg font-semibold text-white">Your island awaits its first tree</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Start a focus session in the Kepton app. When the timer completes, a tree will appear here in real time.
              </p>
            </motion.div>
          </div>
        )}

        {isNewHovered && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute left-1/2 top-[18%] z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#22C55E] backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3" aria-hidden />
            Planted
          </motion.span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-gradient-to-t from-black/80 to-black/40 p-4 backdrop-blur-md sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {hovered ? (
              <motion.div key={hovered.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-semibold text-white">{formatTreeType(hovered.tree_type)}</p>
                <p className="text-xs text-neutral-400">
                  {hovered.timer_duration} min focus · {hovered.status}
                  {hoveredId && (
                    <span
                      className="ml-2 inline-block h-2 w-2 rounded-full align-middle"
                      style={{ backgroundColor: TREE_TYPE_COLORS[hovered.tree_type] ?? '#22c55e' }}
                      aria-hidden
                    />
                  )}
                </p>
              </motion.div>
            ) : (
              <p className="text-xs text-neutral-500">Hover a tree to see session details</p>
            )}
          </div>

          <div className="flex min-w-[200px] flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-neutral-500">
              <span>Next acre</span>
              <span>
                {acres.current.toFixed(2)} / {acres.next.toFixed(0)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#4ade80]"
                initial={{ width: 0 }}
                animate={{ width: `${acres.percent}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
