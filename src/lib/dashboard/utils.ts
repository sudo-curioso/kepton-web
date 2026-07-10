import type { KeptonUser, UserPlan } from '@/lib/types/dashboard'

const TRIAL_DAYS = 14

export function resolveAccess(userRow: KeptonUser | null, authCreatedAt: string) {
  const createdAt = userRow?.created_at ?? authCreatedAt
  const trialEndsAt = userRow?.trial_ends_at
    ? new Date(userRow.trial_ends_at)
    : new Date(new Date(createdAt).getTime() + TRIAL_DAYS * 86_400_000)

  const plan: UserPlan = userRow?.plan === 'pro' ? 'pro' : 'free'
  const hasProAccess = plan === 'pro' || trialEndsAt.getTime() > Date.now()
  const daysLeft = Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86_400_000))

  return { plan, trialEndsAt, hasProAccess, daysLeft }
}

export function formatTreeType(type: string): string {
  const labels: Record<string, string> = {
    sprout: 'Sprout',
    baby: 'Baby tree',
    half: 'Growing tree',
    flowering: 'Flowering tree',
    large: 'Large pine',
    full: 'Full forest tree',
    dead: 'Withered tree',
  }
  return labels[type] ?? type
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function startOfTodayIso(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}
