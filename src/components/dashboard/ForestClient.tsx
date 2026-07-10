'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Flame, History, Leaf, Radio, Skull, Timer, TreePine, BarChart3 } from 'lucide-react'
import type { ForestData } from '@/lib/types/forest'
import { useForestRealtime } from '@/lib/hooks/useForestRealtime'
import {
  computeForestHealth,
  computeMilestones,
  computeTreeBreakdown,
} from '@/lib/forest/analytics'
import DashboardHeader from './DashboardHeader'
import ForestViewport from './ForestViewport'
import ForestGrowthTimeline from './ForestGrowthTimeline'
import ForestInsights from './ForestInsights'
import YourPlanBadge from './YourPlanBadge'

type ForestClientProps = {
  initialData: ForestData
}

type SidebarTab = 'timeline' | 'insights'

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  icon: typeof TreePine
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">{label}</p>
          <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${accent ? 'text-[#22C55E]' : 'text-white'}`}>
            {value}
          </p>
          {sub && <p className="mt-0.5 text-[11px] text-neutral-600">{sub}</p>}
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            accent
              ? 'border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E]'
              : 'border-white/[0.08] bg-white/[0.04] text-neutral-400'
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </div>
  )
}

export default function ForestClient({ initialData }: ForestClientProps) {
  const { data, live, newTreeId } = useForestRealtime(initialData.profile.id, initialData)
  const { summary, islandTrees, recentTrees } = data
  const [tab, setTab] = useState<SidebarTab>('timeline')

  const breakdown = useMemo(() => computeTreeBreakdown(data.allTrees), [data.allTrees])
  const milestones = useMemo(() => computeMilestones(summary), [summary])
  const health = computeForestHealth(summary)

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(34,197,94,0.16),transparent_60%)]"
      />

      <DashboardHeader profile={data.profile} live={live} />

      <main className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Your forest</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px]">
              {summary.alive === 0 ? 'A blank island, ready to grow' : `${summary.alive} trees across your island`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              Every completed focus session in the Kepton app plants a tree here instantly. Explore your island,
              track growth, and watch your forest expand in real time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
              <Radio className={`h-3.5 w-3.5 ${live ? 'text-[#22C55E]' : 'text-neutral-600'}`} aria-hidden />
              {live ? 'Syncing live' : 'Connecting…'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
              {health}% forest health
            </span>
          </div>
        </motion.header>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Alive trees" value={summary.alive} icon={TreePine} accent sub="On your island" />
          <StatCard label="Forest acres" value={summary.acres.toFixed(2)} icon={Leaf} sub="Total land grown" />
          <StatCard
            label="Day streak"
            value={summary.currentStreak}
            icon={Flame}
            accent
            sub={`Best: ${summary.longestStreak} days`}
          />
          <StatCard label="Focus invested" value={`${summary.totalFocusMinutes}m`} icon={Timer} sub="In living trees" />
          <StatCard label="Trees lost" value={summary.dead} icon={Skull} sub={`${summary.totalLost} total`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <ForestViewport
              trees={islandTrees}
              summary={summary}
              newTreeId={newTreeId}
              live={live}
            />
            <p className="mt-3 text-center text-xs text-neutral-600">
              Displaying {islandTrees.length} of {summary.alive} alive trees · updates when you complete sessions in the app
            </p>
          </section>

          <aside className="space-y-4">
            <YourPlanBadge profile={data.profile} />

            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
              <div className="flex border-b border-white/[0.06] p-1">
                {(
                  [
                    { id: 'timeline' as const, label: 'Growth log', icon: History },
                    { id: 'insights' as const, label: 'Insights', icon: BarChart3 },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-semibold transition-colors ${
                      tab === id
                        ? 'bg-white/[0.08] text-white'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {tab === 'timeline' ? (
                  <>
                    <p className="mb-1 text-sm font-semibold text-white">Growth timeline</p>
                    <p className="mb-4 text-xs text-neutral-500">Newest sessions appear at the top</p>
                    <ForestGrowthTimeline trees={recentTrees} newTreeId={newTreeId} />
                  </>
                ) : (
                  <ForestInsights
                    breakdown={breakdown}
                    milestones={milestones}
                    totalAlive={summary.alive}
                  />
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
