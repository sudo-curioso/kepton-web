import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/security/api'
import { permanentlyDeleteUserAccount } from '@/lib/security/account-deletion'
import { getClientIp } from '@/lib/security/client-ip'
import { logAccountDeleted } from '@/lib/security/audit-log'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { sanitizeEmail, ValidationError } from '@/lib/sanitize'
import { createClient } from '@/lib/supabase/server'

const ENDPOINT = '/api/user'

function emailsMatchConfirm(authenticatedEmail: string, confirmation: string): boolean {
  const expected = sanitizeEmail(authenticatedEmail)
  const provided = sanitizeEmail(confirmation)

  if (expected.length !== provided.length) return false

  let diff = 0
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i)
  }
  return diff === 0
}

type DeleteAccountBody = {
  email?: unknown
}

/** DPDPA + Play Store — permanent account deletion (JWT + email confirmation) */
export const DELETE = withAuth(async (request, _context, { user }) => {
  const ip = getClientIp(request)

  await enforceRateLimitAudited('account-delete', user.id, {
    endpoint: ENDPOINT,
    user_id: user.id,
    ip,
  })

  if (!user.email) {
    throw new ValidationError('Account deletion requires a verified email address')
  }

  let body: DeleteAccountBody = {}
  try {
    body = (await request.json()) as DeleteAccountBody
  } catch {
    throw new ValidationError('Invalid request body')
  }

  const confirmationEmail = typeof body.email === 'string' ? body.email : ''
  if (!confirmationEmail.trim()) {
    throw new ValidationError('Email confirmation is required')
  }

  if (!emailsMatchConfirm(user.email, confirmationEmail)) {
    throw new ValidationError('Email does not match your account')
  }

  await permanentlyDeleteUserAccount(user.id)

  logAccountDeleted({ ip, user_id: user.id, email: user.email })

  const supabase = createClient()
  await supabase.auth.signOut()

  return NextResponse.json({ ok: true, deleted: true })
})
