import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getPublicSupabaseConfig } from '@/lib/security/env'
import { applySecurityHeaders } from '@/lib/security/transport'

function secure(response: NextResponse): NextResponse {
  return applySecurityHeaders(response)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const { url, anonKey } = getPublicSupabaseConfig()

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isDashboard = pathname.startsWith('/dashboard')
  const isAuth = pathname.startsWith('/auth')
  const isApi = pathname.startsWith('/api/')
  const isPublicAuthApi =
    pathname.startsWith('/api/auth/callback') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api/auth/forgot-password')
  const isWebhook = pathname.startsWith('/api/webhooks/')

  if (isApi && !isPublicAuthApi && !isWebhook && !user) {
    return secure(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
  }

  if (!user && isDashboard) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    redirectUrl.searchParams.set('mode', 'login')
    redirectUrl.searchParams.set('next', request.nextUrl.pathname)
    return secure(NextResponse.redirect(redirectUrl))
  }

  if (user && isAuth) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    redirectUrl.search = ''
    return secure(NextResponse.redirect(redirectUrl))
  }

  return secure(supabaseResponse)
}
