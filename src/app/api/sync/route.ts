import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/security/api'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { validateClientTimestamp } from '@/lib/security/sync'
import {
  validateSyncEventPayload,
  type ValidatedFocusSessionPayload,
  type ValidatedTreePlantPayload,
} from '@/lib/security/integrity'
import { createServiceWriteClient } from '@/lib/security/service-write'
import { logApiError } from '@/lib/security/logging'
import { ValidationError } from '@/lib/sanitize'

type SyncEvent = {
  type: string
  client_timestamp: string
  payload?: ValidatedFocusSessionPayload | ValidatedTreePlantPayload
}

/**
 * Offline sync batch — A04 client_timestamp + A08 payload integrity checks before insert.
 */
export const POST = withAuth(async (request, _context, { user }) => {
  await enforceRateLimitAudited('sync-user', user.id, {
    endpoint: '/api/sync',
    user_id: user.id,
  })

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    validateClientTimestamp(body.client_timestamp)

    const events = Array.isArray(body.events) ? body.events : []
    if (events.length > 50) {
      throw new ValidationError('Too many sync events in one batch (max 50)')
    }

    const validated: SyncEvent[] = []
    const admin = createServiceWriteClient()
    let inserted = 0

    for (const raw of events) {
      if (!raw || typeof raw !== 'object') {
        throw new ValidationError('Invalid sync event')
      }
      const event = raw as Record<string, unknown>
      if (typeof event.type !== 'string' || !event.type.trim()) {
        throw new ValidationError('Invalid event type')
      }

      const eventType = event.type.trim().slice(0, 64)
      validateClientTimestamp(event.client_timestamp)

      const rawPayload =
        event.payload && typeof event.payload === 'object'
          ? (event.payload as Record<string, unknown>)
          : undefined

      const integrityPayload = validateSyncEventPayload(eventType, rawPayload)

      if (integrityPayload && 'duration_s' in integrityPayload) {
        const session = integrityPayload as ValidatedFocusSessionPayload
        const recordedAt = new Date(String(event.client_timestamp)).toISOString()
        const { error } = await admin.from('focus_sessions').insert({
          user_id: user.id,
          task_id: session.task_id,
          duration_s: session.duration_s,
          completed: session.completed,
          created_at: recordedAt,
        })

        if (error) {
          logApiError('sync-focus_session', error)
          throw new ValidationError('Failed to persist focus session')
        }
        inserted += 1
      } else if (integrityPayload && ('planted_at' in integrityPayload)) {
        const tree = integrityPayload as ValidatedTreePlantPayload
        const { error } = await admin.from('forest_trees').insert({
          user_id: user.id,
          task_id: tree.task_id,
          tree_type: tree.tree_type,
          status: 'alive',
          timer_duration: tree.timer_duration,
          grown_at: tree.planted_at,
        })

        if (error) {
          logApiError('sync-tree_plant', error)
          throw new ValidationError('Failed to persist tree')
        }
        inserted += 1
      }

      validated.push({
        type: eventType,
        client_timestamp: new Date(String(event.client_timestamp)).toISOString(),
        payload: integrityPayload ?? undefined,
      })
    }

    return NextResponse.json({
      ok: true,
      user_id: user.id,
      accepted: validated.length,
      inserted,
      server_time: new Date().toISOString(),
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    if (err instanceof Error && (err.message.includes('client_timestamp') || err.message.includes('timestamp'))) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    throw err
  }
})
