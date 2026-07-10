import { DASHBOARD_PATH } from '@/lib/constants'

/** Blocks open redirects — only same-origin relative paths are allowed */
export function sanitizeRedirectPath(next: string | null | undefined, fallback = DASHBOARD_PATH): string {
  if (!next || typeof next !== 'string') return fallback

  const trimmed = next.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback
  if (trimmed.includes('://') || trimmed.includes('\\')) return fallback

  try {
    const url = new URL(trimmed, 'http://localhost')
    if (url.username || url.password || url.host !== 'localhost') return fallback
    return url.pathname + url.search + url.hash
  } catch {
    return fallback
  }
}
