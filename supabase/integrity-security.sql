-- =============================================================================
-- Kepton — OWASP A08 Software and Data Integrity Failures
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. REVENUECAT WEBHOOK (server: /api/webhooks/revenuecat)
-- -----------------------------------------------------------------------------
-- RevenueCat dashboard → Webhooks → Authorization header:
--   Set the SAME value as Vercel env REVENUECAT_WEBHOOK_AUTH
--   Example: Bearer <long-random-secret>
--
-- Server rejects ALL webhooks without matching Authorization header.
-- Optional: enable HMAC signing → REVENUECAT_WEBHOOK_SIGNING_SECRET

-- -----------------------------------------------------------------------------
-- 2. OFFLINE SYNC INTEGRITY (server: POST /api/sync)
-- -----------------------------------------------------------------------------
-- Validated before insert:
--   • session_duration / duration_s  > 0  (max 3 hours)
--   • planted_at / grown_at          not in the future, not older than 7 days
--   • client_timestamp               same 7-day window (A04)
--
-- Event types persisted after validation:
--   focus_session | session  → focus_sessions table
--   tree_plant    | forest_tree → forest_trees table

-- -----------------------------------------------------------------------------
-- 3. MOBILE OTA UPDATES (Expo / EAS Update — separate mobile repo)
-- -----------------------------------------------------------------------------
-- USE EAS Update for:
--   • UI tweaks, copy, styling, non-sensitive bug fixes
--   • Forest visuals, timer animations, dashboard layout
--
-- NEVER ship via OTA (require full App Store / Play Store release):
--   • Authentication flows, JWT handling, session storage
--   • Payment / RevenueCat / subscription logic
--   • API security, rate limits, webhook handlers
--   • Supabase RLS assumptions, service role usage
--   • Offline sync integrity validators
--
-- eas.json channels:
--   production — stable, store-linked binary
--   preview    — internal QA only
--
-- Command reference (mobile repo):
--   eas update --channel production --message "UI fix only"
--   eas build --platform android|ios  (required for auth/payment changes)

-- -----------------------------------------------------------------------------
-- VERIFY focus_sessions integrity (read-only audit)
-- -----------------------------------------------------------------------------
select id, user_id, duration_s, completed, created_at
from public.focus_sessions
where duration_s <= 0
limit 10;

select id, user_id, grown_at
from public.forest_trees
where grown_at > now() + interval '1 minute'
limit 10;
