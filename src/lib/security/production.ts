import { isProduction } from './transport'

const DEBUG_ROUTE_PATTERN = /^\/api\/(?:debug|__dev|test|health\/debug)(?:\/|$)/i

function isVercelProduction(): boolean {
  return process.env.VERCEL_ENV === 'production'
}

/** OWASP A05 — block debug/test API routes in production */
export function isBlockedDebugRoute(pathname: string): boolean {
  return isProduction() && DEBUG_ROUTE_PATTERN.test(pathname)
}

/**
 * Strict production checks on Vercel — skipped during local `next build`.
 * Dashboard items (email confirmations, RLS) are in supabase/production-security.sql.
 */
export function validateProductionEnv(): void {
  if (!isVercelProduction()) return

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('A05: SUPABASE_SERVICE_ROLE_KEY is required in production (webhooks + API writes)')
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('A05: Upstash Redis env vars are required in production for distributed rate limits')
  }

  const hasRevenueCatAuth = Boolean(process.env.REVENUECAT_WEBHOOK_AUTH)

  if (!hasRevenueCatAuth) {
    throw new Error('A08: REVENUECAT_WEBHOOK_AUTH is required in production (Authorization header secret)')
  }
}
