/**
 * Apply Kepton OWASP A04/A07 Supabase Auth configuration via Management API.
 *
 * Prerequisites:
 *   1. Create a personal access token: https://supabase.com/dashboard/account/tokens
 *   2. Add to apps/web/.env.local:
 *        SUPABASE_ACCESS_TOKEN=sbp_...
 *
 * Usage:
 *   cd apps/web && npm run apply:supabase-auth
 *   npm run apply:supabase-auth -- --dry-run
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function loadEnvLocal() {
  const path = resolve(ROOT, '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const dryRun = process.argv.includes('--dry-run')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const accessToken = process.env.SUPABASE_ACCESS_TOKEN

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
if (!projectRef) {
  console.error('Could not parse project ref from Supabase URL')
  process.exit(1)
}

if (!accessToken) {
  console.error(`
Missing SUPABASE_ACCESS_TOKEN.

1. Open https://supabase.com/dashboard/account/tokens
2. Create a token (name: kepton-auth-config)
3. Add to apps/web/.env.local:
   SUPABASE_ACCESS_TOKEN=sbp_your_token_here
4. Re-run: npm run apply:supabase-auth
`)
  process.exit(1)
}

/** Kepton production auth hardening — matches A04 + A07 requirements */
const TARGET_AUTH_CONFIG = {
  // A07 — JWT 1h, refresh rotation, 7-day session timebox
  jwt_exp: 3600,
  refresh_token_rotation_enabled: true,
  sessions_timebox: 604800,

  // A05/A07 — email confirmations ON (mailer_autoconfirm false = require confirm)
  mailer_autoconfirm: false,

  // A07 — password policy (server + dashboard)
  password_min_length: 8,
  password_required_characters: 'lower_upper_letters_digits',

  // Disable anonymous sign-in (Kepton uses email/password only)
  external_anonymous_users_enabled: false,

  // Forward client IP for accurate per-IP rate limits behind Vercel
  security_sb_forwarded_for_enabled: true,

  // Rate limits (5-minute windows unless noted)
  rate_limit_otp: 3, // sign-ups + sign-ins (~9 per 15 min; aligns with app 10/IP/15m)
  rate_limit_anonymous_users: 0,
  rate_limit_verify: 10, // token verifications / OTP verify
  rate_limit_web3: 0,
  rate_limit_token_refresh: 150,
  rate_limit_sms_sent: 30,
  // Requires custom SMTP — ignored on built-in email provider (stays 2/h project-wide)
  rate_limit_email_sent: 20,
}

const API = `https://api.supabase.com/v1/projects/${projectRef}/config/auth`

function pickRateLimits(config) {
  return Object.fromEntries(
    Object.entries(config).filter(([key]) => key.startsWith('rate_limit_')),
  )
}

async function api(method, body) {
  const res = await fetch(API, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }

  if (!res.ok) {
    throw new Error(`Management API ${method} ${res.status}: ${text}`)
  }

  return json
}

async function main() {
  console.log(`Project: ${projectRef}`)
  console.log('Fetching current auth config…')

  const current = await api('GET')
  const currentRates = pickRateLimits(current)

  console.log('\nCurrent rate limits:')
  console.table(currentRates)

  console.log('\nTarget configuration:')
  console.table(TARGET_AUTH_CONFIG)

  if (dryRun) {
    console.log('\n[dry-run] No changes applied.')
    return
  }

  console.log('\nApplying auth configuration…')
  const updated = await api('PATCH', TARGET_AUTH_CONFIG)

  console.log('\nUpdated rate limits:')
  console.table(pickRateLimits(updated))

  console.log('\nKey settings:')
  console.log(`  jwt_exp:                         ${updated.jwt_exp}`)
  console.log(`  refresh_token_rotation_enabled:  ${updated.refresh_token_rotation_enabled}`)
  console.log(`  sessions_timebox:                ${updated.sessions_timebox}`)
  console.log(`  mailer_autoconfirm:              ${updated.mailer_autoconfirm} (false = confirmations ON)`)
  console.log(`  external_anonymous_users_enabled:${updated.external_anonymous_users_enabled}`)
  console.log(`  security_sb_forwarded_for_enabled: ${updated.security_sb_forwarded_for_enabled}`)

  console.log(`
Done. Verify in dashboard:
  https://supabase.com/dashboard/project/${projectRef}/auth/rate-limits

Note: rate_limit_email_sent only applies with custom SMTP.
      Built-in email provider stays at 2 emails/hour project-wide.
      Set up Auth → SMTP for production signup volume.
`)
}

main().catch(err => {
  console.error(err.message ?? err)
  process.exit(1)
})
