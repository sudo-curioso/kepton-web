import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Supabase + Vercel must use TLS. Reject cleartext API endpoints in production. */
export function assertHttpsUrl(url: string, label: string): void {
  if (!url) return

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`A02: Invalid ${label} URL`)
  }

  if (isProduction() && parsed.protocol !== 'https:') {
    throw new Error(`A02: ${label} must use HTTPS in production (got ${parsed.protocol})`)
  }
}

/**
 * Production: redirect HTTP → HTTPS (Vercel sets x-forwarded-proto).
 * Local dev: HTTP allowed on localhost only.
 */
export function enforceHttps(request: NextRequest): NextResponse | null {
  if (!isProduction()) return null

  const proto = request.headers.get('x-forwarded-proto')
  if (proto && proto !== 'https') {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  return null
}

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-DNS-Prefetch-Control': 'off',
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
  if (!isProduction()) return response

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}
