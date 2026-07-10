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

export async function middleware(request: NextRequest) {
  const httpsRedirect = enforceHttps(request)
  if (httpsRedirect) {
    return applySecurityHeaders(httpsRedirect)
  }

  const { pathname } = request.nextUrl

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
    '/dashboard',
    '/dashboard/:path*',
    '/auth',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
