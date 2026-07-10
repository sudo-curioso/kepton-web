import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { assertHttpsUrl } from '@/lib/security/transport'

/**
 * Service-role client — SERVER ONLY (Vercel env: SUPABASE_SERVICE_ROLE_KEY).
 * Never import this module from client components or NEXT_PUBLIC code paths.
 * JWT auth for users remains Supabase-managed RS256; we do not sign custom tokens.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Admin Supabase client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }

  assertHttpsUrl(url, 'NEXT_PUBLIC_SUPABASE_URL')

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
