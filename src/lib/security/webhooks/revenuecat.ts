import crypto from 'crypto'
import { isProduction } from '@/lib/security/transport'

const MAX_CLOCK_SKEW_SEC = 300

type SignatureParts = {
  timestamp: number
  signature: string
}

export type WebhookVerifyResult = { ok: true } | { ok: false; status: number; error: string }

function parseSignatureHeader(header: string): SignatureParts | null {
  const parts = header.split(',').map(p => p.trim())
  let timestamp: number | null = null
  let signature: string | null = null

  for (const part of parts) {
    if (part.startsWith('t=')) timestamp = Number(part.slice(2))
    if (part.startsWith('v1=')) signature = part.slice(3)
  }

  if (!timestamp || !signature || !Number.isFinite(timestamp)) return null
  return { timestamp, signature }
}

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a, 'hex')
    const bBuf = Buffer.from(b, 'hex')
    if (aBuf.length !== bBuf.length) return false
    return crypto.timingSafeEqual(aBuf, bBuf)
  } catch {
    return false
  }
}

function normalizeAuth(value: string): string {
  const trimmed = value.trim()
  return trimmed.toLowerCase().startsWith('bearer ') ? trimmed : `Bearer ${trimmed}`
}

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

function verifyHmacSignature(rawBody: string, sigHeader: string, signingSecret: string): WebhookVerifyResult {
  const parsed = parseSignatureHeader(sigHeader)
  if (!parsed) {
    return { ok: false, status: 401, error: 'Invalid webhook signature header' }
  }

  const nowSec = Math.floor(Date.now() / 1000)
  if (Math.abs(nowSec - parsed.timestamp) > MAX_CLOCK_SKEW_SEC) {
    return { ok: false, status: 401, error: 'Webhook timestamp outside allowed window' }
  }

  const expected = crypto
    .createHmac('sha256', signingSecret)
    .update(`${parsed.timestamp}.${rawBody}`)
    .digest('hex')

  if (!timingSafeEqualHex(expected, parsed.signature)) {
    return { ok: false, status: 401, error: 'Webhook signature mismatch' }
  }

  return { ok: true }
}

/**
 * A08 — Authorization header MUST match webhook secret before any processing.
 * Set the same value in RevenueCat dashboard → Webhooks → Authorization header.
 */
export function verifyRevenueCatAuthorization(headers: Headers): WebhookVerifyResult {
  const authSecret = process.env.REVENUECAT_WEBHOOK_AUTH
  const authHeader = headers.get('authorization')

  if (!authSecret) {
    if (isProduction()) {
      return { ok: false, status: 500, error: 'REVENUECAT_WEBHOOK_AUTH is not configured' }
    }
    return { ok: true }
  }

  if (!authHeader) {
    return { ok: false, status: 401, error: 'Missing Authorization header' }
  }

  if (!timingSafeEqualString(normalizeAuth(authHeader), normalizeAuth(authSecret))) {
    return { ok: false, status: 401, error: 'Invalid Authorization header' }
  }

  return { ok: true }
}

/**
 * Verify every RevenueCat webhook:
 * 1. Authorization header (required)
 * 2. HMAC signature (optional extra layer when configured)
 */
export function verifyRevenueCatWebhook(rawBody: string, headers: Headers): WebhookVerifyResult {
  const authResult = verifyRevenueCatAuthorization(headers)
  if (!authResult.ok) return authResult

  const signingSecret = process.env.REVENUECAT_WEBHOOK_SIGNING_SECRET
  const sigHeader = headers.get('x-revenuecat-webhook-signature')

  if (signingSecret && sigHeader) {
    return verifyHmacSignature(rawBody, sigHeader, signingSecret)
  }

  return { ok: true }
}

export type RevenueCatWebhookPayload = {
  api_version?: string
  event?: {
    type?: string
    app_user_id?: string
    expiration_at_ms?: number | null
    entitlement_ids?: string[] | null
  }
}

const PRO_GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'PRODUCT_CHANGE',
])

const PRO_REVOKE_EVENTS = new Set(['EXPIRATION'])

export function resolvePlanFromEvent(eventType: string | undefined): 'pro' | 'free' | null {
  if (!eventType) return null
  if (PRO_GRANT_EVENTS.has(eventType)) return 'pro'
  if (PRO_REVOKE_EVENTS.has(eventType)) return 'free'
  return null
}
