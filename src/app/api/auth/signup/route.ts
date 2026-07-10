import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAuthRouteClient } from '@/lib/supabase/auth-route'
import { getClientIp } from '@/lib/security/client-ip'
import { SIGNUP_RESPONSE_MESSAGE } from '@/lib/security/auth-messages'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { RateLimitError } from '@/lib/security/rate-limit-errors'
import { logAuthSignup } from '@/lib/security/audit-log'
import { assertPassword } from '@/lib/security/password'
import { sanitizeEmail, sanitizeUserName, ValidationError } from '@/lib/sanitize'
import { ensureUserProfile } from '@/lib/dashboard/queries'

const ENDPOINT = '/api/auth/signup'

/**
 * OWASP A07 + A09 — signup without enumeration + audit logging.
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

  try {
    const email = typeof body.email === 'string' ? sanitizeEmail(body.email) : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const name = typeof body.name === 'string' ? sanitizeUserName(body.name) : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError('Please enter a valid email address.')
    }
    if (!name) {
      throw new ValidationError('Please enter a valid name.')
    }
    assertPassword(password)

    const supabase = createAuthRouteClient(request)
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, name },
      },
    })

    const isNewUser = Boolean(data.user?.identities && data.user.identities.length > 0)
    if (isNewUser && data.user) {
      await ensureUserProfile(supabase, data.user.id)
    }

    logAuthSignup({ ip, email, user_id: data.user?.id })

    return NextResponse.json({
      ok: true,
      message: SIGNUP_RESPONSE_MESSAGE,
      sessionEstablished: Boolean(data.session),
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
  }

  const email = typeof body.email === 'string' ? sanitizeEmail(body.email) : 'unknown'
  logAuthSignup({ ip, email })

  return NextResponse.json({
    ok: true,
    message: SIGNUP_RESPONSE_MESSAGE,
    sessionEstablished: false,
  })
}
