import type { SupabaseClient } from '@supabase/supabase-js'
import { getServerAccessContext, type AccessContext } from '@/lib/dashboard/server-access'
import { AuthError } from './errors'
import { assertUuidV4, isUuidV4 } from './uuid'

export type { AccessContext, SubscriptionTier } from '@/lib/dashboard/server-access'

type OwnableTable = 'tasks' | 'forest_trees' | 'focus_sessions' | 'user_streaks'

const OWNABLE_TABLES: Record<OwnableTable, 'user_id'> = {
  tasks: 'user_id',
  forest_trees: 'user_id',
  focus_sessions: 'user_id',
  user_streaks: 'user_id',
}

/**
 * A01 ownership check — run before every PATCH/DELETE (and sensitive GET by id).
 * user_id is read from the row, compared to JWT-derived authenticatedUserId.
 */
export async function assertResourceOwnership(
  supabase: SupabaseClient,
  table: OwnableTable,
  resourceId: string,
  authenticatedUserId: string,
): Promise<void> {
  assertUuidV4(authenticatedUserId, 'authenticated_user_id')
  if (!isUuidV4(resourceId)) {
    throw new AuthError('Not found', 404)
  }

  const ownerColumn = OWNABLE_TABLES[table]
  const { data, error } = await supabase
    .from(table)
    .select(ownerColumn)
    .eq('id', resourceId)
    .maybeSingle()

  if (error || !data) {
    throw new AuthError('Not found', 404)
  }

  const ownerId = (data as Record<string, string>)[ownerColumn]
  if (ownerId !== authenticatedUserId) {
    throw new AuthError('Forbidden', 403)
  }
}

export async function assertProAccess(
  supabase: SupabaseClient,
  userId: string,
  authCreatedAt: string,
): Promise<AccessContext> {
  const ctx = await getServerAccessContext(supabase, userId, authCreatedAt)
  if (!ctx.hasProAccess) {
    throw new AuthError('Pro subscription required', 403)
  }
  return ctx
}

export { getServerAccessContext }
