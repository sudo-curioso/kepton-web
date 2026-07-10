-- =============================================================================
-- Kepton — OWASP A07 Auth Security (Supabase Dashboard + Management API)
-- =============================================================================
--
-- AUTOMATED (recommended):
--   cd apps/web
--   Add SUPABASE_ACCESS_TOKEN to .env.local (https://supabase.com/dashboard/account/tokens)
--   npm run apply:supabase-auth
--
-- MANUAL: Authentication → Rate Limits — set these exact values:
-- =============================================================================

-- | Dashboard field                         | Value | API field                      |
-- |-----------------------------------------|-------|--------------------------------|
-- | Rate limit for sign-ups and sign-ins    | 3     | rate_limit_otp                 |
-- | Rate limit for anonymous users          | 0     | rate_limit_anonymous_users     |
-- | Rate limit for token verifications      | 10    | rate_limit_verify              |
-- | Rate limit for Web3 sign-ups/sign-ins   | 0     | rate_limit_web3                |
-- | Rate limit for token refreshes          | 150   | rate_limit_token_refresh       |
-- | Rate limit for sending SMS messages     | 30    | rate_limit_sms_sent            |
-- | Rate limit for sending emails           | 20*   | rate_limit_email_sent          |
-- | IP address forwarding                   | ON    | security_sb_forwarded_for_enabled |
--
-- * email limit only applies with custom SMTP (Auth → SMTP).
--   Built-in provider stays at 2 emails/hour project-wide.

-- -----------------------------------------------------------------------------
-- JWT & SESSION (Auth → Settings)
-- -----------------------------------------------------------------------------
-- | Setting                    | Value   | API field                        |
-- |----------------------------|---------|----------------------------------|
-- | JWT expiry                 | 3600 s  | jwt_exp                          |
-- | Refresh token rotation     | ON      | refresh_token_rotation_enabled   |
-- | Session timebox            | 7 days  | sessions_timebox = 604800        |

-- -----------------------------------------------------------------------------
-- EMAIL & PASSWORD (Auth → Providers → Email)
-- -----------------------------------------------------------------------------
-- | Setting                    | Value                              |
-- |----------------------------|------------------------------------|
-- | Confirm email              | ON (mailer_autoconfirm = false)    |
-- | Minimum password length    | 8                                  |
-- | Password requirements      | lower + upper + digits             |
-- | Anonymous sign-ins         | OFF                                |

-- -----------------------------------------------------------------------------
-- APP-SIDE ENFORCEMENT (already in codebase)
-- -----------------------------------------------------------------------------
-- • /api/auth/login     — 5 failed attempts / email / 15 min (Upstash)
-- • /api/auth/*         — 10 requests / IP / 15 min (Upstash auth-ip)
-- • signOut({ scope: 'others' }) on login — single active device
-- • Enumeration-safe signup + forgot-password responses

-- -----------------------------------------------------------------------------
-- VERIFY (read-only)
-- -----------------------------------------------------------------------------
select count(*) as user_count from auth.users;
