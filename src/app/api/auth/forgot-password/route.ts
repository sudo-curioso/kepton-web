import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAuthRouteClient } from '@/lib/supabase/auth-route'
import { getClientIp } from '@/lib/security/client-ip'
import { FORGOT_PASSWORD_RESPONSE_MESSAGE } from '@/lib/security/auth-messages'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { RateLimitError } from '@/lib/security/rate-limit-errors'
import { logAuthPasswordReset } from '@/lib/security/audit-log'
import { sanitizeEmail } from '@/lib/sanitize'

const ENDPOINT = '/api/auth/forgot-password'

/**
 * OWASP A07 + A09 — forgot password without enumeration + audit logging.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  try {
    await enforceRateLimitAudited('auth-ip', ip, { endpoint: ENDPOINT, ip })
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: err.retryAfterSec ? { 'Retry-After': String(err.retryAfterSec) } : undefined },
      )
    }
    throw err
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? sanitizeEmail(body.email) : ''
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    logAuthPasswordReset({ ip, email })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: true, message: FORGOT_PASSWORD_RESPONSE_MESSAGE })
  }

  const origin = new URL(request.url).origin
  const supabase = createAuthRouteClient(request)

  try {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth?mode=login`,
    })
  } catch {
    // Swallow — response must not reveal whether the email exists
  }

  return NextResponse.json({ ok: true, message: FORGOT_PASSWORD_RESPONSE_MESSAGE })
}
