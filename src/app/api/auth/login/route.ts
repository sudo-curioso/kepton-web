import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAuthRouteClient } from '@/lib/supabase/auth-route'
import { getClientIp } from '@/lib/security/client-ip'
import { LOGIN_INVALID_MESSAGE, LOGIN_LOCKOUT_MESSAGE } from '@/lib/security/auth-messages'
import { isLoginLocked, recordLoginFailure } from '@/lib/security/auth-rate-limit'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { RateLimitError } from '@/lib/security/rate-limit-errors'
import {
  logAuthLoginFailed,
  logAuthLoginLockout,
  logAuthLoginSuccess,
} from '@/lib/security/audit-log'
import { trackFailedLoginAlert } from '@/lib/security/audit-alerts'
import { sanitizeEmail, ValidationError } from '@/lib/sanitize'

const ENDPOINT = '/api/auth/login'

/**
 * OWASP A07 + A09 — login with lockout, single-device sessions, audit logging.
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
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    logAuthLoginFailed({ ip, email: email || 'unknown' })
    void trackFailedLoginAlert(ip)
    return NextResponse.json({ error: LOGIN_INVALID_MESSAGE }, { status: 401 })
  }

  const lockStatus = await isLoginLocked(email)
  if (lockStatus.locked) {
    logAuthLoginLockout({ ip, email })
    return NextResponse.json(
      { error: LOGIN_LOCKOUT_MESSAGE },
      {
        status: 429,
        headers: lockStatus.retryAfterSec ? { 'Retry-After': String(lockStatus.retryAfterSec) } : undefined,
      },
    )
  }

  try {
    const supabase = createAuthRouteClient(request)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      logAuthLoginFailed({ ip, email, reason: 'invalid_credentials' })
      void trackFailedLoginAlert(ip)
      const failure = await recordLoginFailure(email)
      if (failure.locked) {
        logAuthLoginLockout({ ip, email })
        return NextResponse.json(
          { error: LOGIN_LOCKOUT_MESSAGE },
          {
            status: 429,
            headers: failure.retryAfterSec ? { 'Retry-After': String(failure.retryAfterSec) } : undefined,
          },
        )
      }
      return NextResponse.json({ error: LOGIN_INVALID_MESSAGE }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      logAuthLoginSuccess({ ip, email, user_id: user.id })
    }

    await supabase.auth.signOut({ scope: 'others' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    logAuthLoginFailed({ ip, email, reason: 'server_error' })
    void trackFailedLoginAlert(ip)
    await recordLoginFailure(email)
    return NextResponse.json({ error: LOGIN_INVALID_MESSAGE }, { status: 401 })
  }
}
