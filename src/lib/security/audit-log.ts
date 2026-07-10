/**
 * OWASP A09 — structured security audit logs.
 * Emits JSON to stdout (Vercel log drain / Axiom / Logtail compatible).
 * NEVER logs: passwords, JWTs, payment cards, or full email addresses.
 */

export type AuditLevel = 'info' | 'warn' | 'error' | 'alert'

export type AuditEvent =
  | 'auth.signup'
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.login.lockout'
  | 'auth.logout'
  | 'auth.password_reset'
  | 'account.deleted'
  | 'subscription.purchase'
  | 'subscription.cancellation'
  | 'subscription.restore'
  | 'subscription.expiry'
  | 'subscription.event'
  | 'rate_limit.violation'
  | 'security.alert'

type AuditPayload = Record<string, unknown>

const SENSITIVE_KEY = /password|token|jwt|authorization|card|cvv|pan|secret|cookie/i

/** Mask email: u***@example.com — never log full address */
export function maskEmail(email: string): string {
  const trimmed = email.trim().toLowerCase()
  const at = trimmed.indexOf('@')
  if (at <= 0) return '***'
  const local = trimmed.slice(0, at)
  const domain = trimmed.slice(at + 1)
  const maskedLocal = local.length <= 1 ? '*' : `${local[0]}***`
  return `${maskedLocal}@${domain}`
}

function redactValue(key: string, value: unknown): unknown {
  if (SENSITIVE_KEY.test(key)) return '[REDACTED]'
  if (typeof value === 'string' && value.length > 80 && /^eyJ/.test(value)) return '[REDACTED_JWT]'
  return value
}

function redactPayload(payload: AuditPayload): AuditPayload {
  const out: AuditPayload = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = redactPayload(value as AuditPayload)
    } else {
      out[key] = redactValue(key, value)
    }
  }
  return out
}

function emit(level: AuditLevel, event: AuditEvent, payload: AuditPayload): void {
  const entry = {
    level,
    category: 'security',
    event,
    timestamp: new Date().toISOString(),
    service: 'kepton-web',
    ...redactPayload(payload),
  }

  const line = JSON.stringify(entry)

  if (level === 'error' || level === 'alert') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }

  void forwardToExternalSink(entry)
}

async function forwardToExternalSink(entry: Record<string, unknown>): Promise<void> {
  const axiomToken = process.env.AXIOM_TOKEN
  const axiomDataset = process.env.AXIOM_DATASET
  if (!axiomToken || !axiomDataset) return

  try {
    await fetch(`https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${axiomToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([entry]),
    })
  } catch {
    // Never break request flow if external sink fails
  }
}

export function writeAuditLog(
  event: AuditEvent,
  payload: AuditPayload,
  level: AuditLevel = 'info',
): void {
  emit(level, event, payload)
}

export function logSecurityAlert(alertType: string, payload: AuditPayload): void {
  writeAuditLog('security.alert', { alert_type: alertType, ...payload }, 'alert')
}

export function logRateLimitViolation(payload: {
  endpoint: string
  bucket: string
  user_id?: string
  ip?: string
}): void {
  writeAuditLog('rate_limit.violation', payload, 'warn')
}

export function logAuthSignup(payload: { ip: string; email: string; user_id?: string }): void {
  writeAuditLog('auth.signup', {
    ip: payload.ip,
    email_masked: maskEmail(payload.email),
    user_id: payload.user_id ?? null,
  })
}

export function logAuthLoginSuccess(payload: { ip: string; email: string; user_id: string }): void {
  writeAuditLog('auth.login.success', {
    ip: payload.ip,
    email_masked: maskEmail(payload.email),
    user_id: payload.user_id,
  })
}

export function logAuthLoginFailed(payload: { ip: string; email: string; reason?: string }): void {
  writeAuditLog('auth.login.failed', {
    ip: payload.ip,
    email_masked: maskEmail(payload.email),
    reason: payload.reason ?? 'invalid_credentials',
  })
}

export function logAuthLoginLockout(payload: { ip: string; email: string }): void {
  writeAuditLog('auth.login.lockout', {
    ip: payload.ip,
    email_masked: maskEmail(payload.email),
  }, 'warn')
}

export function logAuthLogout(payload: { ip: string; user_id: string }): void {
  writeAuditLog('auth.logout', { ip: payload.ip, user_id: payload.user_id })
}

export function logAuthPasswordReset(payload: { ip: string; email: string }): void {
  writeAuditLog('auth.password_reset', {
    ip: payload.ip,
    email_masked: maskEmail(payload.email),
  })
}

export function logAccountDeleted(payload: { ip: string; user_id: string; email: string }): void {
  writeAuditLog(
    'account.deleted',
    {
      ip: payload.ip,
      user_id: payload.user_id,
      email_masked: maskEmail(payload.email),
    },
    'warn',
  )
}

export function logSubscriptionEvent(
  category: AuditEvent,
  payload: { user_id: string; provider_event: string; plan?: string },
): void {
  writeAuditLog(category, {
    user_id: payload.user_id,
    provider_event: payload.provider_event,
    plan: payload.plan ?? null,
  })
}

/** Map RevenueCat event types to audit categories */
export function mapRevenueCatAuditEvent(eventType: string): AuditEvent {
  switch (eventType) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'NON_RENEWING_PURCHASE':
    case 'PRODUCT_CHANGE':
      return 'subscription.purchase'
    case 'CANCELLATION':
      return 'subscription.cancellation'
    case 'UNCANCELLATION':
      return 'subscription.restore'
    case 'EXPIRATION':
      return 'subscription.expiry'
    default:
      if (/RESTORE|RECOVER/i.test(eventType)) return 'subscription.restore'
      return 'subscription.event'
  }
}
