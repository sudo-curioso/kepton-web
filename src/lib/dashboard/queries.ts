import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  ActivityItem,
  DashboardData,
  DashboardProfile,
  DashboardStats,
  FocusSession,
  ForestTree,
  KeptonTask,
  KeptonUser,
  UserStreak,
} from '@/lib/types/dashboard'
import { getServerAccessContext } from '@/lib/dashboard/server-access'
import { assertUuidV4 } from '@/lib/security/uuid'
import { sanitizeUserName } from '@/lib/sanitize'
import { formatRelativeTime, formatTreeType, isToday, startOfTodayIso } from './utils'

type AuthUser = {
  id: string
  email?: string
  user_metadata?: { full_name?: string; name?: string }
  created_at?: string
}

export function buildActivity(
  tasks: KeptonTask[],
  trees: ForestTree[],
  sessions: FocusSession[],
): ActivityItem[] {
  const items: ActivityItem[] = []

  for (const tree of trees) {
    items.push({
      id: `tree-${tree.id}`,
      type: 'tree',
      title: tree.status === 'dead' ? 'Tree withered' : `${formatTreeType(tree.tree_type)} planted`,
      subtitle: `${tree.timer_duration} min focus session`,
      at: tree.grown_at,
      tone: tree.status === 'dead' ? 'danger' : 'success',
    })
  }

  for (const task of tasks.filter(t => t.status === 'done' && t.completed_at)) {
    items.push({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      subtitle: 'Task completed',
      at: task.completed_at!,
      tone: 'success',
    })
  }

  for (const session of sessions.filter(s => s.completed)) {
    const mins = Math.round(session.duration_s / 60)
    items.push({
      id: `session-${session.id}`,
      type: 'session',
      title: 'Focus session completed',
      subtitle: `${mins} minutes of deep work`,
      at: session.created_at ?? new Date().toISOString(),
      tone: 'success',
    })
  }

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 12)
}

function computeStats(tasks: KeptonTask[], sessions: FocusSession[]): DashboardStats {
  const todayStart = startOfTodayIso()
  const todayTasks = tasks.filter(t => t.created_at >= todayStart || (t.completed_at && t.completed_at >= todayStart))
  const todaySessions = sessions.filter(
    s => s.completed && (s.created_at ? s.created_at >= todayStart : true),
  )

  return {
    focusMinutesToday: Math.round(
      todaySessions.reduce((sum, s) => sum + s.duration_s, 0) / 60,
    ),
    tasksDoneToday: todayTasks.filter(t => t.status === 'done').length,
    tasksPending: tasks.filter(t => t.status !== 'done' && t.bucket === 'today').length,
    sessionsToday: todaySessions.length,
  }
}

export async function ensureUserProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<KeptonUser | null> {
  assertUuidV4(userId, 'user_id')

  const { data: existing } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()

  if (existing) return existing as KeptonUser

  const trialEnds = new Date(Date.now() + 14 * 86_400_000).toISOString()
  const { data: created, error } = await supabase
    .from('users')
    .insert({ id: userId, plan: 'free', trial_ends_at: trialEnds })
    .select('*')
    .single()

  if (error) return null
  return created as KeptonUser
}

export async function fetchProfilePageData(
  supabase: SupabaseClient,
  authUser: AuthUser,
): Promise<DashboardProfile> {
  const userId = assertUuidV4(authUser.id, 'user_id')
  const email = authUser.email ?? ''
  const rawName =
    authUser.user_metadata?.full_name ??
    authUser.user_metadata?.name ??
    email.split('@')[0] ??
    'Forester'
  const name = sanitizeUserName(rawName) || email.split('@')[0] || 'Forester'

  await ensureUserProfile(supabase, userId)
  const access = await getServerAccessContext(
    supabase,
    userId,
    authUser.created_at ?? new Date().toISOString(),
  )

  return {
    id: userId,
    email,
    name,
    plan: access.tier,
    trialEndsAt: access.trialEndsAt,
    daysLeft: access.daysLeft,
    hasProAccess: access.hasProAccess,
  }
}

export async function fetchDashboardData(
  supabase: SupabaseClient,
  authUser: AuthUser,
): Promise<DashboardData> {
  const userId = assertUuidV4(authUser.id, 'user_id')
  const email = authUser.email ?? ''
  const rawName =
    authUser.user_metadata?.full_name ??
    authUser.user_metadata?.name ??
    email.split('@')[0] ??
    'Forester'
  const name = sanitizeUserName(rawName) || email.split('@')[0] || 'Forester'

  await ensureUserProfile(supabase, userId)
  const access = await getServerAccessContext(
    supabase,
    userId,
    authUser.created_at ?? new Date().toISOString(),
  )

  const [streakRes, tasksRes, treesRes, sessionsRes] = await Promise.all([
    supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle(),
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .in('bucket', ['today', 'week'])
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('forest_trees')
      .select('*')
      .eq('user_id', userId)
      .order('grown_at', { ascending: false })
      .limit(12),
    supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .limit(20),
  ])

  const streak = (streakRes.data as UserStreak | null) ?? null
  const tasks = (tasksRes.data as KeptonTask[] | null) ?? []
  const recentTrees = (treesRes.data as ForestTree[] | null) ?? []
  const recentSessions = (sessionsRes.data as FocusSession[] | null) ?? []

  const stats = computeStats(tasks, recentSessions)
  const activity = buildActivity(tasks, recentTrees, recentSessions)

  return {
    profile: {
      id: userId,
      email,
      name,
      plan: access.tier,
      trialEndsAt: access.trialEndsAt,
      daysLeft: access.daysLeft,
      hasProAccess: access.hasProAccess,
    },
    streak,
    tasks: tasks.filter(t => t.bucket === 'today').slice(0, 8),
    recentTrees: recentTrees.slice(0, 6),
    recentSessions: recentSessions.slice(0, 8),
    activity,
    stats,
  }
}

export async function refreshDashboardSlice(
  supabase: SupabaseClient,
  userId: string,
  table: 'tasks' | 'forest_trees' | 'focus_sessions' | 'user_streaks',
): Promise<Partial<DashboardData>> {
  assertUuidV4(userId, 'user_id')
  if (table === 'user_streaks') {
    const { data } = await supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle()
    return { streak: (data as UserStreak | null) ?? null }
  }

  if (table === 'tasks') {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .in('bucket', ['today', 'week'])
      .order('created_at', { ascending: false })
      .limit(20)
    const tasks = (data as KeptonTask[] | null) ?? []
    return {
      tasks: tasks.filter(t => t.bucket === 'today').slice(0, 8),
      stats: computeStats(tasks, []),
    }
  }

  if (table === 'forest_trees') {
    const { data } = await supabase
      .from('forest_trees')
      .select('*')
      .eq('user_id', userId)
      .order('grown_at', { ascending: false })
      .limit(12)
    return { recentTrees: ((data as ForestTree[] | null) ?? []).slice(0, 6) }
  }

  const { data } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .limit(20)
  const recentSessions = (data as FocusSession[] | null) ?? []
  return {
    recentSessions: recentSessions.slice(0, 8),
    stats: { focusMinutesToday: Math.round(recentSessions.filter(s => s.completed && isToday(s.created_at ?? '')).reduce((sum, s) => sum + s.duration_s, 0) / 60), tasksDoneToday: 0, tasksPending: 0, sessionsToday: recentSessions.filter(s => s.completed && isToday(s.created_at ?? '')).length },
  }
}

// Re-export for activity formatting in UI
export { formatRelativeTime, formatTreeType }
