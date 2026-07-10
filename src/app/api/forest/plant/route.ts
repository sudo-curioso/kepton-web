import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/security/api'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { createServiceWriteClient } from '@/lib/security/service-write'
import { validateClientTimestamp } from '@/lib/security/sync'
import { trackTreePlantAlert } from '@/lib/security/audit-alerts'
import { getClientIp } from '@/lib/security/client-ip'
import { assertEnum, ValidationError } from '@/lib/sanitize'

const TREE_TYPES = ['sprout', 'baby', 'half', 'flowering', 'large', 'full'] as const
const ENDPOINT = '/api/forest/plant'

/**
 * Tree plant API — max 20 requests per user per day (prevents fake tree farming).
 */
export const POST = withAuth(async (request, _context, { user }) => {
  const ip = getClientIp(request)
  await enforceRateLimitAudited('tree-plant-user', user.id, {
    endpoint: ENDPOINT,
    user_id: user.id,
    ip,
  })

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    if (body.client_timestamp !== undefined) {
      validateClientTimestamp(body.client_timestamp)
    }

    const treeType = assertEnum(body.tree_type, TREE_TYPES)
    if (!treeType) throw new ValidationError('Invalid tree_type')

    const timerDuration = typeof body.timer_duration === 'number' ? Math.floor(body.timer_duration) : NaN
    if (!Number.isFinite(timerDuration) || timerDuration < 1 || timerDuration > 180) {
      throw new ValidationError('Invalid timer_duration')
    }

    const taskId = typeof body.task_id === 'string' ? body.task_id : null

    const admin = createServiceWriteClient()
    const { data, error } = await admin
      .from('forest_trees')
      .insert({
        user_id: user.id,
        task_id: taskId,
        tree_type: treeType,
        status: 'alive',
        timer_duration: timerDuration,
        grown_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    void trackTreePlantAlert(user.id)

    return NextResponse.json({ tree: data }, { status: 201 })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    if (err instanceof Error && err.message.includes('client_timestamp')) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    throw err
  }
})
