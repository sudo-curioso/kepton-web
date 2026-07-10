import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Service-role Supabase client for API writes after ownership checks.
 * Used when RLS blocks direct client writes on sensitive tables (tasks, forest_trees).
 */
export function createServiceWriteClient() {
  return createAdminClient()
}
