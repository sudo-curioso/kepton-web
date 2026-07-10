import { createBrowserClient } from '@supabase/ssr'
import { getPublicSupabaseConfig } from '@/lib/security/env'

/** Browser client — anon key only. Auth tokens in HttpOnly cookies via @supabase/ssr. */
export function createClient() {
  const { url, anonKey } = getPublicSupabaseConfig()
  return createBrowserClient(url, anonKey)
}
