import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/security/api'
import { getClientIp } from '@/lib/security/client-ip'
import { logAuthLogout } from '@/lib/security/audit-log'
import { createClient } from '@/lib/supabase/server'

/** OWASP A09 — log logout with timestamp + IP, then clear session */
export const POST = withAuth(async (request, _context, { user }) => {
  const ip = getClientIp(request)
  logAuthLogout({ ip, user_id: user.id })

  const supabase = createClient()
  await supabase.auth.signOut()

  return NextResponse.json({ ok: true })
})
