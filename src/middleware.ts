import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { applySecurityHeaders, enforceHttps } from '@/lib/security/transport'
import { handleApiCors, withCorsHeaders } from '@/lib/security/cors'
import { isBlockedDebugRoute } from '@/lib/security/production'

function needsAuthSession(pathname: string): boolean {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/')
  )
}

/**
 * Edge middleware — session + HTTPS only.
 * Intentional: no geo/IP/language blocks and no bot challenges.
 * Search engines and AI crawlers (ChatGPT-User, ClaudeBot, PerplexityBot,
 * Google-Extended, Googlebot, etc.) pass through on public routes unchanged.
 * We never set X-Robots-Tag: noindex here (page headers handle public vs private).
 */
export async function middleware(request: NextRequest) {
  const httpsRedirect = enforceHttps(request)
  if (httpsRedirect) {
    return applySecurityHeaders(httpsRedirect)
  }

  const { pathname } = request.nextUrl

  // Static SEO artifacts — no session work, crawler-friendly
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/favicon.ico') {
    return applySecurityHeaders(NextResponse.next())
  }

  if (isBlockedDebugRoute(pathname)) {
    return applySecurityHeaders(NextResponse.json({ error: 'Not found' }, { status: 404 }))
  }

  const corsResponse = handleApiCors(request)
  if (corsResponse) {
    return applySecurityHeaders(corsResponse)
  }

  if (needsAuthSession(pathname) && isSupabaseConfigured()) {
    const sessionResponse = await updateSession(request)
    return withCorsHeaders(request, sessionResponse)
  }

  return applySecurityHeaders(withCorsHeaders(request, NextResponse.next()))
}

export const config = {
  matcher: [
    /*
     * Negative lookahead excludes SEO artifacts and static files from ALL middleware
     * processing (HTTPS redirect, session, CORS). `/sitemap.xml` and `/robots.txt`
     * must receive a direct 200 from the App Router MetadataRoute / public file.
     */
    '/dashboard',
    '/dashboard/:path*',
    '/auth',
    '/auth/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml)$).*)',
  ],
}
