import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { AuthError } from './errors'
import { assertUuidV4 } from './uuid'

export type AuthenticatedUser = {
  id: string
  email: string | undefined
  user_metadata: User['user_metadata']
  created_at: string
}

/** JWT-backed identity — always from Supabase session, never from request body */
export async function getAuthenticatedUser(
  supabase?: SupabaseClient,
): Promise<AuthenticatedUser | null> {
  const client = supabase ?? createClient()
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error || !user) return null

  assertUuidV4(user.id, 'user_id')

  return {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    created_at: user.created_at,
  }
}

export async function requireAuthenticatedUser(
  supabase?: SupabaseClient,
): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(supabase)
  if (!user) {
    throw new AuthError('Unauthorized', 401)
  }
  return user
}
