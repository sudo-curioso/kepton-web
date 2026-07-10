-- =============================================================================
-- Kepton — Account deletion (DPDPA + Play Store)
-- Run in Supabase SQL Editor if you want DB-level cascade as a safety net.
-- Primary deletion path: DELETE /api/user (service role via API).
-- =============================================================================

-- Optional: ensure auth user deletion cascades to public.users when configured
-- (Supabase Auth deleteUser already removes auth.users; app data deleted by API.)

-- Verify no orphaned rows after manual test deletion:
-- select 'tasks' as tbl, count(*) from public.tasks where user_id = '<uuid>'
-- union all select 'forest_trees', count(*) from public.forest_trees where user_id = '<uuid>'
-- union all select 'focus_sessions', count(*) from public.focus_sessions where user_id = '<uuid>'
-- union all select 'user_streaks', count(*) from public.user_streaks where user_id = '<uuid>'
-- union all select 'users', count(*) from public.users where id = '<uuid>';
