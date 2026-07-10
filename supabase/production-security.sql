-- =============================================================================
-- Kepton — OWASP A05 Production Security Checklist (Supabase Dashboard)
-- Run verification queries before launch. Manual dashboard steps required.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EMAIL CONFIRMATIONS (Auth → Providers → Email)
--    Production: "Confirm email" MUST be ON.
--    Never ship with "Email confirmations OFF" in production.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 2. VERIFY RLS IS ENABLED ON EVERY public TABLE
--    Expected: rowsecurity = true for all application tables.
-- -----------------------------------------------------------------------------
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- Tables without RLS will show rowsecurity = false — enable before launch:
-- alter table public.<table> enable row level security;

-- -----------------------------------------------------------------------------
-- 3. VERIFY POLICIES EXIST (no table should have RLS with zero policies)
-- -----------------------------------------------------------------------------
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- -----------------------------------------------------------------------------
-- 4. SENSITIVE TABLE WRITE RESTRICTION (tasks, forest_trees)
--    After rls-policies.sql: clients should have SELECT only.
--    INSERT/UPDATE/DELETE go through API routes using service role.
-- -----------------------------------------------------------------------------
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('tasks', 'forest_trees')
order by tablename, cmd;

-- Expected: only SELECT policies for authenticated role on tasks + forest_trees.

-- -----------------------------------------------------------------------------
-- 5. AUTH SETTINGS (Dashboard → Authentication → Settings)
--    - Disable anonymous sign-ins unless explicitly required
--    - Set site URL to production domain (https://your-domain.com)
--    - Add redirect URLs for OAuth callback only
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 6. REALTIME — ensure publication matches dashboard-realtime.sql
-- -----------------------------------------------------------------------------
select pubname, schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by tablename;
