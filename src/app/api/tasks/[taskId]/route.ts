import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/security/api'
import { assertResourceOwnership } from '@/lib/security/access-control'
import { assertUuidV4 } from '@/lib/security/uuid'
import { parseTaskPatchBody, ValidationError } from '@/lib/sanitize'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { createServiceWriteClient } from '@/lib/security/service-write'

type TaskRouteContext = { params: { taskId: string } }

/**
 * OWASP A01 + A03 — ownership verified; inputs sanitized before parameterized update.
 * Supabase .update() uses parameterized queries — never string-concatenate SQL.
 */
export const PATCH = withAuth<TaskRouteContext>(async (request, { params }, { user, supabase }) => {
  const taskId = assertUuidV4(params.taskId, 'taskId')
  await enforceRateLimitAudited('api-user', user.id, {
    endpoint: '/api/tasks/[taskId]',
    user_id: user.id,
  })
  await assertResourceOwnership(supabase, 'tasks', taskId, user.id)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  let patch
  try {
    patch = parseTaskPatchBody(body)
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    throw err
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const admin = createServiceWriteClient()
  const { data, error } = await admin
    .from('tasks')
    .update(patch)
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ task: data })
})

export const DELETE = withAuth<TaskRouteContext>(async (_request, { params }, { user, supabase }) => {
  const taskId = assertUuidV4(params.taskId, 'taskId')
  await enforceRateLimitAudited('api-user', user.id, {
    endpoint: '/api/tasks/[taskId]',
    user_id: user.id,
  })
  await assertResourceOwnership(supabase, 'tasks', taskId, user.id)

  const admin = createServiceWriteClient()
  const { error } = await admin.from('tasks').delete().eq('id', taskId).eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
})
