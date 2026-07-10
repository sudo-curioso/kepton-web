import { logSecurityAlert } from './audit-log'

const FAILED_LOGIN_ALERT_THRESHOLD = 10
const FAILED_LOGIN_WINDOW_MS = 5 * 60_000
const TREE_PLANT_ALERT_THRESHOLD = 50
const TREE_PLANT_WINDOW_MS = 24 * 60 * 60_000

const alertMemory = new Map<string, number[]>()

function incrementCounter(key: string, windowMs: number): number {
  const now = Date.now()
  const hits = (alertMemory.get(key) ?? []).filter(t => now - t < windowMs)
  hits.push(now)
  alertMemory.set(key, hits)
  return hits.length
}

/** Alert: >10 failed logins from same IP in 5 minutes */
export async function trackFailedLoginAlert(ip: string): Promise<void> {
  if (!ip || ip === 'unknown') return
  const count = incrementCounter(`alert:login:ip:${ip}`, FAILED_LOGIN_WINDOW_MS)
  if (count > FAILED_LOGIN_ALERT_THRESHOLD) {
    logSecurityAlert('failed_login_ip_threshold', {
      ip,
      failed_attempts: count,
      threshold: FAILED_LOGIN_ALERT_THRESHOLD,
      window: '5m',
    })
  }
}

/** Alert: >50 tree plants from same user in 24 hours */
export async function trackTreePlantAlert(userId: string): Promise<void> {
  const count = incrementCounter(`alert:tree:user:${userId}`, TREE_PLANT_WINDOW_MS)
  if (count > TREE_PLANT_ALERT_THRESHOLD) {
    logSecurityAlert('tree_plant_user_threshold', {
      user_id: userId,
      plant_count: count,
      threshold: TREE_PLANT_ALERT_THRESHOLD,
      window: '24h',
    })
  }
}
