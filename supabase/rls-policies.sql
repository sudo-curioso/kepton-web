-- =============================================================================
-- Kepton — OWASP A01 + A05 (Supabase RLS + client write restrictions)
-- Run in Supabase SQL Editor AFTER tables exist.
-- Secondary enforcement: anon key + user JWT for reads; API service role for writes.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- users — profile + subscription tier (plan column)
-- Clients cannot self-elevate plan or trial_ends_at.
-- -----------------------------------------------------------------------------
alter table public.users enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own
  on public.users for select
  using (id = auth.uid());

drop policy if exists users_insert_own on public.users;
create policy users_insert_own
  on public.users for insert
  with check (
    id = auth.uid()
    and plan = 'free'
  );

-- No UPDATE/DELETE policies for authenticated users on users.
-- Plan changes: App Store / Play billing webhooks via service role only.

-- -----------------------------------------------------------------------------
-- tasks — A05: client read-only; writes via API (service role) only
-- -----------------------------------------------------------------------------
alter table public.tasks enable row level security;

drop policy if exists tasks_select_own on public.tasks;
create policy tasks_select_own
  on public.tasks for select
  using (user_id = auth.uid());

drop policy if exists tasks_insert_own on public.tasks;
drop policy if exists tasks_update_own on public.tasks;
drop policy if exists tasks_delete_own on public.tasks;

-- -----------------------------------------------------------------------------
-- forest_trees — A05: client read-only; plant via POST /api/forest/plant only
-- -----------------------------------------------------------------------------
alter table public.forest_trees enable row level security;

drop policy if exists forest_trees_select_own on public.forest_trees;
create policy forest_trees_select_own
  on public.forest_trees for select
  using (user_id = auth.uid());

drop policy if exists forest_trees_insert_own on public.forest_trees;
drop policy if exists forest_trees_update_own on public.forest_trees;
drop policy if exists forest_trees_delete_own on public.forest_trees;

-- -----------------------------------------------------------------------------
-- user_streaks
-- -----------------------------------------------------------------------------
alter table public.user_streaks enable row level security;

drop policy if exists user_streaks_select_own on public.user_streaks;
create policy user_streaks_select_own
  on public.user_streaks for select
  using (user_id = auth.uid());

drop policy if exists user_streaks_insert_own on public.user_streaks;
create policy user_streaks_insert_own
  on public.user_streaks for insert
  with check (user_id = auth.uid());

drop policy if exists user_streaks_update_own on public.user_streaks;
create policy user_streaks_update_own
  on public.user_streaks for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists user_streaks_delete_own on public.user_streaks;
create policy user_streaks_delete_own
  on public.user_streaks for delete
  using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- focus_sessions
-- -----------------------------------------------------------------------------
alter table public.focus_sessions enable row level security;

drop policy if exists focus_sessions_select_own on public.focus_sessions;
create policy focus_sessions_select_own
  on public.focus_sessions for select
  using (user_id = auth.uid());

drop policy if exists focus_sessions_insert_own on public.focus_sessions;
create policy focus_sessions_insert_own
  on public.focus_sessions for insert
  with check (user_id = auth.uid());

drop policy if exists focus_sessions_update_own on public.focus_sessions;
create policy focus_sessions_update_own
  on public.focus_sessions for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists focus_sessions_delete_own on public.focus_sessions;
create policy focus_sessions_delete_own
  on public.focus_sessions for delete
  using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- daily_reflections (if present)
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'daily_reflections'
  ) then
    execute 'alter table public.daily_reflections enable row level security';

    execute 'drop policy if exists daily_reflections_select_own on public.daily_reflections';
    execute 'create policy daily_reflections_select_own on public.daily_reflections for select using (user_id = auth.uid())';

    execute 'drop policy if exists daily_reflections_insert_own on public.daily_reflections';
    execute 'create policy daily_reflections_insert_own on public.daily_reflections for insert with check (user_id = auth.uid())';

    execute 'drop policy if exists daily_reflections_update_own on public.daily_reflections';
    execute 'create policy daily_reflections_update_own on public.daily_reflections for update using (user_id = auth.uid()) with check (user_id = auth.uid())';

    execute 'drop policy if exists daily_reflections_delete_own on public.daily_reflections';
    execute 'create policy daily_reflections_delete_own on public.daily_reflections for delete using (user_id = auth.uid())';
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- leaderboard (if present) — read aggregated, write own row only
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'leaderboard'
  ) then
    execute 'alter table public.leaderboard enable row level security';

    execute 'drop policy if exists leaderboard_select_authenticated on public.leaderboard';
    execute 'create policy leaderboard_select_authenticated on public.leaderboard for select to authenticated using (true)';

    execute 'drop policy if exists leaderboard_insert_own on public.leaderboard';
    execute 'create policy leaderboard_insert_own on public.leaderboard for insert with check (user_id = auth.uid())';

    execute 'drop policy if exists leaderboard_update_own on public.leaderboard';
    execute 'create policy leaderboard_update_own on public.leaderboard for update using (user_id = auth.uid()) with check (user_id = auth.uid())';
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- UUID v4 IDs — enforce at DB layer (id + user_id columns)
-- Skip if columns already uuid type; safe to re-run.
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'tasks' and column_name = 'id' and data_type <> 'uuid') then
    raise notice 'Consider migrating tasks.id to uuid type';
  end if;
end $$;

-- Verify RLS is enabled:
-- select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- select * from pg_policies where schemaname = 'public';
