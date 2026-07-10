import type { SupabaseClient } from '@supabase/supabase-js'
import type { ForestTree, UserStreak } from '@/lib/types/dashboard'
import type { ForestData } from '@/lib/types/forest'
import { buildForestData } from '@/lib/types/forest'
import { assertUuidV4 } from '@/lib/security/uuid'
import {
  ensureUserProfile,
  fetchDashboardData,
} from '@/lib/dashboard/queries'

export async function fetchForestPageData(
  supabase: SupabaseClient,
  authUser: Parameters<typeof fetchDashboardData>[1],
): Promise<ForestData> {
  const userId = assertUuidV4(authUser.id, 'user_id')

  const [dashboardBase, treesRes, streakRes] = await Promise.all([
    fetchDashboardData(supabase, authUser),
    supabase
      .from('forest_trees')
      .select('*')
      .eq('user_id', userId)
      .order('grown_at', { ascending: true })
      .limit(120),
    supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle(),
  ])

  await ensureUserProfile(supabase, userId)

  const trees = (treesRes.data as ForestTree[] | null) ?? []
  const streak = (streakRes.data as UserStreak | null) ?? dashboardBase.streak

  return buildForestData(dashboardBase.profile, streak, trees)
}

export async function fetchForestTrees(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ trees: ForestTree[]; streak: UserStreak | null }> {
  assertUuidV4(userId, 'user_id')
  const [treesRes, streakRes] = await Promise.all([
    supabase
      .from('forest_trees')
      .select('*')
      .eq('user_id', userId)
      .order('grown_at', { ascending: true })
      .limit(120),
    supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle(),
  ])

  return {
    trees: (treesRes.data as ForestTree[] | null) ?? [],
    streak: (streakRes.data as UserStreak | null) ?? null,
  }
}
