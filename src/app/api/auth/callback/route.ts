import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sanitizeRedirectPath } from '@/lib/security/redirect'
import { withAuthIpRateLimit } from '@/lib/security/rate-limit-middleware'

async function handleAuthCallback(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeRedirectPath(searchParams.get('next'))

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?mode=login`)
}

/** OWASP A04 — auth callback rate limited: 10 req / IP / 15 min */
export const GET = withAuthIpRateLimit(handleAuthCallback)
