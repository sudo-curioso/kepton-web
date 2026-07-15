'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Activity,
  CheckCircle2,
  Flame,
  Leaf,
  ListTodo,
  Radio,
  Sparkles,
  Timer,
  TreePine,
} from 'lucide-react'
import type { DashboardData, FocusSession, ForestTree, KeptonTask } from '@/lib/types/dashboard'
import { createClient } from '@/lib/supabase/client'
import { buildActivity, formatRelativeTime } from '@/lib/dashboard/queries'
import { formatTreeType } from '@/lib/dashboard/utils'
import { treeImageSrc } from '@/lib/forest/treeAssets'
import GooglePlayDownloadButton from '@/components/GooglePlayDownloadButton'
import DashboardHeader from './DashboardHeader'
import YourPlanBadge from './YourPlanBadge'

type DashboardClientProps = {
  initialData: DashboardData
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  icon: typeof Flame
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">{label}</p>
          <p className={`mt-2 text-3xl font-semibold tracking-tight ${accent ? 'text-[#22C55E]' : 'text-white'}`}>
            {value}
          </p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accent ? 'border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E]' : 'border-white/[0.08] bg-white/[0.04] text-neutral-400'}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  )
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState(initialData)
  const [live, setLive] = useState(false)

  const mergeRefresh = useCallback((partial: Partial<DashboardData>) => {
    setData(prev => ({ ...prev, ...partial }))
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const userId = initialData.profile.id

    const channel = supabase
      .channel(`dashboard-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
        () => {
          supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .in('bucket', ['today', 'week'])
            .order('created_at', { ascending: false })
            .limit(20)
            .then(({ data: tasks }) => {
              const list = tasks ?? []
              mergeRefresh({
                tasks: list.filter(t => t.bucket === 'today').slice(0, 8),
              })
            })
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_streaks', filter: `user_id=eq.${userId}` },
        () => {
          supabase
            .from('user_streaks')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()
            .then(({ data: streak }) => mergeRefresh({ streak }))
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forest_trees', filter: `user_id=eq.${userId}` },
        () => {
          Promise.all([
            supabase
              .from('forest_trees')
              .select('*')
              .eq('user_id', userId)
              .order('grown_at', { ascending: false })
              .limit(24),
            supabase.from('tasks').select('*').eq('user_id', userId).limit(20),
            supabase.from('focus_sessions').select('*').eq('user_id', userId).limit(20),
          ]).then(([treesRes, tasksRes, sessionsRes]) => {
            const trees = (treesRes.data ?? []) as ForestTree[]
            const tasks = (tasksRes.data ?? []) as KeptonTask[]
            const sessions = (sessionsRes.data ?? []) as FocusSession[]
            mergeRefresh({
              recentTrees: trees.slice(0, 6),
              activity: buildActivity(tasks, trees, sessions),
            })
          })
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'focus_sessions', filter: `user_id=eq.${userId}` },
        () => {
          supabase
            .from('focus_sessions')
            .select('*')
            .eq('user_id', userId)
            .limit(20)
            .then(({ data: sessions }) => {
              const list = sessions ?? []
              mergeRefresh({ recentSessions: list.slice(0, 8) })
            })
        },
      )
      .subscribe(status => setLive(status === 'SUBSCRIBED'))

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialData.profile.id, mergeRefresh])

  const streak = data.streak
  const stats = useMemo(
    () => [
      { label: 'Day streak', value: streak?.current_streak ?? 0, icon: Flame, accent: true },
      { label: 'Trees grown', value: streak?.total_trees_grown ?? 0, icon: TreePine },
      { label: 'Forest acres', value: (streak?.forest_acres ?? 0).toFixed(2), icon: Leaf },
      { label: 'Focus today', value: `${data.stats.focusMinutesToday}m`, icon: Timer },
    ],
    [streak, data.stats.focusMinutesToday],
  )

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]"
      />

      <DashboardHeader profile={data.profile} live={live} />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {data.profile.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-400 sm:text-base">
              Live sync from your Kepton app — tasks, focus sessions, and forest growth update here in real time.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
            <Radio className={`h-3.5 w-3.5 ${live ? 'text-[#22C55E]' : 'text-neutral-600'}`} aria-hidden />
            {live ? 'Realtime connected' : 'Connecting…'}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-[#22C55E]" aria-hidden />
                <h2 className="text-lg font-semibold">Today&apos;s tasks</h2>
              </div>
              <span className="text-xs text-neutral-500">{data.stats.tasksPending} pending</span>
            </div>

            {data.tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] px-5 py-10 text-center">
                <p className="text-sm text-neutral-400">No tasks for today yet.</p>
                <p className="mt-1 text-xs text-neutral-600">Create a task in the Kepton app to see it here instantly.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {data.tasks.map(task => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{task.title}</p>
                      <p className="mt-1 text-xs capitalize text-neutral-500">
                        {task.status.replace('_', ' ')} · priority {task.priority}
                      </p>
                    </div>
                    {task.status === 'done' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#22C55E]" aria-hidden />
                    ) : (
                      <span className="shrink-0 rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                        {task.status}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <YourPlanBadge profile={data.profile} />
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#22C55E]" aria-hidden />
              <h2 className="text-lg font-semibold">Get the app</h2>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Your dashboard syncs with the mobile app. Download Kepton on Android to grow trees, run focus timers, and
              keep your forest alive.
            </p>
            <div className="mt-5">
              <GooglePlayDownloadButton size="md" showHint />
            </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-[#22C55E]" aria-hidden />
                <h2 className="text-lg font-semibold">Recent forest growth</h2>
              </div>
              <Link
                href="/dashboard/forest"
                className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E] transition-colors hover:bg-[#22C55E]/20"
              >
                Open forest
              </Link>
            </div>
            {data.recentTrees.length === 0 ? (
              <p className="text-sm text-neutral-500">Complete a focus session in the app to plant your first tree.</p>
            ) : (
              <ul className="space-y-2">
                {data.recentTrees.map(tree => (
                  <li
                    key={tree.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
                      <Image
                        src={treeImageSrc(tree.tree_type, tree.status)}
                        alt={`${formatTreeType(tree.tree_type)} ${tree.status === 'alive' ? 'growing' : 'withered'} in your Kepton forest`}
                        width={32}
                        height={32}
                        className={`h-8 w-8 object-contain [image-rendering:pixelated] [image-rendering:crisp-edges] ${tree.status === 'alive' ? '' : 'grayscale opacity-50'}`}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{formatTreeType(tree.tree_type)}</p>
                      <p className="text-xs text-neutral-500">
                        {tree.timer_duration} min · {formatRelativeTime(tree.grown_at)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${tree.status === 'alive' ? 'text-[#22C55E]' : 'text-red-400'}`}
                    >
                      {tree.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#22C55E]" aria-hidden />
              <h2 className="text-lg font-semibold">Live activity</h2>
            </div>
            {data.activity.length === 0 ? (
              <p className="text-sm text-neutral-500">Activity from your app will stream here in real time.</p>
            ) : (
              <ul className="space-y-3">
                {data.activity.map(item => (
                  <li key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        item.tone === 'success'
                          ? 'bg-[#22C55E]'
                          : item.tone === 'danger'
                            ? 'bg-red-400'
                            : 'bg-neutral-500'
                      }`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-neutral-500">{item.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-neutral-600">{formatRelativeTime(item.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
