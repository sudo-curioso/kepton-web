#!/usr/bin/env node
/**
 * OWASP A02 — audit public env var naming (NEXT_PUBLIC_* / EXPO_PUBLIC_*).
 * Run: npm run audit:env
 *
 * EXPO_PUBLIC_* values are embedded in the compiled Expo bundle.
 * NEXT_PUBLIC_* values are embedded in the Next.js client bundle.
 */

const FORBIDDEN_NAME = /(SERVICE.?ROLE|SECRET|PRIVATE|API.?KEY|PASSWORD|PAYMENT|STRIPE|GROQ)/i
const FORBIDDEN_VALUE = /^(sk_|rk_|service_role)/i

let failed = false

for (const [key, value] of Object.entries(process.env)) {
  if (!key.startsWith('NEXT_PUBLIC_') && !key.startsWith('EXPO_PUBLIC_')) continue

  if (FORBIDDEN_NAME.test(key)) {
    console.error(`FAIL: ${key} — secret-like name must not use a public prefix`)
    failed = true
  }

  if (value && FORBIDDEN_VALUE.test(value)) {
    console.error(`FAIL: ${key} — value looks like a server secret`)
    failed = true
  }
}

if (failed) {
  process.exit(1)
}

console.log('OK: public env var audit passed')
