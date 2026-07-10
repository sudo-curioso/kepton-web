import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { AuthError, ValidationError } from './errors'
import { getAuthenticatedUser, type AuthenticatedUser } from './auth'
import { handleRateLimitError } from './rate-limit-middleware'
import { RateLimitError } from './rate-limit-errors'
import { logApiError, logRateLimitViolation } from './logging'

type RouteContext = { params?: Record<string, string> }

type AuthenticatedHandler<T extends RouteContext = RouteContext> = (
  request: Request,
  context: T,
  auth: { user: AuthenticatedUser; supabase: SupabaseClient },
) => Promise<NextResponse> | NextResponse

/**
 * Wraps API route handlers:
 * - Verifies JWT via Supabase (cookie or Authorization bearer)
 * - Injects authenticated user_id from token — never from body
 */
export function withAuth<T extends RouteContext = RouteContext>(handler: AuthenticatedHandler<T>) {
  return async (request: Request, context: T): Promise<NextResponse> => {
    const supabase = createClient()
    const user = await getAuthenticatedUser(supabase)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      return await handler(request, context, { user, supabase })
    } catch (err) {
      if (err instanceof AuthError) {
        return NextResponse.json({ error: err.message }, { status: err.status })
      }
      if (err instanceof ValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      const rateLimited = handleRateLimitError(err)
      if (rateLimited) return rateLimited
      if (err instanceof RateLimitError) {
        const url = new URL(request.url)
        logRateLimitViolation({
          endpoint: url.pathname,
          bucket: 'api-user',
          user_id: user.id,
        })
        return NextResponse.json(
          { error: err.message },
          {
            status: 429,
            headers: err.retryAfterSec ? { 'Retry-After': String(err.retryAfterSec) } : undefined,
          },
        )
      }
      logApiError('api', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

/** Standard JSON error responses for manual route handlers */
export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 })
}
