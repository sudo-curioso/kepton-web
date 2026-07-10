import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isProduction } from './transport'

const CORS_METHODS = 'GET, POST, PATCH, DELETE, OPTIONS'
const CORS_HEADERS = 'Authorization, Content-Type'

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '')
}

/** Allowed browser origins for /api/* (excludes server-to-server webhooks). */
export function getAllowedOrigins(): string[] {
  const origins = new Set<string>()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    try {
      origins.add(normalizeOrigin(new URL(appUrl).origin))
    } catch {
      // ignore invalid URL
    }
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    origins.add(normalizeOrigin(`https://${vercelUrl}`))
  }

  if (!isProduction()) {
    origins.add('http://localhost:3000')
    origins.add('http://127.0.0.1:3000')
  }

  return Array.from(origins)
}

function isAllowedOrigin(origin: string, allowed: string[]): boolean {
  return allowed.includes(normalizeOrigin(origin))
}

function applyCorsHeaders(response: NextResponse, origin: string | null, allowed: string[]): NextResponse {
  if (origin && isAllowedOrigin(origin, allowed)) {
    response.headers.set('Access-Control-Allow-Origin', normalizeOrigin(origin))
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Vary', 'Origin')
  }
  return response
}

/**
 * Blocks cross-origin browser calls to API routes.
 * Webhooks and same-origin requests pass through.
 */
export function handleApiCors(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/api/')) return null
  if (pathname.startsWith('/api/webhooks/')) return null

  const origin = request.headers.get('origin')
  const allowed = getAllowedOrigins()

  if (request.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin(origin, allowed)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const response = new NextResponse(null, { status: 204 })
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', normalizeOrigin(origin))
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', CORS_METHODS)
      response.headers.set('Access-Control-Allow-Headers', CORS_HEADERS)
      response.headers.set('Access-Control-Max-Age', '86400')
      response.headers.set('Vary', 'Origin')
    }
    return response
  }

  if (origin && !isAllowedOrigin(origin, allowed)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

export function withCorsHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin')
  return applyCorsHeaders(response, origin, getAllowedOrigins())
}
