import { assertHttpsUrl, isProduction } from './transport'

/**
 * NEXT_PUBLIC_* / EXPO_PUBLIC_* — safe to embed in client bundles.
 * Never prefix secrets with these (they ship in compiled JS).
 */
export const CLIENT_SAFE_PUBLIC_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_PLAY_STORE_URL',
  'NEXT_PUBLIC_PLAY_STORE_LIVE',
  'NEXT_PUBLIC_APP_URL',
] as const

/** Patterns that must never appear in public-prefixed env var names */
const FORBIDDEN_PUBLIC_NAME = /(SERVICE.?ROLE|SECRET|PRIVATE|API.?KEY|PASSWORD|TOKEN|PAYMENT|STRIPE|GROQ)/i

/** Patterns that must never appear in public env values */
const FORBIDDEN_PUBLIC_VALUE = /^(sk_|rk_|service_role|eyJhbGci)/i

/**
 * Server startup audit — OWASP A02.
 * - Service role key: server env only (SUPABASE_SERVICE_ROLE_KEY, no NEXT_PUBLIC_ prefix)
 * - Supabase Auth handles passwords (bcrypt); we never store password hashes
 * - JWT signing: Supabase RS256 only — no custom token signing in this app
 */
export function validateServerEnv(): void {
  auditPublicEnvVars()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    assertHttpsUrl(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  }

  if (isProduction() && !process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('A05: NEXT_PUBLIC_APP_URL is required in production (CORS allowlist)')
  }

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceRole && FORBIDDEN_PUBLIC_VALUE.test(serviceRole)) {
    // Ensure it wasn't accidentally copied into a NEXT_PUBLIC_ var
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('NEXT_PUBLIC_') && value === serviceRole) {
        throw new Error(`A02: Service role key leaked into ${key}`)
      }
    }
  }
}

export function auditPublicEnvVars(): void {
  for (const [key, value] of Object.entries(process.env)) {
    const isPublic = key.startsWith('NEXT_PUBLIC_') || key.startsWith('EXPO_PUBLIC_')
    if (!isPublic) continue

    if (FORBIDDEN_PUBLIC_NAME.test(key)) {
      throw new Error(
        `A02: ${key} must not be public — move to server-only env (no NEXT_PUBLIC_/EXPO_PUBLIC_ prefix)`,
      )
    }

    if (value && FORBIDDEN_PUBLIC_VALUE.test(value)) {
      throw new Error(`A02: ${key} appears to contain a secret value — use server-only env vars`)
    }
  }
}

export function getPublicSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase public env vars are not configured')
  }

  assertHttpsUrl(url, 'NEXT_PUBLIC_SUPABASE_URL')
  return { url, anonKey }
}
