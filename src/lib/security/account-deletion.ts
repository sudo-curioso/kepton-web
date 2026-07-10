import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertUuidV4 } from '@/lib/security/uuid'

type DeletionStep = {
  table: string
  column: 'user_id' | 'id'
}

/** Child tables first; users row last before auth.users */
const DELETION_STEPS: DeletionStep[] = [
  { table: 'focus_sessions', column: 'user_id' },
  { table: 'forest_trees', column: 'user_id' },
  { table: 'tasks', column: 'user_id' },
  { table: 'daily_reflections', column: 'user_id' },
  { table: 'leaderboard', column: 'user_id' },
  { table: 'user_streaks', column: 'user_id' },
  { table: 'users', column: 'id' },
]

async function deleteUserRows(
  admin: SupabaseClient,
  step: DeletionStep,
  userId: string,
): Promise<void> {
  const { error } = await admin.from(step.table).delete().eq(step.column, userId)

  if (!error) return

  // Optional tables may not exist in every environment
  if (error.code === '42P01' || /relation .* does not exist/i.test(error.message ?? '')) {
    return
  }

  throw new Error(`Failed to delete ${step.table}: ${error.message}`)
}

/**
 * Permanently removes all app data for a user, then deletes the Supabase Auth account.
 * DPDPA / Play Store — irreversible; run only after email confirmation + auth check.
 */
export async function permanentlyDeleteUserAccount(userId: string): Promise<void> {
  const id = assertUuidV4(userId, 'user_id')
  const admin = createAdminClient()

  for (const step of DELETION_STEPS) {
    await deleteUserRows(admin, step, id)
  }

  const { error: authError } = await admin.auth.admin.deleteUser(id)
  if (authError) {
    throw new Error(`Failed to delete auth user: ${authError.message}`)
  }
}
