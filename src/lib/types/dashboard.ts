export type UserPlan = 'free' | 'pro'

export type KeptonUser = {
  id: string
  plan: UserPlan
  trial_ends_at: string | null
  created_at: string
  consent_version: string | null
}

export type KeptonTask = {
  id: string
  user_id: string
  title: string
  bucket: 'today' | 'week' | 'later' | 'trash' | string
  status: 'pending' | 'in_progress' | 'done' | string
  priority: number
  steps: { text: string; done: boolean }[] | null
  created_at: string
  completed_at: string | null
}

export type ForestTree = {
  id: string
  user_id: string
  task_id: string | null
  tree_type: string
  status: 'alive' | 'dead' | string
  timer_duration: number
  grown_at: string
  died_at: string | null
}

export type UserStreak = {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_active_date: string | null
  total_trees_grown: number
  total_trees_lost: number
  forest_acres: number
}

export type FocusSession = {
  id: string
  user_id: string
  task_id: string | null
  duration_s: number
  completed: boolean
  created_at?: string
}

export type DashboardProfile = {
  id: string
  email: string
  name: string
  plan: UserPlan
  trialEndsAt: Date
  daysLeft: number
  hasProAccess: boolean
}

export type DashboardStats = {
  focusMinutesToday: number
  tasksDoneToday: number
  tasksPending: number
  sessionsToday: number
}

export type ActivityItem =
  | { id: string; type: 'tree'; title: string; subtitle: string; at: string; tone: 'success' | 'danger' }
  | { id: string; type: 'task'; title: string; subtitle: string; at: string; tone: 'neutral' | 'success' }
  | { id: string; type: 'session'; title: string; subtitle: string; at: string; tone: 'success' }

export type DashboardData = {
  profile: DashboardProfile
  streak: UserStreak | null
  tasks: KeptonTask[]
  recentTrees: ForestTree[]
  recentSessions: FocusSession[]
  activity: ActivityItem[]
  stats: DashboardStats
}

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  focusMinutesToday: 0,
  tasksDoneToday: 0,
  tasksPending: 0,
  sessionsToday: 0,
}
