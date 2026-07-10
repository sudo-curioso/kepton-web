import { NextResponse } from 'next/server'
import { createServiceWriteClient } from '@/lib/security/service-write'
import { logApiError } from '@/lib/security/logging'
import { isUuidV4 } from '@/lib/security/uuid'
import {
  logSubscriptionEvent,
  mapRevenueCatAuditEvent,
} from '@/lib/security/audit-log'
import {
  resolvePlanFromEvent,
  verifyRevenueCatWebhook,
  type RevenueCatWebhookPayload,
} from '@/lib/security/webhooks/revenuecat'

export const runtime = 'nodejs'

/**
 * OWASP A08 + A09 — RevenueCat webhook with auth verification and subscription audit logs.
 */
export async function POST(request: Request) {
  const rawBody = await request.text()
  const verification = verifyRevenueCatWebhook(rawBody, request.headers)

  if (!verification.ok) {
    return NextResponse.json({ error: verification.error }, { status: verification.status })
  }

  let payload: RevenueCatWebhookPayload
  try {
    payload = JSON.parse(rawBody) as RevenueCatWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const event = payload.event
  const eventType = event?.type
  const appUserId = event?.app_user_id

  if (!eventType || !appUserId || !isUuidV4(appUserId)) {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const auditCategory = mapRevenueCatAuditEvent(eventType)
  const nextPlan = resolvePlanFromEvent(eventType)

  logSubscriptionEvent(auditCategory, {
    user_id: appUserId,
    provider_event: eventType,
    plan: nextPlan ?? undefined,
  })

  if (!nextPlan) {
    return NextResponse.json({ ok: true, ignored: eventType })
  }

  try {
    const admin = createServiceWriteClient()
    const { error } = await admin
      .from('users')
      .update({
        plan: nextPlan,
        ...(nextPlan === 'free' ? { trial_ends_at: null } : {}),
      })
      .eq('id', appUserId)

    if (error) {
      logApiError('revenuecat-webhook', error)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, plan: nextPlan })
  } catch (err) {
    logApiError('revenuecat-webhook', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
