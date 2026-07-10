import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { getPublicSupabaseConfig } from '@/lib/security/env'
import { getClientIp } from '@/lib/security/client-ip'

/**
 * Auth API route client — uses secret key + Sb-Forwarded-For so Supabase
 * rate limits apply per end-user IP (not Vercel egress IP).
 * https://supabase.com/docs/guides/auth/rate-limits#ip-address-forwarding
 */
export function createAuthRouteClient(request: Request | NextRequest) {
  const cookieStore = cookies()
  const { url } = getPublicSupabaseConfig()
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secretKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for auth API routes')
  }

  const clientIp = getClientIp(request)

  return createServerClient(url, secretKey, {
    global: {
      headers: {
        'sb-forwarded-for': clientIp,
      },
    },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Route handler — cookies flush on response
        }
      },
    },
  })
}
