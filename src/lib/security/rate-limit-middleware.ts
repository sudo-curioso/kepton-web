import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getClientIp } from '@/lib/security/client-ip'
import { enforceRateLimit, rateLimitResponse } from '@/lib/security/rate-limit'
import { RateLimitError } from '@/lib/security/rate-limit-errors'
import { logRateLimitViolation } from '@/lib/security/audit-log'

type RouteHandler = (request: NextRequest, context?: unknown) => Promise<Response> | Response

/** Auth API routes — max 10 requests per IP per 15 minutes */
export function withAuthIpRateLimit(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const ip = getClientIp(request)
    try {
      await enforceRateLimit('auth-ip', ip)
    } catch (err) {
      if (err instanceof RateLimitError) {
        logRateLimitViolation({
          endpoint: new URL(request.url).pathname,
          bucket: 'auth-ip',
          ip,
        })
        return rateLimitResponse(err.retryAfterSec)
      }
      throw err
    }
    return handler(request, context)
  }
}

export function handleRateLimitError(err: unknown): NextResponse | null {
  if (err instanceof RateLimitError) {
    return NextResponse.json(
      { error: err.message },
      {
        status: 429,
        headers: err.retryAfterSec ? { 'Retry-After': String(err.retryAfterSec) } : undefined,
      },
    )
  }
  return null
}
