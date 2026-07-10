import type { SupabaseClient } from '@supabase/supabase-js'
import type { KeptonUser } from '@/lib/types/dashboard'
import { resolveAccess } from '@/lib/dashboard/utils'
import { assertUuidV4 } from '@/lib/security/uuid'

export type SubscriptionTier = 'free' | 'pro'

export type AccessContext = {
  userId: string
  tier: SubscriptionTier
  hasProAccess: boolean
  trialEndsAt: Date
  daysLeft: number
}

/** Server-side subscription gate — reads users.plan from DB, never trusts client flags */
export async function getServerAccessContext(
  supabase: SupabaseClient,
  userId: string,
  authCreatedAt: string,
): Promise<AccessContext> {
  assertUuidV4(userId, 'user_id')

  const { data: userRow, error } = await supabase
    .from('users')
    .select('id, plan, trial_ends_at, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error('Failed to load subscription context')
  }

  const access = resolveAccess((userRow as KeptonUser | null) ?? null, authCreatedAt)

  return {
    userId,
    tier: access.plan,
    hasProAccess: access.hasProAccess,
    trialEndsAt: access.trialEndsAt,
    daysLeft: access.daysLeft,
  }
}
