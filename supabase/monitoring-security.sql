-- =============================================================================
-- Kepton — OWASP A09 Security Logging and Monitoring
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. STRUCTURED LOGS (stdout JSON — captured by Vercel)
-- -----------------------------------------------------------------------------
-- All security events emit JSON lines with:
--   level, category, event, timestamp, service, ip, user_id, email_masked
--
-- Events logged:
--   auth.signup | auth.login.success | auth.login.failed | auth.login.lockout
--   auth.logout | auth.password_reset
--   subscription.purchase | .cancellation | .restore | .expiry | .event
--   rate_limit.violation
--   security.alert

-- NEVER logged: passwords, JWTs, payment cards, full emails

-- -----------------------------------------------------------------------------
-- 2. PERSISTENT LOG DRAIN (Vercel Dashboard)
-- -----------------------------------------------------------------------------
-- Project → Settings → Log Drains → Add Drain
-- Recommended: Axiom (free tier) or Logtail
--
-- Axiom setup:
--   1. Create dataset: kepton-security
--   2. Vercel integration or manual drain → https://api.axiom.co/v1/datasets/kepton-security/ingest
--   3. Set env: AXIOM_TOKEN=...  AXIOM_DATASET=kepton-security
--
-- Optional server-side forward: apps/web forwards audit JSON when AXIOM_* env set

-- -----------------------------------------------------------------------------
-- 3. ALERT QUERIES (Axiom / Logtail)
-- -----------------------------------------------------------------------------

-- Failed login burst (>10 from same IP in 5 min):
-- ['kepton-security']
-- | where event == "security.alert" and alert_type == "failed_login_ip_threshold"

-- Tree plant abuse (>50 per user in 24h):
-- ['kepton-security']
-- | where event == "security.alert" and alert_type == "tree_plant_user_threshold"

-- Rate limit violations spike:
-- ['kepton-security']
-- | where event == "rate_limit.violation"
-- | summarize count() by endpoint, bin(timestamp, 5m)

-- Auth failure trend:
-- ['kepton-security']
-- | where event == "auth.login.failed"
-- | summarize count() by ip, bin(timestamp, 5m)

-- -----------------------------------------------------------------------------
-- 4. IN-APP ALERT THRESHOLDS (server-side, audit-alerts.ts)
-- -----------------------------------------------------------------------------
-- • >10 failed logins / IP / 5 min  → security.alert failed_login_ip_threshold
-- • >50 tree plants / user / 24h    → security.alert tree_plant_user_threshold

-- -----------------------------------------------------------------------------
-- 5. VERIFICATION (manual)
-- -----------------------------------------------------------------------------
-- Trigger test login failure → check Vercel Runtime Logs for JSON:
-- {"event":"auth.login.failed","email_masked":"u***@example.com",...}
