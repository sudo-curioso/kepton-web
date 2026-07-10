import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/security/api'
import { enforceRateLimitAudited } from '@/lib/security/rate-limit-audit'
import { assertEnum, sanitizeInput, ValidationError } from '@/lib/sanitize'

const ENERGY_LEVELS = ['low', 'medium', 'high'] as const

async function enforcePlannerLimits(userId: string): Promise<void> {
  await enforceRateLimitAudited('planner-user-daily', userId, {
    endpoint: '/api/planner',
    user_id: userId,
  })
  await enforceRateLimitAudited('planner-user-weekly', userId, {
    endpoint: '/api/planner',
    user_id: userId,
  })
}

/**
 * Planner API — max 50 requests per user per day + weekly cap (server-side).
 * Template-based planning; AI integration can be added behind Pro gate later.
 */
export const POST = withAuth(async (request, _context, { user }) => {
  await enforcePlannerLimits(user.id)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const energy = body.energy_level !== undefined ? assertEnum(body.energy_level, ENERGY_LEVELS) : 'medium'
    if (!energy) throw new ValidationError('Invalid energy_level')

    const contextNote =
      typeof body.context_note === 'string' ? sanitizeInput(body.context_note, 300) : undefined

    const blocks = buildTemplatePlan(energy, contextNote)

    return NextResponse.json({
      plan: {
        energy_level: energy,
        context_note: contextNote ?? null,
        blocks,
        generated_at: new Date().toISOString(),
      },
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    throw err
  }
})

function buildTemplatePlan(
  energy: (typeof ENERGY_LEVELS)[number],
  note?: string,
): { title: string; duration_min: number }[] {
  if (energy === 'low') {
    return [
      { title: 'Warm-up: one tiny win', duration_min: 5 },
      { title: note ? `Focus: ${note.slice(0, 80)}` : 'Single priority task', duration_min: 20 },
      { title: 'Rest + reset', duration_min: 10 },
    ]
  }

  if (energy === 'high') {
    return [
      { title: 'Deep block 1', duration_min: 45 },
      { title: 'Short break', duration_min: 10 },
      { title: note ? `Deep block: ${note.slice(0, 80)}` : 'Deep block 2', duration_min: 45 },
    ]
  }

  return [
    { title: 'Starter task', duration_min: 15 },
    { title: note ? `Main focus: ${note.slice(0, 80)}` : 'Main focus block', duration_min: 30 },
    { title: 'Wrap-up + tomorrow seed', duration_min: 10 },
  ]
}
